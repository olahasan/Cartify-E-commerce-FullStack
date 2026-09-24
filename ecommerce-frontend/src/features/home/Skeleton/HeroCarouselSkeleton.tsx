import ContentLoader from "react-content-loader";

const HeroCarouselSkeleton = () => {
  return (
    <ContentLoader speed={2} width="100%" height={300} viewBox="0 0 1200 300">
      <rect x="0" y="0" rx="30" ry="30" width="1200" height="300" />
    </ContentLoader>
  );
};

export default HeroCarouselSkeleton;
