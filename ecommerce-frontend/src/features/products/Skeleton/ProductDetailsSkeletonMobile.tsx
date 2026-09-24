import ContentLoader from "react-content-loader";

const ProductDetailsSkeletonMobile = () => {
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={700}
      viewBox="0 0 360 700"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      {/* big image */}
      <rect x="20" y="20" rx="15" ry="15" width="320" height="260" />

      {/* brand */}
      <rect x="20" y="390" rx="4" ry="4" width="90" height="15" />

      {/* product name line 1 */}
      <rect x="20" y="420" rx="4" ry="4" width="260" height="20" />

      {/* product name line 2 */}
      <rect x="20" y="450" rx="4" ry="4" width="220" height="20" />

      {/* rating */}
      <rect x="20" y="490" rx="4" ry="4" width="150" height="18" />

      {/* price */}
      <rect x="20" y="530" rx="4" ry="4" width="90" height="25" />

      {/* quantity selector */}
      <rect x="20" y="580" rx="8" ry="8" width="100" height="45" />

      {/* add to cart button */}
      <rect x="140" y="580" rx="8" ry="8" width="200" height="45" />
    </ContentLoader>
  );
};

export default ProductDetailsSkeletonMobile;
