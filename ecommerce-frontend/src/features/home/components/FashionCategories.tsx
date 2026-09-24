import CategorySection from "./CategorySection";
import styles from "../home.module.css";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { getHomeSectionsWithSlugs } from "@products/productSlice";

const { FashionCategoryCarouselContainer } = styles;

const FashionCategories = () => {
  const { HomeSectionsWithSlugs } = useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (HomeSectionsWithSlugs.length === 0) {
      dispatch(getHomeSectionsWithSlugs());
    }
  }, [dispatch, HomeSectionsWithSlugs.length]);

  return (
    <div className={FashionCategoryCarouselContainer}>
      {HomeSectionsWithSlugs.filter((s) =>
        ["Women's Clothing", "Men's Clothing", "Kids' Clothing"].includes(
          s.sectionName,
        ),
      ).map((section) => (
        <CategorySection
          key={section.slug}
          sectionName={section.sectionName}
          link={`/categories/${section.slug}`}
          sectionSlug={section.slug}
        />
      ))}
    </div>
  );
};

export default FashionCategories;
