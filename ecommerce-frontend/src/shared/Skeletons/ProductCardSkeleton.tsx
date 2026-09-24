import ContentLoader from "react-content-loader";

const ProductCardSkeleton = () => {
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={550.58}
      viewBox="0 0 327.5 550.58"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      {/* wishlist icon */}
      <rect x="10" y="10" rx="5" ry="5" width="28" height="28" />

      {/* image */}
      <rect x="10" y="50" rx="10" ry="10" width="306" height="278" />

      {/* description line 1 */}
      <rect x="10" y="345" rx="3" ry="3" width="300" height="18" />

      {/* description line 2 */}
      <rect x="10" y="365" rx="3" ry="3" width="265.5" height="18" />

      {/* product name */}
      <rect x="10" y="395" rx="3" ry="3" width="200" height="18" />

      {/* price */}
      <rect x="10" y="425" rx="3" ry="3" width="60" height="21.59" />

      {/* rating */}
      <rect x="10" y="455" rx="3" ry="3" width="140" height="21.59" />

      {/* button */}
      <rect x="10" y="485" rx="5" ry="5" width="305.5" height="38" />
    </ContentLoader>
  );
};

export default ProductCardSkeleton;
