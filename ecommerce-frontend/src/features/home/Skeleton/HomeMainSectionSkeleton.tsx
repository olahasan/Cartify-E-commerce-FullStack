import ContentLoader from "react-content-loader";
import ProductCardSkeleton from "@shared/Skeletons/ProductCardSkeleton";

const HomeMainSectionSkeleton = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "-70px",
          marginTop: "60px",
        }}
      >
        <ContentLoader speed={2} width={480} height={30} viewBox="0 0 480 30">
          <rect x="0" y="4" rx="4" ry="4" width="480" height="22" />
        </ContentLoader>
      </div>

      <div
        style={{
          display: "flex",
        }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
};
export default HomeMainSectionSkeleton;
