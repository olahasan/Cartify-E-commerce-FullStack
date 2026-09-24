import ContentLoader from "react-content-loader";

const WishlistItemSkeleton = () => {
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={220}
      viewBox="0 0 1200 220"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      {/* image */}
      <rect x="10" y="10" rx="8" ry="8" width="132" height="180" />

      {/* product title */}
      <rect x="160" y="20" rx="4" ry="4" width="250" height="24" />

      {/* price */}
      <rect x="160" y="65" rx="4" ry="4" width="90" height="24" />

      {/* rating */}
      <rect x="160" y="110" rx="4" ry="4" width="180" height="18" />

      {/* add to cart button */}
      <rect x="160" y="150" rx="6" ry="6" width="117" height="38" />

      {/* remove button */}
      <rect x="290" y="150" rx="6" ry="6" width="100" height="38" />

      {/* bottom line */}
      <rect x="0" y="210" rx="0" ry="0" width="700" height="1" />
    </ContentLoader>
  );
};

export default WishlistItemSkeleton;
