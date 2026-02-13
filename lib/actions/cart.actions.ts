"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";

import { Prisma } from "@/lib/generated/prisma";

import { formatError, round2 } from "../utils";
import { convertToPlainObject } from "../utils";
import { cartItemSchema, insertCartSchema } from "../validators";

export async function addItemToCart(data: z.infer<typeof cartItemSchema>) {
    try {
        const sessionCartId = (await cookies()).get("sessionCartId")?.value;
        if (!sessionCartId) {
            throw new Error("No session cart ID found");
        }

        const session = await auth();
        const userId = session?.user?.id
            ? (session.user.id as string)
            : undefined;

        const cart = await getMyCart();
        const item = cartItemSchema.parse(data);
        const product = await prisma.product.findFirst({
            where: { id: item.productId },
        });
        if (!product) {
            throw new Error("Product not found");
        }

        if (!cart) {
            const newCart = insertCartSchema.parse({
                userId,
                items: [item],
                sessionCartId,
                ...calcPrice([item]),
            });
            await prisma.cart.create({ data: newCart });

            revalidatePath("/cart");

            return { success: true, message: "Item added to cart" };
        } else {
            const existItem = (cart.items as CartItem[]).find(
                (i) => i.productId === item.productId,
            );
            if (existItem) {
                if (product.stock < existItem.qty + 1) {
                    throw new Error("Not enough stock available");
                }

                (cart.items as CartItem[]).find(
                    (i) => i.productId === item.productId,
                )!.qty += 1;
            } else {
                if (product.stock < 1) {
                    throw new Error("Not enough stock available");
                }
                cart.items.push(item);
            }

            await prisma.cart.update({
                where: {
                    id: cart.id,
                },
                data: {
                    items: cart.items as Prisma.CartUpdateitemsInput[],
                    ...calcPrice(
                        cart.items as z.infer<typeof cartItemSchema>[],
                    ),
                },
            });

            revalidatePath(`/product/${product.slug}`);

            return {
                success: true,
                message: `${product.name} ${
                    existItem ? "updated in" : "added to"
                } cart successfully`,
            };
        }
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

const calcPrice = (items: z.infer<typeof cartItemSchema>[]) => {
    const itemsPrice = round2(
        items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
    );
    const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
    const taxPrice = round2(0.15 * itemsPrice);
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
    };
};

export async function getMyCart() {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) {
        return undefined;
    }

    const session = await auth();
    const userId = session?.user?.id;

    const cart = await prisma.cart.findFirst({
        where: userId ? { userId } : { sessionCartId },
    });

    if (!cart) {
        return undefined;
    }

    return convertToPlainObject({
        ...cart,
        items: cart.items as CartItem[],
        itemsPrice: cart.itemsPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),
    });
}

export async function removeItemFromCart(productId: string) {
    try {
        const sessionCartId = (await cookies()).get("sessionCartId")?.value;
        if (!sessionCartId) {
            throw new Error("No session cart ID found");
        }

        const product = await prisma.product.findFirst({
            where: { id: productId },
        });
        if (!product) {
            throw new Error("Product not found");
        }

        const cart = await getMyCart();
        if (!cart) {
            throw new Error("Cart not found");
        }

        const exist = (cart.items as CartItem[]).find(
            (item) => item.productId === productId,
        );
        if (!exist) {
            throw new Error("Item not found in cart");
        }

        if (exist.qty === 1) {
            cart.items = (cart.items as CartItem[]).filter(
                (item) => item.productId !== productId,
            );
        } else {
            (cart.items as CartItem[]).find(
                (item) => item.productId === productId,
            )!.qty -= 1;
        }

        await prisma.cart.update({
            where: {
                id: cart.id,
            },
            data: {
                items: cart.items as Prisma.CartUpdateitemsInput[],
                ...calcPrice(cart.items as z.infer<typeof cartItemSchema>[]),
            },
        });

        revalidatePath(`/product/${product.slug}`);

        return {
            success: true,
            message: `${product.name} ${
                exist.qty === 1 ? "removed from" : "updated in"
            } cart successfully`,
        };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}
