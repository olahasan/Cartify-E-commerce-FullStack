import React from "react";
import { NavLink } from "react-router-dom";
import { BaseCarousel } from "@shared/ui/BaseCarousel/BaseCarousel";
import type { TCategoryItem } from "@products/productAPI";

import styles from "../Category.module.css";

const { subcategoryCard } = styles;
import { API_BASE_URL } from "@config/api";
interface SubCategoryGridProps {
  subCategories: TCategoryItem[];
}

const SubCategoryGrid: React.FC<SubCategoryGridProps> = ({ subCategories }) => {
  const isSmallList = subCategories.length <= 3;
  const allowedCategories = ["fashion", "sports", "books", "stationary"];

  return (
    <BaseCarousel
      className={`subcategory-swiper ${
        isSmallList ? "subcategory-large" : "subcategory-normal"
      }`}
      items={subCategories}
      slidesPerView={isSmallList ? 2.2 : 6.2}
      spaceBetween={20}
      navigation
      pagination={{ clickable: true }}
      loop
      autoplay={{ delay: 2000 }}
    >
      {(subCategory) => {
        const parentCategory = subCategory.hierarchy
          ?.split("/")[0]
          ?.trim()
          ?.toLowerCase();

        const shouldShow = allowedCategories.includes(parentCategory);

        return (
          <NavLink
            key={subCategory.categoryID}
            to={`/categories/${encodeURIComponent(
              subCategory.hierarchy,
            )}?type=CARD_CLICK`}
            className={subcategoryCard}
          >
            <img
              src={`${API_BASE_URL}${subCategory.imageUrl}`}
              alt={subCategory.name}
            />
            {shouldShow && <p>{subCategory.name}</p>}
          </NavLink>
        );
      }}
    </BaseCarousel>
  );
};

export default SubCategoryGrid;
