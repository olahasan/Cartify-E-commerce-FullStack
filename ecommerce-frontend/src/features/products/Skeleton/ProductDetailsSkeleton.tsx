import { useEffect, useState } from "react";
import ProductDetailsSkeletonDesktop from "./ProductDetailsSkeletonDesktop";
import ProductDetailsSkeletonMobile from "./ProductDetailsSkeletonMobile";

const ProductDetailsSkeleton = () => {
  const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
      const onResize = () => setIsMobile(window.innerWidth <= 768);

      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, []);

    return isMobile;
  };

  const isMobile = useIsMobile();

  return isMobile ? (
    <ProductDetailsSkeletonMobile />
  ) : (
    <ProductDetailsSkeletonDesktop />
  );
};

export default ProductDetailsSkeleton;
