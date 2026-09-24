import { formatCurrency } from "@shared/utils/formatCurrency";
import styles from "../wishlist.module.css";
import { API_BASE_URL } from "@config/api";
import { Button, Spinner } from "react-bootstrap";
import { RemoveWishlistItem } from "@wishlist/wishlistSlice";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import {
  GetCartItemsByUserID,
  GetCartSummary,
  InsertUpdateCartItem,
} from "@cart/cartSlice";
import { useState } from "react";
import type { TWishlistItem } from "@wishlist/wishlistAPI";

const { wishlistItem, productStyle, productImg, productInfo, thePrice, btns } =
  styles;

type WishlistItemProps = {
  product: TWishlistItem;
};
const WishListItem = ({ product }: WishlistItemProps) => {
  const dispatch = useAppDispatch();
  const { LoginReturn } = useAppSelector((state) => state.auth);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const token = LoginReturn?.token;
  const handleAddToCart = async () => {
    if (!token) {
      alert("Please login first!");
      return;
    }
    setIsAddingToCart(true);
    await dispatch(InsertUpdateCartItem({ ProductID: product.productID }));
    await dispatch(GetCartItemsByUserID());
    await dispatch(GetCartSummary());
    setIsAddingToCart(false);
  };

  const handleRemove = (productID: number) => {
    if (token) {
      dispatch(RemoveWishlistItem({ ProductID: productID }));
    }
  };

  return (
    <div className={wishlistItem}>
      <div className={productStyle}>
        <div className={productImg}>
          {product.imageUrl ? (
            <img
              src={`${API_BASE_URL}${product.imageUrl}`}
              alt={product.productName}
            />
          ) : (
            <img src="/fallback.jpg" alt="Product image not available" />
          )}
        </div>
        <div className={productInfo}>
          <div>
            <h5>{product.productName}</h5>
            <p className={thePrice}>{formatCurrency(product.price)}</p>
            <h3>
              ⭐ {product.rating} ({product.totalReviews} reviews)
            </h3>
          </div>
          <div className={btns}>
            <Button
              variant="info"
              className="mt-auto me-2"
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.quantity === 0}
            >
              {isAddingToCart ? (
                <>
                  <Spinner animation="border" size="sm" /> Loading...
                </>
              ) : product.quantity === 0 ? (
                "Out of Stock"
              ) : (
                "Add to cart"
              )}
            </Button>

            <Button
              variant="danger"
              className="mt-auto"
              onClick={() => {
                if (token) {
                  handleRemove(product.productID);
                } else {
                  alert("Please login first!");
                }
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishListItem;
