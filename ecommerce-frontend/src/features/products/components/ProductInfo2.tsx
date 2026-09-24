import { API_BASE_URL } from "@config/api";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";
import styles from "../ProductInfo2.module.css";
const {
  overlay,
  section: sectionClass,
  container,
  x,
  main,
  arrow,
  tr,
  tl,
  new: newClass,
  hidden,
  sp,
  pic,
  top,
  bottom,
  pics,
  ttrr,
  ttll,
  text,
  spans,
  sto,
  id,
  mp,
  narrow,
} = styles;

import plus from "@assets/svg/icon-plus.svg";
import minus from "@assets/svg/icon-minus.svg";

import close from "@assets/svg/icon-close.svg";
import next from "@assets/svg/icon-next.svg";
import previous from "@assets/svg/icon-previous.svg";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import {
  GetCartItemsByUserID,
  GetCartSummary,
  IncrementDecrementCartItem,
  InsertUpdateCartItem,
  localDecrementQuantity,
  localIncrementQuantity,
} from "@cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import type { TProductItems } from "@products/productAPI";

interface ProductInfo2Props {
  ProductItems: TProductItems;
  thumbnails: string[];
  fullImages: string[];
}

const ProductInfo2: React.FC<ProductInfo2Props> = ({
  ProductItems,
  thumbnails,
  fullImages,
}) => {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const dispatch = useAppDispatch();
  const { LoginReturn } = useAppSelector((state) => state.auth);
  const token = LoginReturn?.token;
  const { items } = useAppSelector((state) => state.cart);
  const cartQuantity = items[String(ProductItems.productID)] || 0;
  const AvailableQuantity = ProductItems.quantity;
  const handleAddToCart = async () => {
    if (!token) {
      alert("Please login first!");
      return;
    }
    setIsAddingToCart(true);
    await dispatch(InsertUpdateCartItem({ ProductID: ProductItems.productID }));
    await dispatch(GetCartItemsByUserID());
    await dispatch(GetCartSummary());
    setIsAddingToCart(false);
  };

  const handleIncrement = async () => {
    if (!token) return;
    if (AvailableQuantity === 0) return;
    dispatch(localIncrementQuantity(ProductItems.productID));
    await dispatch(
      IncrementDecrementCartItem({
        ProductID: ProductItems.productID,
        Action: "Increment",
      }),
    );
    await dispatch(GetCartSummary());
  };

  const handleDecrement = async () => {
    if (!token) return;
    if (cartQuantity === 0) return;
    dispatch(localDecrementQuantity(ProductItems.productID));
    await dispatch(
      IncrementDecrementCartItem({
        ProductID: ProductItems.productID,
        Action: "Decrement",
      }),
    );
    await dispatch(GetCartSummary());
  };

  useEffect(() => {
    if (fullImages && fullImages.length > 0) {
      setSelectedImg(fullImages[0]);
      setCurrentIndex(0);
    }
  }, [fullImages]);

  useEffect(() => {
    if (overlayVisible) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [overlayVisible]);

  const handleThumbnailClick = (index: number) => {
    setSelectedImg(fullImages[index]);
    setCurrentIndex(index);
  };

  // next button
  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = Math.min(prevIndex + 1, thumbnails.length - 1);
      setSelectedImg(fullImages[newIndex]);
      return newIndex;
    });
  };

  // prev button
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = Math.max(prevIndex - 1, 0);
      setSelectedImg(fullImages[newIndex]);
      return newIndex;
    });
  };

  const handleBigClick = () => {
    setOverlayVisible(true);
  };

  const handleCloseOverlay = () => {
    setOverlayVisible(false);
  };

  return (
    <>
      <div
        className={`${overlay} ${!overlayVisible ? hidden : ""}`}
        onClick={handleCloseOverlay}
      ></div>

      <section className={sectionClass}>
        <div className={container}>
          <div className={`${newClass} ${!overlayVisible ? hidden : ""}`}>
            <div className={x} onClick={handleCloseOverlay}>
              <img src={close} alt="close" />
            </div>
            <div className={main}>
              {selectedImg && (
                <img src={`${API_BASE_URL}${selectedImg}`} alt="pic" />
              )}
            </div>
            <div className={arrow}>
              <div
                className={tr}
                onClick={handleNext}
                style={{
                  backgroundColor:
                    currentIndex === thumbnails.length - 1
                      ? "white"
                      : "#ff7d1a",
                  border:
                    currentIndex === thumbnails.length - 1
                      ? "none"
                      : "1px solid white",
                }}
              >
                <img src={next} alt="next" />
              </div>
              <div
                className={tl}
                onClick={handlePrev}
                style={{
                  backgroundColor: currentIndex === 0 ? "white" : "#ff7d1a",
                  border: currentIndex === 0 ? "none" : "1px solid white",
                }}
              >
                <img src={previous} alt="prev" />
              </div>
            </div>

            {/* thumbnails */}
            <div className={sp}>
              {thumbnails.map((thumb, index) => (
                <div
                  className="img"
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    src={`${API_BASE_URL}${thumb}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="ss"
                    style={{
                      outline:
                        selectedImg === fullImages[index]
                          ? "3px solid #ff7d1a"
                          : "none",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className={pic}>
            <div className={top}>
              <div className={narrow}>
                <div
                  className={ttrr}
                  onClick={handleNext}
                  style={{
                    backgroundColor:
                      currentIndex === thumbnails.length - 1
                        ? "white"
                        : "#ff7d1a",
                    border:
                      currentIndex === thumbnails.length - 1
                        ? "none"
                        : "1px solid white",
                  }}
                >
                  <img src={next} alt="next" />
                </div>

                <div
                  className={ttll}
                  onClick={handlePrev}
                  style={{
                    backgroundColor: currentIndex === 0 ? "white" : "#ff7d1a",
                    border: currentIndex === 0 ? "none" : "1px solid white",
                  }}
                >
                  <img src={previous} alt="previous" />
                </div>
              </div>

              <div
                onClick={handleBigClick}
                style={{ cursor: "zoom-in" }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleBigClick();
                  }
                }}
              >
                <InnerImageZoom
                  src={
                    selectedImg
                      ? `${API_BASE_URL}${selectedImg}`
                      : `${API_BASE_URL}${fullImages[0]}`
                  }
                  zoomSrc={
                    selectedImg
                      ? `${API_BASE_URL}${selectedImg}`
                      : `${API_BASE_URL}${fullImages[0]}`
                  }
                  zoomType="hover"
                  zoomScale={1.3}
                  zoomPreload
                  hideHint
                  fadeDuration={150}
                />
              </div>
            </div>
            <div className={bottom}>
              <div className={pics}>
                {thumbnails.map((thumb, index) => (
                  <div
                    className="img"
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img
                      src={`${API_BASE_URL}${thumb}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="s"
                      style={{
                        outline:
                          selectedImg === fullImages[index]
                            ? "3px solid #ff7d1a"
                            : "none",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={text}>
            <small>{ProductItems.name}</small>
            <p>{ProductItems.description}</p>
            <p>⭐ {ProductItems.rating} (Rating)</p>
            <div className={spans}>
              <div className={sto}>
                <span>
                  <span style={{ color: "green" }}> EGP </span>
                  {ProductItems.price}
                </span>
              </div>
            </div>
            <footer>
              <div className={id}>
                <div className={mp}>
                  <img
                    src={minus}
                    alt="minus"
                    onClick={handleDecrement}
                    style={{
                      cursor: cartQuantity === 0 ? "auto" : "pointer",
                      opacity: cartQuantity === 0 ? 0.5 : 1,
                    }}
                  />
                  <span>{cartQuantity}</span>
                  <img
                    src={plus}
                    alt="plus"
                    onClick={handleIncrement}
                    style={{
                      cursor: AvailableQuantity === 0 ? "auto" : "pointer",
                      opacity: AvailableQuantity === 0 ? 0.5 : 1,
                    }}
                  />
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || AvailableQuantity === 0}
              >
                {isAddingToCart ? (
                  <>
                    <Spinner animation="border" size="sm" /> Loading...
                  </>
                ) : AvailableQuantity === 0 ? (
                  "Out of Stock"
                ) : (
                  "Add to cart"
                )}
              </button>
            </footer>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductInfo2;
