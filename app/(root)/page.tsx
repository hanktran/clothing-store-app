import DealCountdown from "@/components/deal-countdown";
import IconBoxes from "@/components/icon-boxes";
import { ProductCarousel } from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import ViewAllProductsButton from "@/components/view-all-products-button";

import {
    getFeaturedProducts,
    getLatestProducts,
} from "@/lib/actions/product.actions";

const Home = async () => {
    const latestProducts = await getLatestProducts();
    const featuredProducts = await getFeaturedProducts();

    return (
        <div>
            {featuredProducts.length > 0 && (
                <ProductCarousel data={featuredProducts} />
            )}

            <ProductList
                data={latestProducts}
                title="Latest Products"
                limit={4}
            />
            <ViewAllProductsButton />
            <DealCountdown />
            <IconBoxes />
        </div>
    );
};

export default Home;
