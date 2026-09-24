import ContentLoader from "react-content-loader";

const CategorySectionSkeleton = ({ Length }: { Length: number }) => {
  return (
    <div style={{ marginBottom: "40px" }}>
      {/* Header */}
      <ContentLoader speed={2} width="100%" height={50} viewBox="0 0 1200 50">
        {/* Section Title */}
        <rect x="0" y="8" rx="4" ry="4" width="230" height="30" />

        {/* Show All Button */}
        <rect x="1100" y="0" rx="10" ry="10" width="90" height="50" />
      </ContentLoader>

      {/* Categories */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "12px",
          overflow: "hidden",
        }}
      >
        {Array.from({ length: Length }).map((_, index) => (
          <ContentLoader
            key={index}
            speed={2}
            width={150}
            height={220}
            viewBox="0 0 150 220"
          >
            {/* Image */}
            <rect x="0" y="0" rx="10" ry="10" width="150" height="180" />

            {/* Text */}
            <rect x="15" y="192" rx="4" ry="4" width="120" height="12" />
          </ContentLoader>
        ))}
      </div>
    </div>
  );
};

export default CategorySectionSkeleton;
