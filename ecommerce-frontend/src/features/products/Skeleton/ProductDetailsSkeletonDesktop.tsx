import ContentLoader from "react-content-loader";

const ProductDetailsSkeletonDesktop = () => {
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={700}
      viewBox="0 0 1200 700"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      {/* big image */}
      <rect x="150" y="80" rx="15" ry="15" width="350" height="350" />

      {/* thumbnails */}
      <rect x="150" y="500" rx="10" ry="10" width="70" height="70" />
      <rect x="230" y="500" rx="10" ry="10" width="70" height="70" />
      <rect x="310" y="500" rx="10" ry="10" width="70" height="70" />

      {/* brand */}
      <rect x="620" y="140" rx="4" ry="4" width="120" height="25" />

      {/* product name */}
      <rect x="620" y="180" rx="4" ry="4" width="350" height="30" />

      {/* rating */}
      <rect x="620" y="230" rx="4" ry="4" width="170" height="25" />

      {/* price */}
      <rect x="620" y="300" rx="4" ry="4" width="100" height="30" />

      {/* quantity selector */}
      <rect x="620" y="340" rx="8" ry="8" width="120" height="55" />

      {/* add to cart button */}
      <rect x="750" y="340" rx="8" ry="8" width="300" height="55" />
    </ContentLoader>
  );
};

export default ProductDetailsSkeletonDesktop;
