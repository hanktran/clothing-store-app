"use server";

import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { sendPurchaseReceipt } from "@/email";
import { ShippingAddress } from "@/types";

import { convertToPlainObject, formatError } from "../utils";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { PAGE_SIZE } from "../constants";
import { Prisma } from "../generated/prisma";
import { insertOrderSchema } from "../validators";

export const createOrder = async () => {
    try {
        const session = await auth();
        if (!session) {
            throw new Error("User not authenticated");
        }

        const userId = session.user?.id as string;
        if (!userId) {
            throw new Error("User not authenticated");
        }
        const user = await getUserById(userId);
        if (!user.address) {
            return {
                success: false,
                message: "Shipping address is missing",
                redirectTo: "/shipping-address",
            };
        }
        if (!user.paymentMethod) {
            return {
                success: false,
                message: "Payment method is missing",
                redirectTo: "/payment-method",
            };
        }

        const cart = await getMyCart();
        if (!cart || cart.items.length === 0) {
            return {
                success: false,
                message: "Cart is empty",
                redirectTo: "/cart",
            };
        }

        const order = insertOrderSchema.parse({
            userId,
            shippingAddress: user.address,
            paymentMethod: user.paymentMethod,
            itemsPrice: cart.itemsPrice.toString(),
            taxPrice: cart.taxPrice.toString(),
            shippingPrice: cart.shippingPrice.toString(),
            totalPrice: cart.totalPrice.toString(),
        });

        const insertedOrderId = await prisma.$transaction(async (tx) => {
            const insertedOrder = await tx.order.create({ data: order });

            for (const item of cart.items) {
                await tx.orderItem.create({
                    data: {
                        ...item,
                        price: item.price.toString(),
                        orderId: insertedOrder.id,
                    },
                });
            }

            await tx.cart.update({
                where: { id: cart.id },
                data: {
                    items: [],
                    itemsPrice: 0,
                    taxPrice: 0,
                    shippingPrice: 0,
                    totalPrice: 0,
                },
            });

            return insertedOrder.id;
        });
        if (!insertedOrderId) {
            throw new Error("Failed to create order");
        }

        return {
            success: true,
            message: "Order created successfully",
            redirectTo: `/order/${insertedOrderId}`,
        };
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        return { success: false, message: formatError(error) };
    }
};

export async function getOrderById(orderId: string) {
    const data = await prisma.order.findFirst({
        where: { id: orderId },
        include: {
            orderItems: true,
            user: { select: { name: true, email: true } },
        },
    });

    return convertToPlainObject(data);
}

export async function getMyOrders({
    limit = PAGE_SIZE,
    page,
}: {
    limit?: number;
    page: number;
}) {
    const session = await auth();
    if (!session) {
        throw new Error("User not authenticated");
    }

    const data = await prisma.order.findMany({
        where: { userId: session.user?.id },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
    });

    const dataCount = await prisma.order.count({
        where: { userId: session.user?.id },
    });

    return {
        data,
        totalPages: Math.ceil(dataCount / limit),
    };
}

type SalesDataType = {
    month: string;
    totalSales: number;
}[];
export async function getOrderSummary() {
    // Get counts for each resource
    const ordersCount = await prisma.order.count();
    const productsCount = await prisma.product.count();
    const usersCount = await prisma.user.count();

    // Calculate total sales
    const totalSales = await prisma.order.aggregate({
        _sum: { totalPrice: true },
    });

    // Get monthly sales
    const salesDataRaw = await prisma.$queryRaw<
        Array<{ month: string; totalSales: Prisma.Decimal }>
    >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`;

    const salesData: SalesDataType = salesDataRaw.map((entry) => ({
        month: entry.month,
        totalSales: Number(entry.totalSales), // Convert Decimal to number
    }));

    // Get latest sales
    const latestOrders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: { select: { name: true } },
        },
        take: 6,
    });

    return {
        ordersCount,
        productsCount,
        usersCount,
        totalSales,
        latestOrders,
        salesData,
    };
}

export async function getAllOrders({
    limit = PAGE_SIZE,
    page,
    query,
}: {
    limit?: number;
    page: number;
    query?: string;
}) {
    const queryFilter: Prisma.OrderWhereInput =
        query && query !== "all"
            ? {
                  user: {
                      name: {
                          contains: query,
                          mode: "insensitive",
                      } as Prisma.StringFilter,
                  },
              }
            : {};

    const data = await prisma.order.findMany({
        where: {
            ...queryFilter,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
        include: {
            user: {
                select: { name: true },
            },
        },
    });

    const dataCount = await prisma.order.count();

    return {
        data,
        totalPages: Math.ceil(dataCount / limit),
    };
}

export async function deleteOrder(id: string) {
    try {
        await prisma.order.delete({
            where: { id },
        });

        revalidatePath("/admin/orders");

        return { success: true, message: "Order deleted successfully" };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function updateOrderToPaid({ orderId }: { orderId: string }) {
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
        },
        include: {
            orderItems: true,
        },
    });

    if (!order) throw new Error("Order not found");

    if (order.isPaid) throw new Error("Order is already paid");

    // Transaction to update order and account for product stock
    await prisma.$transaction(async (tx) => {
        // Iterate over products and update stock
        for (const item of order.orderItems) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { increment: -item.qty } },
            });
        }

        // Set the order to paid
        await tx.order.update({
            where: { id: orderId },
            data: {
                isPaid: true,
                paidAt: new Date(),
            },
        });
    });

    const updatedOrder = await prisma.order.findFirst({
        where: {
            id: orderId,
        },
        include: {
            orderItems: true,
            user: { select: { name: true, email: true } },
        },
    });

    if (!updatedOrder) {
        throw new Error("Order not found");
    }

    // Send the purchase receipt email with the updated order
    try {
        await sendPurchaseReceipt({
            order: {
                ...updatedOrder,
                shippingAddress:
                    updatedOrder.shippingAddress as ShippingAddress,
            },
        });
    } catch (error) {
        console.error("Failed to send purchase receipt email:", error);
        // Don't throw error - order is already updated successfully
    }
}

export async function updateOrderToPaidByCOD(orderId: string) {
    try {
        await updateOrderToPaid({ orderId });
        revalidatePath(`/order/${orderId}`);
        return { success: true, message: "Order payment updated successfully" };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function deliverOrder(orderId: string) {
    try {
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
            },
        });
        if (!order) throw new Error("Order not found");
        if (!order.isPaid) throw new Error("Order is not paid");
        if (order.isDelivered) throw new Error("Order is already delivered");

        await prisma.order.update({
            where: { id: orderId },
            data: {
                isDelivered: true,
                deliveredAt: new Date(),
            },
        });
        revalidatePath(`/order/${orderId}`);
        return { success: true, message: "Order delivered successfully" };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}
