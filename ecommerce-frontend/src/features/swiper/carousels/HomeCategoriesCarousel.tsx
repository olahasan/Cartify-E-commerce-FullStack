import "../styles/styles.css";

import { Navigation } from "swiper/modules";
import { BaseCarousel } from "@shared/ui/BaseCarousel/BaseCarousel";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getCategorySidebar } from "@products/productSlice";
import { API_BASE_URL } from "@config/api";

import styles from "../styles/HomeCategoriesCarousel.module.css";

const { categoryCarouselItem } = styles;

interface ICategorySidebar {
  categoryID: number;
  categoryName: string;
  categorySlug: string;
  hierarchy: string;
  level: number;
  showInHome: boolean;
  showInForAll: boolean;
  parentCategoryID: number | null;
  categoryImageUrl: string | null;
  homepageImageUrl: string | null;
  carouselImageUrl: string | null;
  carouselAltText: string | null;
}

const HomeCategoriesCarousel = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { CategorySidebar } = useAppSelector((state) => state.product);

  useEffect(() => {
    if (CategorySidebar.length === 0) {
      dispatch(getCategorySidebar());
    }
  }, [dispatch, CategorySidebar.length]);

  const visibleCategories = CategorySidebar.filter(
    (cat) => cat.carouselImageUrl,
  );

  return (
    <BaseCarousel<ICategorySidebar>
      items={visibleCategories}
      slidesPerView={10}
      spaceBetween={20}
      navigation={true}
      breakpoints={{
        0: { slidesPerView: 3 },
        400: { slidesPerView: 5 },
        640: { slidesPerView: 7 },
        768: { slidesPerView: 9 },
        1024: { slidesPerView: 10 },
        1280: { slidesPerView: 11 },
      }}
      modules={[Navigation]}
      className="mySwiper2"
    >
      {(cat) => (
        <div
          onClick={() =>
            navigate(
              `/categories/${encodeURIComponent(cat.hierarchy)}?type=CARD_CLICK`,
            )
          }
          className={categoryCarouselItem}
        >
          <img
            src={`${API_BASE_URL}${
              cat.carouselImageUrl || cat.categoryImageUrl
            }`}
            alt={cat.carouselAltText || cat.categoryName}
          />
        </div>
      )}
    </BaseCarousel>
  );
};

export default HomeCategoriesCarousel;
