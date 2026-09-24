import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import {
  ClearCart,
  GetCartItemsByUserID,
  selectCartTotal,
} from "@cart/cartSlice";
import CartItemList from "@cart/Components/CartItemList ";
import CartSubtotalPrice from "@cart/Components/CartSubtotalPrice ";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import LottieHandler from "@shared/LottieHandler/LottieHandler";
import BackToTop from "@shared/BackToTop/BackToTop";
import styles from "../cart.module.css";
const { btns } = styles;
const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { LoginReturn } = useAppSelector((state) => state.auth);
  const { productsFullInfo, loading, items } = useAppSelector(
    (state) => state.cart,
  );
  const total = useAppSelector(selectCartTotal);
  const token = LoginReturn?.token;

  useEffect(() => {
    if (token) {
      dispatch(GetCartItemsByUserID());
    }
  }, [dispatch, token]);

  const handleNavigate = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const hasOutOfStockItems = productsFullInfo.some(
    (p) => p.availableQuantity === 0,
  );

  const handleClearCart = useCallback(() => {
    if (!token) {
      console.warn("No token - cannot clear cart");
      return;
    }
    dispatch(ClearCart());
  }, [dispatch, token]);

  const handleCheckout = useCallback(() => {
    navigate("/checkout");
    handleNavigate();
  }, [navigate]);

  if (loading === "failed") {
    return (
      <LottieHandler type="error" message="Failed to fetch data for cart" />
    );
  }

  return (
    <div>
      <h1 className="mb-5">Your Cart</h1>
      <CartItemList
        productsFullInfo={productsFullInfo}
        loading={loading}
        items={items}
      />
      <CartSubtotalPrice />
      {total > 0 && (
        <div className={btns}>
          <Button variant="warning" onClick={handleClearCart}>
            Clear Cart
          </Button>
          <Button
            variant="info"
            onClick={handleCheckout}
            disabled={hasOutOfStockItems}
            title={hasOutOfStockItems ? "Remove out of stock items first" : ""}
          >
            {hasOutOfStockItems ? "Remove out of stock items" : "Checkout"}
          </Button>
        </div>
      )}
      <BackToTop />
    </div>
  );
};

export default Cart;
