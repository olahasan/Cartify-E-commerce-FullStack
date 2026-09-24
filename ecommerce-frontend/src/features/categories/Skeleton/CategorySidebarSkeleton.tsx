import ContentLoader from "react-content-loader";

const CategorySidebarSkeleton = () => {
  return (
    <ContentLoader speed={2} width={300} height={750} viewBox="0 0 300 750">
      {/* Header */}
      <rect x="0" y="0" rx="4" ry="4" width="80" height="24" />
      <rect x="210" y="0" rx="4" ry="4" width="80" height="20" />

      {/* Divider */}
      <rect x="0" y="40" rx="0" ry="0" width="300" height="1" />

      {/* Categories Title */}
      <rect x="0" y="65" rx="4" ry="4" width="120" height="20" />

      {/* Category Tree */}

      <rect x="0" y="97" rx="2" ry="2" width="16" height="16" />
      <rect x="28" y="97" rx="3" ry="3" width="170" height="16" />

      <rect x="0" y="132" rx="2" ry="2" width="16" height="16" />
      <rect x="28" y="132" rx="3" ry="3" width="170" height="16" />

      <rect x="0" y="167" rx="2" ry="2" width="16" height="16" />
      <rect x="28" y="167" rx="3" ry="3" width="170" height="16" />

      <rect x="0" y="202" rx="2" ry="2" width="16" height="16" />
      <rect x="28" y="202" rx="3" ry="3" width="170" height="16" />

      <rect x="0" y="237" rx="2" ry="2" width="16" height="16" />
      <rect x="28" y="237" rx="3" ry="3" width="170" height="16" />

      <rect x="0" y="272" rx="2" ry="2" width="16" height="16" />
      <rect x="28" y="272" rx="3" ry="3" width="170" height="16" />

      <rect x="0" y="307" rx="2" ry="2" width="16" height="16" />
      <rect x="28" y="307" rx="3" ry="3" width="170" height="16" />

      {/* Price Range */}
      <rect x="0" y="400" rx="4" ry="4" width="120" height="20" />

      {/* Slider */}
      <rect x="0" y="445" rx="8" ry="8" width="260" height="8" />

      {/* Min / Max */}
      <rect x="0" y="480" rx="4" ry="4" width="120" height="40" />
      <rect x="140" y="480" rx="4" ry="4" width="120" height="40" />

      {/* Ratings */}
      <rect x="0" y="560" rx="4" ry="4" width="150" height="20" />

      <rect x="0" y="600" rx="4" ry="4" width="220" height="16" />
      <rect x="0" y="635" rx="4" ry="4" width="220" height="16" />
      <rect x="0" y="670" rx="4" ry="4" width="220" height="16" />
      <rect x="0" y="705" rx="4" ry="4" width="220" height="16" />

      {/* Availability */}
      <rect x="0" y="760" rx="4" ry="4" width="120" height="20" />

      <circle cx="12" cy="805" r="8" />
      <rect x="30" y="797" rx="3" ry="3" width="140" height="14" />
    </ContentLoader>
  );
};

export default CategorySidebarSkeleton;
