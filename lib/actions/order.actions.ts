"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";

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

      for (const item of cart.items as CartItem[]) {
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
