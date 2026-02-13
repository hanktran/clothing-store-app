import { redirect } from "next/navigation";

import { Metadata } from "next";

import { auth } from "@/auth";
import { ShippingAddress } from "@/types";

import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";

import ShippingAddressForm from "./shipping-address-form";

export const metadata: Metadata = {
    title: "Shipping Address",
};

const ShippingAddressPage = async () => {
    const cart = await getMyCart();
    if (!cart || cart.items.length === 0) {
        return redirect("/cart");
    }

    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        throw new Error("User Id not found");
    }

    const user = await getUserById(userId);

    return <ShippingAddressForm address={user.address as ShippingAddress} />;
};

export default ShippingAddressPage;
