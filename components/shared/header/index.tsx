import Image from "next/image";
import Link from "next/link";

import { getAllCategories } from "@/lib/actions/product.actions";
import { APP_NAME } from "@/lib/constants";

import CategoriesDrawer from "./categories-drawer";
import Menu from "./menu";
import Search from "./search";

const Header = async () => {
    const categories = await getAllCategories();

    return (
        <header className="w-full border-b">
            <div className="wrapper flex-between">
                <div className="flex-start">
                    <CategoriesDrawer />

                    <Link href="/" className="flex-start ml-4">
                        <Image
                            priority={true}
                            src="/images/logo.svg"
                            width={48}
                            height={48}
                            alt={`${APP_NAME} Logo`}
                        />

                        <span className="hidden lg:block font-bold text-2xl ml-3">
                            {APP_NAME}
                        </span>
                    </Link>
                </div>

                <div className="hidden md:block">
                    <Search categories={categories} />
                </div>

                <Menu categories={categories} />
            </div>
        </header>
    );
};

export default Header;
