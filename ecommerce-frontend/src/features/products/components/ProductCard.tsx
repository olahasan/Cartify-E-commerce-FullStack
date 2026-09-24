import { API_BASE_URL } from "@config/api";
import { Button, Modal, Spinner } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { getProductImages } from "@products/productSlice";
import { Navigation, Pagination } from "swiper/modules";
import LikeIcon from "@assets/svg/like.svg?react";
import LikeFillIcon from "@assets/svg/like-fill.svg?react";
import { BaseCarousel } from "@shared/ui/BaseCarousel/BaseCarousel";
import type { SwiperModule } from "swiper/types";
import styles from "../Product.module.css";
import {
  GetCartItemsByUserID,
  GetCartSummary,
  InsertUpdateCartItem,
} from "@cart/cartSlice";
import {
  actLikeToggle,
  GetWishlistByUserID,
  GetwishlistCount,
} from "@wishlist/wishlistSlice";
import { useNavigate } from "react-router-dom";
const { product, productImg, descriptionTitle, wishlistBtn } = styles;

type ProductCardProps = {
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  totalReviews: number;
  productID: number;
  description: string;
  quantity?: number;
};

const ProductCard = ({
  productID,
  name,
  price,
  imageUrl,
  rating,
  totalReviews,
  description,
  quantity,
}: ProductCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [showAuthChoice, setShowAuthChoice] = useState(false);
  const { LoginReturn } = useAppSelector((state) => state.auth);
  const UserID = LoginReturn?.userID;
  const token = LoginReturn?.token;
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isLiked = wishlistItems.includes(productID);
  const images = useAppSelector(
    (state) => state.product.productImages[productID],
  );

  useEffect(() => {
    if (!images) {
      dispatch(getProductImages(productID));
    }
  }, [dispatch, productID, images]);

  const thumbnails = images?.thumbs || [];

  useEffect(() => {
    if (!isBtnDisabled) {
      return;
    }

    const debounce = setTimeout(() => {
      setIsBtnDisabled(false);
    }, 300);

    return () => clearTimeout(debounce);
  }, [isBtnDisabled]);

  const addToCartHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!token) {
      setShowLoginRequired(true);
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    setIsBtnDisabled(true);
    if (token) {
      await dispatch(InsertUpdateCartItem({ ProductID: productID }));
      await dispatch(GetCartItemsByUserID());
      await dispatch(GetCartSummary());
    }
    setIsBtnDisabled(true);
  };

  const likeToggleHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!UserID || !token) {
      console.warn("User not logged in");
      setShowLoginRequired(true);
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    if (isLikeLoading) return;

    setIsLikeLoading(true);

    try {
      if (token) {
        await dispatch(actLikeToggle({ ProductID: productID }));
        await dispatch(GetwishlistCount());
        await dispatch(GetWishlistByUserID());
      }
    } catch (error) {
      console.error("Error in likeToggleHandler", error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showLoginRequired && (
          <motion.div
            key="loginRequired"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
          >
            <Modal
              show={showLoginRequired}
              onHide={() => setShowLoginRequired(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Login Required</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <p>You need to login first to access this Feature</p>
                <p className="text-muted">
                  "Login to save your items and track your orders!"
                </p>
              </Modal.Body>

              <Modal.Footer>
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowLoginRequired(false);
                    setShowAuthChoice(true);
                  }}
                >
                  Login/Register
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowLoginRequired(false)}
                >
                  Maybe Later
                </Button>
              </Modal.Footer>
            </Modal>
          </motion.div>
        )}

        {showAuthChoice && (
          <motion.div
            key="authChoice"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
          >
            <Modal
              show={showAuthChoice}
              onHide={() => setShowAuthChoice(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Continue</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Do you already have an account?</p>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowAuthChoice(false);
                    navigate("/login");
                  }}
                >
                  Yes, Login
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    setShowAuthChoice(false);
                    navigate("/register");
                  }}
                >
                  No, Create Account
                </Button>
              </Modal.Footer>
            </Modal>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={product}>
        <div
          className={wishlistBtn}
          onClick={likeToggleHandler}
          style={{ pointerEvents: isLikeLoading ? "none" : "auto" }}
        >
          {isLikeLoading ? (
            <>
              <Spinner animation="border" size="sm" />
            </>
          ) : isLiked ? (
            <LikeFillIcon />
          ) : (
            <LikeIcon />
          )}
        </div>
        <div className={productImg}>
          {thumbnails.length > 1 ? (
            <BaseCarousel<string>
              items={thumbnails}
              navigation
              pagination={{ clickable: true }}
              modules={[Navigation, Pagination] as SwiperModule[]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              className="innerSwiper"
            >
              {(item) => (
                <img
                  loading="lazy"
                  src={`${API_BASE_URL}${item}`}
                  alt={name}
                  onError={(e) => {
                    e.currentTarget.src = "/fallback.jpg";
                  }}
                />
              )}
            </BaseCarousel>
          ) : (
            <img
              loading="lazy"
              src={
                thumbnails.length
                  ? `${API_BASE_URL}${thumbnails[0]}`
                  : `${API_BASE_URL}${imageUrl}`
              }
              alt={name}
              onError={(e) => {
                e.currentTarget.src = "/fallback.jpg";
              }}
            />
          )}
        </div>
        <p className={descriptionTitle} title={description}>
          {description}
        </p>
        <h2>{name}</h2>
        <h3>{price} EGP</h3>
        <h3>
          ⭐ {rating} ({totalReviews} reviews)
        </h3>
        <Button
          variant="info"
          onClick={addToCartHandler}
          disabled={isBtnDisabled || quantity === 0}
          style={{
            cursor: isBtnDisabled || quantity === 0 ? "auto" : "pointer",
            pointerEvents: "auto",
            opacity: quantity === 0 ? 0.65 : 1,
          }}
        >
          {isBtnDisabled ? (
            <>
              <Spinner animation="border" size="sm" /> Loading...
            </>
          ) : quantity === 0 ? (
            "Out of Stock"
          ) : (
            "Add to cart"
          )}
        </Button>
      </div>
    </>
  );
};

export default ProductCard;
