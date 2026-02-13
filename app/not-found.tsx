"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";

import { APP_NAME } from "@/lib/constants";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Image
                priority={true}
                src="/images/logo.svg"
                width={48}
                height={48}
                alt={`${APP_NAME} logo`}
            />

            <div className="p-6 rounded-lg shadow-md w-1/3 text-center">
                <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
                <p className="text-destructive">
                    The page you are looking for does not exist.
                </p>
                <Button
                    variant="outline"
                    className="mt-4 ml-2"
                    onClick={() => (globalThis.location.href = "/")}
                >
                    Back to Home
                </Button>
            </div>
        </div>
    );
};

export default NotFound;
