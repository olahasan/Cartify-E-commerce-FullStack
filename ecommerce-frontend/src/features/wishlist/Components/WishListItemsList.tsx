import type { TWishlistItem } from "@wishlist/wishlistAPI";

import LottieHandler from "@shared/LottieHandler/LottieHandler";
import WishlistSkeleton from "@wishlist/Skeletons/WishlistSkeleton";

import WishListItem from "./WishListItem";

type Props = {
  productsFullInfo: TWishlistItem[];
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
};

const WishListItemsList: React.FC<Props> = ({
  productsFullInfo,
  loading,
  error,
}) => {
  if (loading === "pending") return <WishlistSkeleton />;
  if (error) return <p>{error}</p>;

  if (!productsFullInfo || productsFullInfo.length === 0) {
    return <LottieHandler type="empty" message="Your wishlist is empty 🛒" />;
  }

  return (
    <>
      {productsFullInfo.map((product) => {
        return <WishListItem key={product.productID} product={product} />;
      })}
    </>
  );
};

export default WishListItemsList;
