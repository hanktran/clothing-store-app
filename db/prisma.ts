import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";

import { PrismaClient } from "@/lib/generated/prisma";

const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
});

const globalForPrisma = globalThis as unknown as {
    prisma: ReturnType<typeof createPrismaClient> | undefined;
};

function createPrismaClient() {
    return new PrismaClient({ adapter }).$extends({
        result: {
            product: {
                price: {
                    needs: { price: true },
                    compute(product) {
                        return product.price.toString();
                    },
                },
                rating: {
                    needs: { rating: true },
                    compute(product) {
                        return product.rating.toString();
                    },
                },
            },
            order: {
                itemsPrice: {
                    needs: { itemsPrice: true },
                    compute(order) {
                        return order.itemsPrice.toString();
                    },
                },
                taxPrice: {
                    needs: { taxPrice: true },
                    compute(order) {
                        return order.taxPrice.toString();
                    },
                },
                shippingPrice: {
                    needs: { shippingPrice: true },
                    compute(order) {
                        return order.shippingPrice.toString();
                    },
                },
                totalPrice: {
                    needs: { totalPrice: true },
                    compute(order) {
                        return order.totalPrice.toString();
                    },
                },
            },
            orderItem: {
                price: {
                    needs: { price: true },
                    compute(orderItem) {
                        return orderItem.price.toString();
                    },
                },
            },
        },
    });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
