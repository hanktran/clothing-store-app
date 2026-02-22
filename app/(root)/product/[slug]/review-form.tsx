"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { StarIcon } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
    createUpdateReview,
    getReviewByProductId,
} from "@/lib/actions/review.actions";
import { reviewFormDefaultValues } from "@/lib/constants";
import { insertReviewSchema } from "@/lib/validators";

const ReviewForm = ({
    userId,
    productId,
    onReviewSubmitted,
}: {
    userId: string;
    productId: string;
    onReviewSubmitted?: () => void;
}) => {
    const [open, setOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(insertReviewSchema),
        defaultValues: reviewFormDefaultValues,
    });

    const onSubmit: SubmitHandler<z.infer<typeof insertReviewSchema>> = async (
        values,
    ) => {
        const res = await createUpdateReview({ ...values, productId });

        if (!res.success) return toast(res.message);

        setOpen(false);
        form.reset();

        onReviewSubmitted?.();

        toast(res.message);
    };

    const handleOpenForm = async () => {
        form.setValue("productId", productId);
        form.setValue("userId", userId);

        const review = await getReviewByProductId({ productId });
        if (review.data) {
            form.setValue("title", review.data.title);
            form.setValue("description", review.data.description);
            form.setValue("rating", review.data.rating);
        }

        setOpen(true);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button onClick={handleOpenForm} variant="default">
                Write a review
            </Button>
            <DialogContent className="sm:max-w-106.25">
                <Form {...form}>
                    <form method="post" onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Write a review</DialogTitle>
                            <DialogDescription>
                                Share your thoughts with other customers
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter title"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter description"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="rating"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rating</FormLabel>
                                        <Select
                                            onValueChange={(value) =>
                                                field.onChange(Number(value))
                                            }
                                            value={
                                                field.value &&
                                                Number(field.value) > 0
                                                    ? String(
                                                          Number(field.value),
                                                      )
                                                    : undefined
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a rating" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {[1, 2, 3, 4, 5].map(
                                                    (rating) => (
                                                        <SelectItem
                                                            key={rating}
                                                            value={rating.toString()}
                                                        >
                                                            {rating}{" "}
                                                            <StarIcon className="inline h-4 w-4" />
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? "Submitting..."
                                    : "Submit"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewForm;
