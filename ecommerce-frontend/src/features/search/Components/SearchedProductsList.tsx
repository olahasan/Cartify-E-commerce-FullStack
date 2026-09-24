import { NavLink } from "react-router-dom";
import ProductCard from "@products/components/ProductCard";
import { useAppSelector } from "@app/hooks";
import styles from "../search.module.css";
import LottieHandler from "@shared/LottieHandler/LottieHandler";

const { container, productCardLink, center } = styles;

type Props = {
  searchTerm: string | null;
  lastProductRef: React.RefObject<HTMLDivElement | null>;
  page: number;
};

const SearchedProductsList = ({ searchTerm, lastProductRef, page }: Props) => {
  const { loading, SearchedProducts } = useAppSelector((state) => state.search);

  const products = SearchedProducts?.products ?? [];

  if (products.length === 0) {
    return (
      <>
        <LottieHandler
          type="empty"
          message={`No products available for "${searchTerm}"`}
        />
      </>
    );
  }

  if (loading === "failed") {
    return <LottieHandler type="error" message="Failed to search products" />;
  }

  return (
    <div className={container}>
      {products.map((product, index) => {
        const isLast = index === products.length - 1;

        return (
          <NavLink
            key={product.productID}
            to={`/products/${product.productID}`}
            className={productCardLink}
          >
            <ProductCard
              productID={product.productID}
              name={product.productName}
              price={product.price}
              imageUrl=""
              rating={product.rating}
              totalReviews={product.totalReviews}
              description={product.description}
              quantity={product.quantity}
            />

            {isLast && <div ref={lastProductRef} />}
          </NavLink>
        );
      })}

      <div className={center}>
        {loading === "pending" && page > 1 && <LottieHandler type="loading" />}
      </div>
    </div>
  );
};
export default SearchedProductsList;
