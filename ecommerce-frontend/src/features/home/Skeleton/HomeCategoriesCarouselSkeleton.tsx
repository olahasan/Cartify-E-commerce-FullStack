import ContentLoader from "react-content-loader";
import styles from "../home.module.css";

const { HomeCategoriesCarousel } = styles;

const HomeCategoriesCarouselSkeleton = () => {
  return (
    <div className={HomeCategoriesCarousel}>
      {Array.from({ length: 10 }).map((_, index) => (
        <ContentLoader
          key={index}
          speed={2}
          width={100}
          height={150}
          viewBox="0 0 100 180"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          {/* image */}
          <rect x="0" y="10" rx="80" ry="80" width="100" height="100" />

          {/* category name */}
          <rect x="15" y="110" rx="4" ry="4" width="70" height="10" />
        </ContentLoader>
      ))}
    </div>
  );
};

export default HomeCategoriesCarouselSkeleton;
