import { useAppSelector } from "@app/hooks";
import AllCategoriesGridSkeleton from "@categories/Skeleton/AllCategoriesGridSkeleton";
import { useNavigate } from "react-router-dom";
import styles from "../Category.module.css";
const {
  AllCategoriesStyle,
  Categories,
  Category,
  ImgSectionbg,
  ImgStyle,
  categoryNameStyle,
} = styles;
import { API_BASE_URL } from "@config/api";

const AllCategoriesGrid = () => {
  const { CategorySidebar, CategorySidebarLoading } = useAppSelector(
    (state) => state.product,
  );
  const navigate = useNavigate();

  const rootCategories = CategorySidebar.filter(
    (cat) => cat.parentCategoryID === null,
  );

  if (CategorySidebarLoading === "pending" && CategorySidebar.length === 0)
    return <AllCategoriesGridSkeleton />;

  return (
    <div>
      <h2 className={AllCategoriesStyle}>All Categories</h2>
      <div className={Categories}>
        {rootCategories.map((cat) => (
          <div
            className={Category}
            key={cat.categoryID}
            onClick={() =>
              navigate(
                `/categories/${encodeURIComponent(cat.hierarchy)}?type=CARD_CLICK`,
              )
            }
          >
            <div className={ImgSectionbg}>
              <img
                src={
                  cat.homepageImageUrl
                    ? `${API_BASE_URL}${cat.homepageImageUrl}`
                    : `${API_BASE_URL}${cat.categoryImageUrl}`
                }
                alt={cat.categoryName}
                className={ImgStyle}
                onError={(e) => {
                  e.currentTarget.src = "/fallback.jpg";
                }}
              />
            </div>
            <p className={categoryNameStyle}>{cat.categoryName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCategoriesGrid;
