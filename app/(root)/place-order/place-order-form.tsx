"use client";

import { Check, Loader } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <Check className="h-4 w-4" />
      )}
      Place Order
    </Button>
  );
};

const PlaceOrderForm = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleAction = async () => {
    const res = await createOrder();

    if (res.redirectTo) {
      router.push(res.redirectTo);
      return;
    }

    if (!res.success) {
      setMessage(res.message);
    }
  };

  return (
    <form action={handleAction} className="w-full">
      <SubmitButton />
      {message && (
        <div className="text-destructive text-sm mt-2">{message}</div>
      )}
    </form>
  );
};

export default PlaceOrderForm;
