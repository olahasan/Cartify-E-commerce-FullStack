import { API_BASE_URL } from "@config/api";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { NavLink } from "react-router-dom";
import styles from "../Product.module.css";
import { BaseCarousel } from "@shared/ui/BaseCarousel/BaseCarousel";
import type { UnknownAction, ThunkAction } from "@reduxjs/toolkit";
import type { RootState } from "@app/store/store";
import CategorySectionSkeleton from "@home/Skeleton/CategorySectionSkeleton";
import LottieHandler from "@shared/LottieHandler/LottieHandler";

const { CategoryCarouselContainer, WomenFashionItem, shopAllBtn } = styles;

type FetchActionType = (
  sectionSlug: string,
) => ThunkAction<void, RootState, unknown, UnknownAction>;

interface ICategoryCarouselProps {
  sectionName: string;
  sectionSlug: string;
  fetchAction: FetchActionType;
  shopAllLink: string;
}

const CategoryCarousel: React.FC<ICategoryCarouselProps> = ({
  sectionName,
  sectionSlug,
  fetchAction,
  shopAllLink,
}) => {
  const dispatch = useAppDispatch();
  const {
    homeSectionCarousels,
    homeSectionCarouselLoading,
    homeSectionCarouselError,
  } = useAppSelector((state) => state.product);

  const carouselItems = homeSectionCarousels[sectionSlug] || [];
  const isLoading = homeSectionCarouselLoading[sectionSlug] || false;
  const error = homeSectionCarouselError[sectionSlug] || null;

  useEffect(() => {
    if (!carouselItems.length && !isLoading) {
      dispatch(fetchAction(sectionSlug));
    }
  }, [dispatch, fetchAction, sectionSlug, carouselItems.length, isLoading]);

  if (isLoading) {
    return <CategorySectionSkeleton Length={7} />;
  }

  if (error) {
    return (
      <div>
        Error loading {sectionName} carousel: {error}
      </div>
    );
  }

  const transformedItems = carouselItems.map((item) => ({
    imageUrl: item.imageUrl,
    altText: item.categoryName,
    slug: item.hierarchy,
    sectionName: sectionName,
  }));

  return transformedItems && transformedItems.length > 0 ? (
    <div className={CategoryCarouselContainer}>
      <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
        <h2>{sectionName}</h2>
        <NavLink to={shopAllLink} className={shopAllBtn}>
          Shop All
        </NavLink>
      </div>
      <BaseCarousel
        items={transformedItems}
        slidesPerView={7}
        spaceBetween={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          0: { slidesPerView: 2 },
          400: { slidesPerView: 3 },
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 7 },
        }}
        className="CategoryCarouselSwiper"
      >
        {(item) => {
          return (
            <NavLink
              to={
                item.slug
                  ? `/categories/${encodeURIComponent(
                      item.slug,
                    )}?type=CARD_CLICK`
                  : "#"
              }
              className={WomenFashionItem}
            >
              <img
                loading="lazy"
                src={`${API_BASE_URL}${item.imageUrl}`}
                alt={item.altText}
              />
            </NavLink>
          );
        }}
      </BaseCarousel>
    </div>
  ) : (
    <LottieHandler
      type="empty"
      message={`No products available for ${sectionName}.`}
    />
  );
};

export default CategoryCarousel;
