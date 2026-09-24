import ContentLoader from "react-content-loader";
import styles from "../Category.module.css";
import ProductCardSkeleton from "@shared/Skeletons/ProductCardSkeleton";

const { featuredProducts, featuredProductsList } = styles;

const FeaturedProductsSkeleton = () => {
  return (
    <aside className={featuredProducts}>
      <ContentLoader
        speed={2}
        width={220}
        height={40}
        viewBox="0 0 220 40"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="0" y="5" rx="4" ry="4" width="200" height="24" />
      </ContentLoader>

      <div className={featuredProductsList}>
        {Array.from({ length: 4 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </aside>
  );
};

export default FeaturedProductsSkeleton;
