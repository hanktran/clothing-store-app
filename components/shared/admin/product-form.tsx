/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Product } from "@/types";

import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { productDefaultValues } from "@/lib/constants";
import { UploadButton } from "@/lib/uploadthing";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";

const ProductForm = ({
    type,
    product,
    productId,
}: {
    type: "Create" | "Update";
    product?: Product;
    productId?: string;
}) => {
    const router = useRouter();

    const form = useForm<
        | z.infer<typeof insertProductSchema>
        | z.infer<typeof updateProductSchema>
    >({
        resolver:
            type === "Update"
                ? zodResolver(updateProductSchema)
                : zodResolver(insertProductSchema),
        defaultValues:
            product && type === "Update"
                ? { ...product }
                : productDefaultValues,
    } as any);

    const onSubmit = async (
        data:
            | z.infer<typeof insertProductSchema>
            | z.infer<typeof updateProductSchema>,
    ) => {
        if (type === "Create") {
            const res = await createProduct(
                data as z.infer<typeof insertProductSchema>,
            );
            if (res.success) {
                toast.success(res.message);
                router.push("/admin/products");
            } else {
                toast.error(res.message);
            }
        } else {
            if (!productId) {
                router.push("/admin/products");
                return;
            }

            const res = await updateProduct({
                ...(data as z.infer<typeof updateProductSchema>),
                id: productId,
            });
            if (res.success) {
                toast.success(res.message);
                router.push("/admin/products");
            } else {
                toast.error(res.message);
            }
        }
    };

    const images = form.watch("images");
    const isFeatured = form.watch("isFeatured");
    const banner = form.watch("banner");

    return (
        <Form {...form}>
            <form
                className="space-y-8"
                method="post"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter product name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            placeholder="Enter product slug"
                                            className="pl-8"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            className="bg-gray-500 text-white px-4 py-1 mt-2 hover:bg-gray-600"
                                            onClick={() => {
                                                form.setValue(
                                                    "slug",
                                                    slugify(
                                                        form.getValues("name"),
                                                        { lower: true },
                                                    ),
                                                );
                                            }}
                                        >
                                            Generate
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter category"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Brand</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter product brand"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter product price"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Enter product stock"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="upload-field flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="images"
                        render={() => (
                            <FormItem className="w-full">
                                <FormLabel>Images</FormLabel>
                                <Card>
                                    <CardContent className="space-y-2 mt-2 min-h-48">
                                        <div className="flex-start space-x-2">
                                            {images.map((image: string) => (
                                                <Image
                                                    key={image}
                                                    src={image}
                                                    alt="product image"
                                                    className="w-20 h-20 object-cover object-center rounded-sm"
                                                    width={100}
                                                    height={100}
                                                />
                                            ))}
                                            <FormControl>
                                                <UploadButton
                                                    endpoint="imageUploader"
                                                    onClientUploadComplete={(
                                                        res: { url: string }[],
                                                    ) => {
                                                        form.setValue(
                                                            "images",
                                                            [
                                                                ...images,
                                                                res[0].url,
                                                            ],
                                                        );
                                                    }}
                                                    onUploadError={(
                                                        error: Error,
                                                    ) => {
                                                        toast.error(
                                                            `ERROR! ${error.message}`,
                                                        );
                                                    }}
                                                />
                                            </FormControl>
                                        </div>
                                    </CardContent>
                                </Card>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="upload-field">
                    Featured Product
                    <Card>
                        <CardContent className="space-y-2 mt-2  ">
                            <FormField
                                control={form.control}
                                name="isFeatured"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel>Is Featured?</FormLabel>
                                    </FormItem>
                                )}
                            />
                            {isFeatured && banner && (
                                <Image
                                    src={banner}
                                    alt="banner image"
                                    className=" w-full object-cover object-center rounded-sm"
                                    width={1920}
                                    height={680}
                                />
                            )}
                            {isFeatured && !banner && (
                                <UploadButton
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(
                                        res: { url: string }[],
                                    ) => {
                                        form.setValue("banner", res[0].url);
                                    }}
                                    onUploadError={(error: Error) => {
                                        toast(`ERROR! ${error.message}`);
                                    }}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter product description"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div>
                    <Button
                        type="submit"
                        size="lg"
                        disabled={form.formState.isSubmitting}
                        className="button col-span-2 w-full"
                    >
                        {form.formState.isSubmitting
                            ? "Submitting"
                            : `${type} Product`}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ProductForm;
