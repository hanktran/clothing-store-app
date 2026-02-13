"use client";

import { useState } from "react";

import Image from "next/image";

import { cn } from "@/lib/utils";

const ProductImages = ({ images }: { images: string[] }) => {
    const [current, setCurrent] = useState(0);

    return (
        <div className="space-y-4">
            <Image
                src={images[current]}
                alt={`Product Image ${current + 1}`}
                width={300}
                height={300}
                className="min-h-[300px] object-cover object-center"
            />
            <div className="flex">
                {images.map((img, index) => (
                    <div
                        key={img}
                        className={cn(
                            "border mr-2 cursor-pointer hover:border-orange-600",
                            current === index && "border-blue-500",
                        )}
                        onClick={() => setCurrent(index)}
                    >
                        <Image
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            width={100}
                            height={100}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductImages;
