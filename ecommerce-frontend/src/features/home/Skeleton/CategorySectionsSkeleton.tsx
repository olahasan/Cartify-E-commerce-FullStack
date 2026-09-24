import CategorySectionSkeleton from "./CategorySectionSkeleton";

const CategorySectionsSkeleton = ({ length }: { length: number }) => {
  return (
    <>
      {Array.from({ length: length }).map((_, index) => (
        <CategorySectionSkeleton key={index} Length={7} />
      ))}
    </>
  );
};

export default CategorySectionsSkeleton;
