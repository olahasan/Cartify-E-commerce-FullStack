import { useMemo } from "react";
import CartItem from "./CartItem ";
import CartItemListSkeleton from "@cart/Skeletons/CartItemListSkeleton";
import LottieHandler from "@shared/LottieHandler/LottieHandler";

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

type Props = {
  productsFullInfo: TCartItem[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  items: Record<string, number>;
};

const CartItemList: React.FC<Props> = ({
  productsFullInfo,
  loading,
  items,
}) => {
  const visibleProducts = useMemo(() => {
    return productsFullInfo.filter(
      (p) => Number(items[String(p.productID)]) > 0,
    );
  }, [productsFullInfo, items]);
  if (loading === "pending") return <CartItemListSkeleton />;

  if (visibleProducts.length === 0) {
    return <LottieHandler type="empty" message="Your cart is empty 🛒" />;
  }

  return (
    <>
      {visibleProducts.map((product) => {
        return <CartItem key={product.productID} product={product} />;
      })}
    </>
  );
};

export default CartItemList;
