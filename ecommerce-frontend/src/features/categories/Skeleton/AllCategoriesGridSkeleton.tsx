import ContentLoader from "react-content-loader";
import styles from "../Category.module.css";
const { CategoriesGridSkeletonStyle } = styles;
const AllCategoriesGridSkeleton = () => {
  return (
    <>
      <ContentLoader speed={2} width={300} height={40} viewBox="0 0 300 40">
        <rect x="0" y="5" rx="4" ry="4" width="220" height="28" />
      </ContentLoader>

      <div className={CategoriesGridSkeletonStyle}>
        {Array.from({ length: 7 }).map((_, index) => (
          <ContentLoader
            key={index}
            width={350}
            height={280}
            viewBox="0 0 350 280"
          >
            {/* image */}
            <rect x="0" y="0" rx="12" ry="12" width="350" height="220" />

            {/* text */}
            <rect x="40" y="240" rx="4" ry="4" width="170" height="16" />
          </ContentLoader>
        ))}
      </div>
    </>
  );
};

export default AllCategoriesGridSkeleton;
