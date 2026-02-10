"use client";

import { Check, Loader } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order.actions";
import { useRouter } from "next/navigation";

const PlaceOrderForm = () => {
  const router = useRouter();
  const { pending } = useFormStatus();

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();

    const res = await createOrder();

    if (res.redirectTo) {
      router.push(res.redirectTo);
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Button type="submit" disabled={pending}>
        {pending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}
        Place Order
      </Button>
    </form>
  );
};

export default PlaceOrderForm;
