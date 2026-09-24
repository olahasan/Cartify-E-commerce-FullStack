import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import {
  getCategoryNavigationData,
  getPagedProducts,
} from "@products/productSlice";

import Breadcrumb from "./Components/Breadcrumb";
import CategoryHeader from "./Components/CategoryHeader";
import SubCategoryGrid from "./Components/SubCategoryGrid";
import ProductGrid from "./Components/ProductGrid";
import FeaturedProducts from "./Components/FeaturedProducts";
import styles from "./Category.module.css";
import CategorySidebar from "./Components/CategorySidebar";
import AllCategoriesGrid from "./Components/AllCategoriesGrid ";
import CategoryHeaderSkeleton from "./Skeleton/CategoryHeaderSkeleton";
import SubCategoryGridSkeleton from "./Skeleton/SubCategoryGridSkeleton";
import BreadcrumbSkeleton from "./Skeleton/BreadcrumbSkeleton";
import FeaturedProductsSkeleton from "./Skeleton/FeaturedProductsSkeleton";
import CategorySidebarSkeleton from "./Skeleton/CategorySidebarSkeleton";
import BackToTop from "@shared/BackToTop/BackToTop";
import LottieHandler from "@shared/LottieHandler/LottieHandler";
import ProductGridSkeleton from "@shared/Skeletons/ProductGridSkeleton";

const { categoriesPage, mainContent, productsWrapper } = styles;

const DEFAULT_FILTERS = {
  minPrice: 0,
  maxPrice: 10000,
  minRating: 0,
  inStockOnly: false,
};

const Categories: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const navigationType = queryParams.get("type") || "AUTO";
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const initialPage =
    Number(new URLSearchParams(location.search).get("page")) || 1;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const rawPath = location.pathname
    .replace("/categories", "")
    .replace(/^\//, "");
  const fullPath = decodeURIComponent(rawPath);

  const {
    categoryNavigationData,
    categoryNavigationLoading,
    categoryNavigationError,
    PagedProducts,
    PagedProductsLoading,
  } = useAppSelector((state) => state.product);

  useEffect(() => {
    if (fullPath) {
      const decodedSlug = decodeURIComponent(fullPath);
      dispatch(
        getCategoryNavigationData({
          slugPath: decodedSlug,
          navigationType,
        }),
      );
    }
  }, [dispatch, fullPath, navigationType]);

  useEffect(() => {
    if (categoryNavigationData?.categoryInfo?.categoryID) {
      dispatch(
        getPagedProducts({
          categoryId: categoryNavigationData.categoryInfo.categoryID,
          pageNumber: currentPage,
          pageSize: 4,
        }),
      );
    }
  }, [dispatch, currentPage, categoryNavigationData]);

  type TFilterableProduct = {
    price: number;
    rating: number;
    quantity: number;
  };

  const applyFilters = (product: TFilterableProduct) => {
    if (product.price < filters.minPrice) return false;
    if (product.price > filters.maxPrice) return false;
    if (product.rating < filters.minRating) return false;
    if (filters.inStockOnly && product.quantity === 0) return false;
    return true;
  };

  const productsRef = useRef<HTMLDivElement>(null);
  const categoryChangedRef = useRef(false);

  const filteredProducts =
    PagedProducts?.data.products.filter(applyFilters) ?? [];

  useEffect(() => {
    if (categoryChangedRef.current) {
      categoryChangedRef.current = false;
      return;
    }

    if (PagedProductsLoading === "succeeded" && filteredProducts.length > 0) {
      const timer = setTimeout(() => {
        productsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  // Reset filters and page state when navigating to a different category.
  useEffect(() => {
    setFilters(DEFAULT_FILTERS);

    categoryChangedRef.current = true;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [fullPath]);

  useEffect(() => {
    setFilters(DEFAULT_FILTERS);

    const page = Number(queryParams.get("page")) || 1;
    setCurrentPage(page);
  }, [fullPath, queryParams]);

  if (!fullPath) {
    return (
      <div className={categoriesPage}>
        <div className={styles.layout}>
          <div className={styles.sidebarWrapper}>
            <CategorySidebar
              filters={filters}
              onFiltersChange={setFilters}
              defaultFilters={DEFAULT_FILTERS}
            />
          </div>
          <div className={styles.contentWrapper}>
            <AllCategoriesGrid />
          </div>
        </div>
      </div>
    );
  }

  if (categoryNavigationError) {
    return <div>Error: {categoryNavigationError}</div>;
  }

  if (!categoryNavigationData) {
    return (
      <div className={categoriesPage}>
        <div className={styles.layout}>
          <div className={styles.sidebarWrapper}>
            <CategorySidebarSkeleton />
          </div>

          <div className={styles.contentWrapper}>
            <BreadcrumbSkeleton />
            <CategoryHeaderSkeleton />
            <ProductGridSkeleton />
            <FeaturedProductsSkeleton />
          </div>
        </div>
      </div>
    );
  }

  const { categoryInfo, directChildren, randomProducts } =
    categoryNavigationData;

  const filteredFeaturedProducts = randomProducts.filter(applyFilters);
  const pagination = PagedProducts?.data.pagination;
  const pageNumbers = pagination
    ? Array.from({ length: pagination.totalPages }, (_, index) => index + 1)
    : [];

  return (
    <div className={categoriesPage}>
      <div className={styles.layout}>
        <div className={styles.sidebarWrapper}>
          <CategorySidebar
            filters={filters}
            onFiltersChange={setFilters}
            defaultFilters={DEFAULT_FILTERS}
          />
        </div>

        {/* Right side content */}
        <div className={styles.contentWrapper}>
          {categoryNavigationLoading ? (
            <>
              <BreadcrumbSkeleton />
              <CategoryHeaderSkeleton />
              <SubCategoryGridSkeleton />
              <ProductGridSkeleton />
              <FeaturedProductsSkeleton />
            </>
          ) : (
            <>
              <Breadcrumb hierarchy={categoryInfo.hierarchy} />
              <CategoryHeader
                name={categoryInfo.name}
                imageUrl={categoryInfo.imageUrl}
              />
              <div className={mainContent}>
                {categoryInfo.hasDirectChildren &&
                  directChildren.length > 0 && (
                    <SubCategoryGrid subCategories={directChildren} />
                  )}

                {!categoryInfo.hasDirectChildren &&
                  filteredProducts.length > 0 && (
                    <>
                      <div ref={productsRef} className={productsWrapper}>
                        <p>Our Products</p>
                        <ProductGrid products={filteredProducts} />
                      </div>

                      {pagination?.totalPages && pagination?.totalPages > 1 && (
                        <div className="mt-5 d-flex justify-content-center align-items-center">
                          <button
                            className="btn btn-outline-info mx-1"
                            disabled={!pagination?.hasPreviousPage}
                            onClick={() => {
                              const newPage = currentPage - 1;
                              setCurrentPage(newPage);
                              if (newPage === 1) {
                                navigate(
                                  `${location.pathname}?type=${navigationType}`,
                                );
                              } else {
                                navigate(
                                  `${location.pathname}?type=${navigationType}&page=${newPage}`,
                                );
                              }
                            }}
                          >
                            Previous
                          </button>

                          {pageNumbers.map((page) => (
                            <button
                              key={page}
                              onClick={() => {
                                setCurrentPage(page);

                                if (page === 1) {
                                  navigate(
                                    `${location.pathname}?type=${navigationType}`,
                                  );
                                } else {
                                  navigate(
                                    `${location.pathname}?type=${navigationType}&page=${page}`,
                                  );
                                }
                              }}
                              className={
                                page === currentPage
                                  ? "btn btn-info mx-1"
                                  : "btn btn-outline-info mx-1"
                              }
                            >
                              {page}
                            </button>
                          ))}

                          <button
                            className="btn btn-outline-info mx-1"
                            disabled={!pagination?.hasNextPage}
                            onClick={() => {
                              const newPage = currentPage + 1;
                              setCurrentPage(newPage);

                              if (newPage === 1) {
                                navigate(
                                  `${location.pathname}?type=${navigationType}`,
                                );
                              } else {
                                navigate(
                                  `${location.pathname}?type=${navigationType}&page=${newPage}`,
                                );
                              }
                            }}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  )}

                {!categoryInfo.hasDirectChildren &&
                  filteredProducts.length === 0 && (
                    <div className={productsWrapper}>
                      <p>No products match your filters.</p>
                      <LottieHandler type="empty" />
                    </div>
                  )}
              </div>
              {filteredFeaturedProducts.length > 0 && (
                <FeaturedProducts products={filteredFeaturedProducts} />
              )}
            </>
          )}
        </div>
      </div>
      <BackToTop />
    </div>
  );
};
export default Categories;
