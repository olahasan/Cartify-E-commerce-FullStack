import ContentLoader from "react-content-loader";

const BreadcrumbSkeleton = () => {
  return (
    <ContentLoader
      speed={2}
      height={30}
      viewBox="0 0 400 30"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="8" rx="4" ry="4" width="60" height="12" />
      <rect x="80" y="8" rx="4" ry="4" width="80" height="12" />
      <rect x="180" y="8" rx="4" ry="4" width="100" height="12" />
    </ContentLoader>
  );
};

export default BreadcrumbSkeleton;
