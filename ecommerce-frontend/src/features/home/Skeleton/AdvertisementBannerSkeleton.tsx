import ContentLoader from "react-content-loader";

const AdvertisementBannerSkeleton = ({
  rx,
  ry,
  height,
}: {
  rx: number;
  ry: number;
  height: number;
}) => {
  return (
    <div className="mb-5">
      <ContentLoader
        speed={2}
        width="100%"
        height={height}
        viewBox={`0 0 1200 ${height}`}
      >
        <rect x="0" y="0" rx={rx} ry={ry} width="1200" height={height} />
      </ContentLoader>
    </div>
  );
};

export default AdvertisementBannerSkeleton;
