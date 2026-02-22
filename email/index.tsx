import { Resend } from "resend";

import { Order } from "@/types";

import { SENDER_EMAIL, APP_NAME } from "@/lib/constants";

import PurchaseReceiptEmail from "./purchase-receipt";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
    console.log("Sending email to:", order.user.email);
    console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
        from: `${APP_NAME} <${SENDER_EMAIL}>`,
        to: order.user.email,
        subject: `Order Confirmation ${order.id}`,
        react: <PurchaseReceiptEmail order={order} />,
    });

    console.log("Email send result:", result);

    if (result.error) {
        console.error("Email error:", result.error);
        throw new Error(
            `Failed to send email: ${result.error.message}. Note: In Resend's free tier, you can only send to verified email addresses. Verify a domain at resend.com/domains to send to any recipient.`,
        );
    }

    return result;
};
