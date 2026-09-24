import { Button } from "react-bootstrap";
import styles from "../cart.module.css";
import { API_BASE_URL } from "@config/api";
import {
  selectCartSubtotalById,
  RemoveFromCart,
  localIncrementQuantity,
  localDecrementQuantity,
  IncrementDecrementCartItem,
  localRemoveItem,
  GetCartSummary,
} from "@cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { formatCurrency } from "@shared/utils/formatCurrency";
import React, { useState } from "react";

const {
  cartItem,
  productStyle,
  productImg,
  productInfo,
  thePrice,
  customFlex,
} = styles;

type TCartItem = {
  productID: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  imageUrl: string;
  altText: string;
  availableQuantity: number;
};

type CartItemProps = {
  product: TCartItem;
};

const CartItem = ({ product }: CartItemProps) => {
  const dispatch = useAppDispatch();
  const [isRemoving, setIsRemoving] = useState(false);
  const subtotal = useAppSelector(selectCartSubtotalById(product.productID));
  const { items } = useAppSelector((state) => state.cart);
  const { LoginReturn } = useAppSelector((state) => state.auth);
  const token = LoginReturn?.token;
  const quantity = items[String(product.productID)] ?? 0;
  const isOutOfStock = product.availableQuantity === 0;
  const isMaxQuantity = quantity >= product.availableQuantity;

  const handleDeleteItemFromCart = async () => {
    if (!token) {
      return;
    }
    setIsRemoving(true);

    dispatch(localRemoveItem(product.productID));

    try {
      await dispatch(RemoveFromCart({ ProductID: product.productID })).unwrap();
      await dispatch(GetCartSummary());
    } catch (error) {
      console.error("Failed to remove:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleIncrementDecrementCartItem = async (
    Action: "Increment" | "Decrement",
  ) => {
    if (!token) {
      return;
    }

    if (Action === "Increment") {
      dispatch(localIncrementQuantity(product.productID));
      try {
        await dispatch(
          IncrementDecrementCartItem({
            ProductID: product.productID,
            Action: "Increment",
          }),
        ).unwrap();
        await dispatch(GetCartSummary());
      } catch (error) {
        console.error("x failed increment", error);
      }
    } else if (Action === "Decrement") {
      const currentQuantity = quantity;
      if (currentQuantity === 1) {
        dispatch(localRemoveItem(product.productID));
        try {
          await dispatch(
            RemoveFromCart({ ProductID: product.productID }),
          ).unwrap();
          await dispatch(GetCartSummary());
        } catch (error) {
          console.error("Failed to remove:", error);
        }
      } else {
        dispatch(localDecrementQuantity(product.productID));
        try {
          await dispatch(
            IncrementDecrementCartItem({
              ProductID: product.productID,
              Action: "Decrement",
            }),
          ).unwrap();
          await dispatch(GetCartSummary());
        } catch (error) {
          console.error("Failed to decrement:", error);
        }
      }
    }
  };

  return (
    <div className={cartItem}>
      <div className={productStyle}>
        <div className={productImg}>
          {product.imageUrl ? (
            <img
              src={`${API_BASE_URL}${product.imageUrl}`}
              alt={product.altText}
            />
          ) : (
            <img src="/fallback.jpg" alt="fallback" />
          )}
        </div>
        <div className={productInfo}>
          <div>
            <h5>{product.productName}</h5>
            <p className={thePrice}>{formatCurrency(product.price)}</p>
            <p className={thePrice}>{formatCurrency(subtotal)}</p>
          </div>
          <div>
            <div className={`d-flex align-items-center ${customFlex}`}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleIncrementDecrementCartItem("Decrement")}
                disabled={isRemoving}
              >
                -
              </Button>
              <span className="mx-2">{quantity} </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleIncrementDecrementCartItem("Increment")}
                disabled={isRemoving || isMaxQuantity || isOutOfStock}
              >
                +
              </Button>
            </div>
          </div>

          <Button
            variant="danger"
            className="mt-2"
            onClick={handleDeleteItemFromCart}
            disabled={isRemoving}
          >
            {isRemoving ? "Removing..." : "Remove"}
          </Button>
          {isOutOfStock && <span>Out of Stock</span>}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CartItem);
