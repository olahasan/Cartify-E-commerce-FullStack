import { useParams } from "react-router-dom";
import { useEffect } from "react";
import "react-inner-image-zoom/lib/styles.min.css";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { getProductImages, getProductItems } from "@products/productSlice";
import ProductInfo2 from "@products/components/ProductInfo2";
import ProductDetailsSkeleton from "@products/Skeleton/ProductDetailsSkeleton";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();

  const dispatch = useAppDispatch();
  const { ProductItems, productImages } = useAppSelector(
    (state) => state.product,
  );

  const productId = id ? parseInt(id) : 0;
  const thumbnails = productImages[productId]?.thumbs || [];
  const fullImages = productImages[productId]?.fulls || [];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [productId]);

  useEffect(() => {
    if (id) {
      const productId = parseInt(id, 10);
      if (!isNaN(productId)) {
        dispatch(getProductItems(productId));
        dispatch(getProductImages(productId));
      }
    }
  }, [id, dispatch]);

  if (!ProductItems) return <ProductDetailsSkeleton />;

  return (
    <>
      <ProductInfo2
        ProductItems={ProductItems}
        thumbnails={thumbnails}
        fullImages={fullImages}
      />
    </>
  );
};
export default ProductDetails;
