import MainHomeCarousel from "@swiper/carousels/MainHomeCarousel";

interface HeroCarouselProps {
  pics: string[];
  navigationValue?: boolean;
}
const HeroCarousel: React.FC<HeroCarouselProps> = ({
  pics,
  navigationValue,
}) => {
  return <MainHomeCarousel Allpics={pics} navigationValue={navigationValue} />;
};

export default HeroCarousel;
