"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { signOutUser } from "@/lib/actions/user.actions";

export function SignOutButton() {
    return (
        <DropdownMenuItem
            className="p-0 mb-1"
            onSelect={(e) => {
                e.preventDefault();
            }}
        >
            <form action={signOutUser} className="w-full">
                <Button
                    className="w-full py-4 px-2 h-4 justify-start"
                    variant="ghost"
                    type="submit"
                >
                    Sign Out
                </Button>
            </form>
        </DropdownMenuItem>
    );
}
