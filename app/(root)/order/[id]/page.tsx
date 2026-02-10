import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
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
    />
  );
};

export default OrderDetailsPage;
