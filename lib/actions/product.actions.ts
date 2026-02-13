"use server";

import { revalidatePath } from "next/cache";

import z from "zod";

import { prisma } from "@/db/prisma";

import { convertToPlainObject, formatError } from "@/lib/utils";

import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { insertProductSchema, updateProductSchema } from "../validators";

export async function getLatestProducts() {
    const data = await prisma.product.findMany({
        orderBy: {
            createdAt: "desc",
        },
        take: LATEST_PRODUCTS_LIMIT,
    });

    return convertToPlainObject(data);
}

export async function getProductBySlug(slug: string) {
    const data = await prisma.product.findFirst({
        where: {
            slug,
        },
    });
    return convertToPlainObject(data);
}

export async function getAllProducts({
    query, // eslint-disable-line @typescript-eslint/no-unused-vars
    category, // eslint-disable-line @typescript-eslint/no-unused-vars
    page,
    limit = PAGE_SIZE,
}: {
    query: string;
    category: string;
    page: number;
    limit?: number;
}) {
    const data = await prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
    });
    const count = await prisma.product.count();

    return { data, totalPages: Math.ceil(count / limit) };
}

export async function deleteProduct(productId: string) {
    try {
        const product = await prisma.product.findFirst({
            where: {
                id: productId,
            },
        });
        if (!product) {
            throw new Error("Product not found");
        }

        await prisma.product.delete({
            where: {
                id: productId,
            },
        });

        revalidatePath("/admin/products");

        return { success: true, message: "Product deleted successfully" };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function createProduct(data: z.infer<typeof insertProductSchema>) {
    try {
        const product = insertProductSchema.parse(data);
        await prisma.product.create({
            data: product,
        });

        revalidatePath("/admin/products");

        return { success: true, message: "Product created successfully" };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
    try {
        const product = updateProductSchema.parse(data);
        const existingProduct = await prisma.product.findFirst({
            where: {
                id: product.id,
            },
        });

        if (!existingProduct) {
            throw new Error("Product not found");
        }

        await prisma.product.update({
            where: {
                id: product.id,
            },
            data: product,
        });

        revalidatePath("/admin/products");

        return { success: true, message: "Product updated successfully" };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

export async function getProductById(productId: string) {
    const data = await prisma.product.findFirst({
        where: { id: productId },
    });

    return convertToPlainObject(data);
}
