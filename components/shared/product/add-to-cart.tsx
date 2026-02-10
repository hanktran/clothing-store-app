"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Cart, CartItem } from "@/types";
import { Plus, Minus, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { toast } from "sonner";

const AddToCart = ({
  cart,
  item,
}: {
  cart?: Cart;
  item: Omit<CartItem, "cardId">;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [action, setAction] = useState<"add" | "remove" | null>(null);

  const handleAddToCart = async () => {
    setAction("add");
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error(res.message);
        setAction(null);
        return;
      }

      toast.success(`${item.name} added to cart.`, {
        action: {
          label: "Go to Cart",
          onClick: () => router.push("/cart"),
        },
      });
      setAction(null);
    });
  };

  const handleRemoveFromCart = async () => {
    setAction("remove");
    startTransition(async () => {
      await removeItemFromCart(item.productId);

      toast.success(`${item.name} removed from cart.`);
      setAction(null);
    });
  };

  const existItem = cart?.items.find((i) => i.productId === item.productId);

  return existItem ? (
    <div>
      <Button
        type="button"
        variant="outline"
        onClick={handleRemoveFromCart}
        disabled={isPending && action === "remove"}
      >
        {isPending && action === "remove" ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button
        type="button"
        variant="outline"
        onClick={handleAddToCart}
        disabled={isPending && action === "add"}
      >
        {isPending && action === "add" ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full"
      type="button"
      onClick={handleAddToCart}
      disabled={isPending && action === "add"}
    >
      {isPending && action === "add" ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      Add to Cart
    </Button>
  );
};

export default AddToCart;
