"use client";

import React, { useState, useEffect } from "react";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";

const AdminSearch = () => {
    const pathname = usePathname();
    const router = useRouter();

    const getFormActionUrl = () => {
        if (pathname.includes("/admin/orders")) {
            return "/admin/orders";
        }
        if (pathname.includes("/admin/users")) {
            return "/admin/users";
        }
        return "/admin/products";
    };

    const formActionUrl = getFormActionUrl();

    const searchParams = useSearchParams();
    const currentQuery = searchParams.get("query") || "";
    const [queryValue, setQueryValue] = useState(currentQuery);

    useEffect(() => {
        if (currentQuery && queryValue === "") {
            router.push(formActionUrl);
        }
    }, [queryValue, currentQuery, formActionUrl, router]);

    return (
        <form action={formActionUrl} method="GET">
            <Input
                type="search"
                placeholder="Search..."
                name="query"
                value={queryValue}
                onChange={(e) => setQueryValue(e.target.value)}
                className="md:w-25 lg:w-75"
            />
            <button type="submit" className="sr-only">
                Search
            </button>
        </form>
    );
};

export default AdminSearch;
