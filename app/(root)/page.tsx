import ProductList from "@/components/shared/product/product-list";

import { getLatestProducts } from "@/lib/actions/product.actions";

const Home = async () => {
    const latestProducts = await getLatestProducts();

    return (
        <div>
            <ProductList
                data={latestProducts}
                title="Latest Products"
                limit={4}
            />
        </div>
    );
};

export default Home;
