import { useAppSelector } from "@app/hooks";
import WishlistItemSkeleton from "./WishlistItemSkeleton";

const WishlistSkeleton = () => {
  const wishlistCount = useAppSelector((state) => state.wishlist.wishlistCount);
  return (
    <>
      {Array.from({ length: wishlistCount }).map((_, index) => (
        <WishlistItemSkeleton key={index} />
      ))}
    </>
  );
};

export default WishlistSkeleton;
