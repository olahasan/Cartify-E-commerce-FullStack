import ProductCardSkeleton from "./ProductCardSkeleton";
import styles from "../../features/categories/Category.module.css";

const { productGrid } = styles;

const ProductGridSkeleton = () => {
  return (
    <div className={productGrid}>
      {Array.from({ length: 8 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
