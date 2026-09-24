import { useAppSelector } from "@app/hooks";
import CartItemSkeleton from "./CartItemSkeleton";

const CartItemListSkeleton = () => {
  const cartItems = useAppSelector(
    (state) => state.cart.productsFullInfo.length,
  );

  return (
    <>
      {Array.from({ length: cartItems }).map((_, index) => (
        <CartItemSkeleton key={index} />
      ))}
    </>
  );
};

export default CartItemListSkeleton;
