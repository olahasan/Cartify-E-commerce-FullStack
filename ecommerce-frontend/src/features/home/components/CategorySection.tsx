import CategoryCarousel from "@products/components/CategoryCarousel";
import { getHomeSectionCarousel } from "@products/productSlice";

interface ICategorySectionProps {
  sectionName: string;
  link: string;
  sectionSlug: string;
}

const CategorySection: React.FC<ICategorySectionProps> = ({
  sectionName,
  link,
  sectionSlug,
}) => {
  return (
    <CategoryCarousel
      sectionName={sectionName}
      sectionSlug={sectionSlug}
      fetchAction={getHomeSectionCarousel}
      shopAllLink={link}
    />
  );
};

export default CategorySection;
