import ContentLoader from "react-content-loader";

const CategoryHeaderSkeleton = () => {
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={320}
      viewBox="0 0 1200 320"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="15" rx="0" ry="0" width="1200" height="320" />
    </ContentLoader>
  );
};

export default CategoryHeaderSkeleton;
