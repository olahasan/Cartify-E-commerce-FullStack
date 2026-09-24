import AllCategoriesGridSkeleton from "./AllCategoriesGridSkeleton";
import CategorySidebarSkeleton from "./CategorySidebarSkeleton";
import styles from "../Category.module.css";
const { categoriesPage } = styles;

const CategoriesPageSkeleton = () => {
  return (
    <div className={categoriesPage}>
      <div className={styles.layout}>
        <div className={styles.sidebarWrapper}>
          <CategorySidebarSkeleton />
        </div>

        <div className={styles.contentWrapper}>
          <AllCategoriesGridSkeleton />
        </div>
      </div>
    </div>
  );
};

export default CategoriesPageSkeleton;
