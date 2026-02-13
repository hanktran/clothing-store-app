import { notFound } from "next/navigation";

import { Metadata } from "next";

import { auth } from "@/auth";
import { ShippingAddress } from "@/types";

import { getOrderById } from "@/lib/actions/order.actions";

import OrderDetailsTable from "./order-details-table";

export const metadata: Metadata = {
    title: "Order Details",
};

const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
    const params = await props.params;
    const id = params.id;
    const order = await getOrderById(id);
    if (!order) {
        return notFound();
    }

    const session = await auth();

    return (
        <OrderDetailsTable
            order={{
                ...order,
                itemsPrice: order.itemsPrice.toString(),
                taxPrice: order.taxPrice.toString(),
                shippingPrice: order.shippingPrice.toString(),
                totalPrice: order.totalPrice.toString(),
                shippingAddress: order.shippingAddress as ShippingAddress,
                orderItems: order.orderItems.map((item) => ({
                    ...item,
                    price: item.price.toString(),
                })),
            }}
            isAdmin={session?.user.role === "admin"}
        />
    );
};

export default OrderDetailsPage;
