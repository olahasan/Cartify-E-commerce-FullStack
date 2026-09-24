import ContentLoader from "react-content-loader";

const CartItemSkeleton = () => {
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={220}
      viewBox="0 0 1300 220"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      {/* image */}
      <rect x="10" y="10" rx="8" ry="8" width="132" height="180" />

      {/* product title */}
      <rect x="170" y="20" rx="4" ry="4" width="250" height="24" />

      {/* product price */}
      <rect x="170" y="55" rx="4" ry="4" width="90" height="24" />

      {/* subtotal - price */}
      <rect x="170" y="85" rx="4" ry="4" width="90" height="24" />

      {/* + button */}
      <rect x="170" y="130" rx="6" ry="6" width="28" height="28" />

      {/* - */}
      <rect x="205" y="144" rx="0" ry="0" width="18" height="4" />

      {/* - button */}
      <rect x="230" y="130" rx="6" ry="6" width="28" height="28" />

      {/* remove from cart button */}
      <rect x="160" y="165" rx="6" ry="6" width="117" height="38" />

      {/* bottom line */}
      <rect x="0" y="210" rx="0" ry="0" width="700" height="1" />
    </ContentLoader>
  );
};

export default CartItemSkeleton;
