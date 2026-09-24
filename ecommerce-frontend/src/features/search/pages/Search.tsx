import { useAppDispatch, useAppSelector } from "@app/hooks";
import { GetSearchedProductsThunk } from "@search/SearchSlice";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BackToTop from "@shared/BackToTop/BackToTop";
import SearchedProductsList from "@search/Components/SearchedProductsList";
import ProductGridSkeleton from "@shared/Skeletons/ProductGridSkeleton";

const Search = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("searchTerm");
  const { loading, SearchedProducts } = useAppSelector((state) => state.search);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  // Responsible for handling a new search (resets page to 1)
  useEffect(() => {
    if (!searchTerm) return;

    setPage(1);
    dispatch(
      GetSearchedProductsThunk({
        searchTerm,
        pageNumber: 1,
        pageSize: 20,
      }),
    );
    // }
  }, [dispatch, searchTerm]);

  // Responsible for loading the next pages only
  useEffect(() => {
    if (!searchTerm) return;
    if (page === 1) return;
    dispatch(
      GetSearchedProductsThunk({
        searchTerm,
        pageNumber: page,
        pageSize: 20,
      }),
    );
  }, [dispatch, page, searchTerm]);

  useEffect(() => {
    if (loading !== "succeeded") return;
    if (!SearchedProducts?.pagination.hasNextPage) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      const target = entries[0];

      if (target.isIntersecting && !isFetchingRef.current) {
        isFetchingRef.current = true;
        setPage((prev) => prev + 1);
      }
    });

    if (lastProductRef.current) {
      observer.current.observe(lastProductRef.current);
    }
    return () => {
      observer.current?.disconnect();
    };
  }, [loading, SearchedProducts]);

  useEffect(() => {
    isFetchingRef.current = false;
  }, [SearchedProducts]);

  return (
    <>
      {loading === "pending" && page === 1 && <ProductGridSkeleton />}
      {loading === "succeeded" && (
        <h2 className="mt-2 mb-5">
          {SearchedProducts?.pagination.totalProducts ?? 0} Results for "
          {searchTerm}"
          {/* Returns the total number of matching products. 
          Pagination only controls how many products are displayed per page (20 at a time). */}
        </h2>
      )}
      <SearchedProductsList
        searchTerm={searchTerm}
        lastProductRef={lastProductRef}
        page={page}
      />
      <BackToTop />
    </>
  );
};

export default Search;
