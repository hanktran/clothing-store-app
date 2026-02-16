"use server";

import { revalidatePath } from "next/cache";

import z from "zod";

import { prisma } from "@/db/prisma";

import { convertToPlainObject, formatError } from "@/lib/utils";

import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { Prisma } from "../generated/prisma";
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
    query,
    limit = PAGE_SIZE,
    page,
    category,
    price,
    rating,
    sort,
}: {
    query: string;
    limit?: number;
    page: number;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
}) {
    // Query filter
    const queryFilter: Prisma.ProductWhereInput =
        query && query !== "all"
            ? {
                  name: {
                      contains: query,
                      mode: "insensitive",
                  } as Prisma.StringFilter,
              }
            : {};

    // Category filter
    const categoryFilter = category && category !== "all" ? { category } : {};

    // Price filter
    const priceFilter: Prisma.ProductWhereInput =
        price && price !== "all"
            ? {
                  price: {
                      gte: Number(price.split("-")[0]),
                      lte: Number(price.split("-")[1]),
                  },
              }
            : {};

    // Rating filter
    const ratingFilter =
        rating && rating !== "all"
            ? {
                  rating: {
                      gte: Number(rating),
                  },
              }
            : {};

    // Determine sort order
    let orderBy;
    if (sort === "lowest") {
        orderBy = { price: "asc" as const };
    } else if (sort === "highest") {
        orderBy = { price: "desc" as const };
    } else if (sort === "rating") {
        orderBy = { rating: "desc" as const };
    } else {
        orderBy = { createdAt: "desc" as const };
    }

    const data = await prisma.product.findMany({
        where: {
            ...queryFilter,
            ...categoryFilter,
            ...priceFilter,
            ...ratingFilter,
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
    });

    const dataCount = await prisma.product.count();

    return {
        data,
        totalPages: Math.ceil(dataCount / limit),
    };
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

export async function getAllCategories() {
    const data = await prisma.product.groupBy({
        by: ["category"],
        _count: true,
    });

    return data;
}

export async function getFeaturedProducts() {
    const data = await prisma.product.findMany({
        where: { isFeatured: true },
        orderBy: { createdAt: "desc" },
        take: 4,
    });

    return convertToPlainObject(data);
}
