import ContentLoader from "react-content-loader";
import styles from "../Category.module.css";

const { subCategorySkeletonRow } = styles;

const SubCategoryGridSkeleton = () => {
  return (
    <div className={subCategorySkeletonRow}>
      {Array.from({ length: 6 }).map((_, index) => (
        <ContentLoader
          key={index}
          speed={2}
          width={100}
          height={180}
          viewBox="0 0 100 180"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          {/* image */}
          <rect x="0" y="0" rx="8" ry="8" width="100.16" height="118.97" />

          {/* category name */}
          <rect x="0" y="125" rx="4" ry="4" width="70" height="10" />
        </ContentLoader>
      ))}
    </div>
  );
};

export default SubCategoryGridSkeleton;
