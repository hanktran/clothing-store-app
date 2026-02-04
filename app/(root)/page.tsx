import ProductList from "@/components/shared/product/product-list";
import sampleData from "@/db/sample-data";

const Home = async () => {
  return (
    <div>
      <h2>Latest Products</h2>
      <ProductList
        data={sampleData.products}
        title="Latest Products"
        limit={4}
      />
    </div>
  );
};

export default Home;
