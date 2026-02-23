"use client";

import { useSearchParams } from "next/navigation";

import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const Search = ({ categories = [] }: { categories?: { category: string }[] }) => {
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get("category") || "all";
    const currentQuery = searchParams.get("q") || "";

    return (
        <form action="/search" method="GET">
            <div className="flex w-full max-w-sm items-center space-x-2">
                <Select name="category" defaultValue={currentCategory}>
                    <SelectTrigger className="w-45">
                        <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem key={"All"} value={"all"}>
                            All
                        </SelectItem>
                        {categories.map((x) => (
                            <SelectItem key={x.category} value={x.category}>
                                {x.category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Input
                    name="q"
                    type="text"
                    placeholder="Search..."
                    className="md:w-25 lg:w-75"
                    defaultValue={currentQuery}
                />
                <Button>
                    <SearchIcon />
                </Button>
            </div>
        </form>
    );
};

export default Search;
