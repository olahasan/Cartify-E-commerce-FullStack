import AdvertisementBannerSkeleton from "./AdvertisementBannerSkeleton";
import CategorySectionsSkeleton from "./CategorySectionsSkeleton";
import HeroCarouselSkeleton from "./HeroCarouselSkeleton";
import HomeCategoriesCarouselSkeleton from "./HomeCategoriesCarouselSkeleton";
import HomeMainSectionSkeleton from "./HomeMainSectionSkeleton";

const HomeSkeleton = () => {
  return (
    <>
      <HeroCarouselSkeleton />
      <AdvertisementBannerSkeleton rx={0} ry={0} height={52} />
      <HomeCategoriesCarouselSkeleton />
      <HomeMainSectionSkeleton />
      <CategorySectionsSkeleton length={4} />
      <AdvertisementBannerSkeleton rx={0} ry={0} height={200} />
      <CategorySectionsSkeleton length={1} /> 
      <AdvertisementBannerSkeleton rx={0} ry={0} height={200} />
      <CategorySectionsSkeleton length={1} />
      <AdvertisementBannerSkeleton rx={0} ry={0} height={182} />
      <CategorySectionsSkeleton length={1} /> 
    </>
  );
};

export default HomeSkeleton;


