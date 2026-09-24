import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { getTopRated } from "@products/productSlice";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "./ProductCard";
import { BaseCarousel } from "@shared/ui/BaseCarousel/BaseCarousel";
import HomeMainSectionSkeleton from "@home/Skeleton/HomeMainSectionSkeleton";
import { NavLink } from "react-router-dom";

import styles from "../Product.module.css";
import LottieHandler from "@shared/LottieHandler/LottieHandler";
const { productCardLink } = styles;

const TopRatedCarousel = () => {
  const dispatch = useAppDispatch();
  const topRatedProducts = useAppSelector(
    (state) => state.product.topRatedProducts,
  );
  const isLoading = useAppSelector(
    (state) => state.product.topRatedProductsLoading,
  );

  useEffect(() => {
    dispatch(getTopRated());
  }, [dispatch]);

  if (isLoading === "pending") {
    return <HomeMainSectionSkeleton />;
  }

  return topRatedProducts && topRatedProducts.length > 0 ? (
    <BaseCarousel
      items={topRatedProducts}
      slidesPerView={5}
      spaceBetween={10}
      navigation
      pagination={{ clickable: true }}
      breakpoints={{
        0: { slidesPerView: 1 }, // Mobile - very small
        400: { slidesPerView: 2 }, // Mobile - big
        640: { slidesPerView: 2 }, // Mobile - big
        768: { slidesPerView: 3 }, // Tablet
        1024: { slidesPerView: 4 }, // Desktop
        1280: { slidesPerView: 5 }, // Desktop - big
      }}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      modules={[Navigation, Pagination]}
      loop={topRatedProducts.length > 5}
      className="TopRatedCarouselmySwiper"
    >
      {(item) => (
        <NavLink
          key={item.productID}
          to={`/products/${item.productID}`}
          className={productCardLink}
        >
          <ProductCard
            productID={item.productID}
            name={item.name}
            price={item.price}
            imageUrl={item.imageUrl}
            rating={item.rating}
            totalReviews={item.totalReviews}
            description={item.description}
            quantity={item.quantity}
          />
        </NavLink>
      )}
    </BaseCarousel>
  ) : (
    <LottieHandler type="empty" message="No top-rated products available." />
  );
};

export default TopRatedCarousel;
