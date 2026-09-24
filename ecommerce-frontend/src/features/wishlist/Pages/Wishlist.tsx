import { useCallback, useEffect } from "react";
import { Button } from "react-bootstrap";

import { useAppDispatch, useAppSelector } from "@app/hooks";

import BackToTop from "@shared/BackToTop/BackToTop";
import LottieHandler from "@shared/LottieHandler/LottieHandler";

import WishListItemsList from "@wishlist/Components/WishListItemsList";
import { GetClearWishlist } from "@wishlist/wishlistSlice";

import styles from "../wishlist.module.css";

const { ClearBtn } = styles;
const Wishlist = () => {
  const dispatch = useAppDispatch();
  const { productsFullInfo, loading, error, wishlisttotal } = useAppSelector(
    (state) => state.wishlist,
  );
  const { LoginReturn } = useAppSelector((state) => state.auth);
  const token = LoginReturn?.token;
  const handleClearWishlist = useCallback(() => {
    if (token) {
      dispatch(GetClearWishlist());
    }
  }, [dispatch, token]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  if (loading === "failed") {
    return (
      <LottieHandler type="error" message="Failed to fetch data for wishlist" />
    );
  }

  return (
    <div>
      <h1 className="mb-5">Your Wishlist</h1>
      <WishListItemsList
        productsFullInfo={productsFullInfo}
        loading={loading}
        error={error}
      />
      {wishlisttotal > 0 && (
        <div>
          <Button
            className={ClearBtn}
            variant="warning"
            onClick={handleClearWishlist}
          >
            Clear Wishlist
          </Button>
        </div>
      )}
      <BackToTop />
    </div>
  );
};

export default Wishlist;
