import Image from "next/image";
import Link from "next/link";

import ProductPrice from "@/components/product/product-price";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Product } from "@/types";

import Rating from "./rating";

const ProductCard = ({ product }: { product: Product }) => {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="p-0 items-center">
                <Link href={`/product/${product.slug}`}>
                    {product.images &&
                    product.images.length > 0 &&
                    product.images[0] ? (
                        <Image
                            priority={true}
                            src={product.images[0]}
                            alt={product.name}
                            width={300}
                            height={300}
                            className="aspect-square object-cover rounded"
                        />
                    ) : (
                        <div className="aspect-square w-[300px] h-[300px] flex items-center justify-center bg-gray-200 rounded">
                            <span className="text-gray-500">No Image</span>
                        </div>
                    )}
                </Link>
            </CardHeader>

            <CardContent className="p-4 grid gap-4">
                <div className="text-xs">{product.brand}</div>
                <Link href={`/product/${product.slug}`}>
                    <h2 className="text-sm font-medium">{product.name}</h2>
                </Link>
                <div className="flex-between gap-4">
                    <Rating value={Number(product.rating)} />

                    {product.stock > 0 ? (
                        <ProductPrice
                            value={product.price}
                            className="font-bold"
                        />
                    ) : (
                        <p className="text-destructive">Out of Stock</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductCard;
