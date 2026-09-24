import "../styles/styles.css";
import styles from "../styles/HomeCarousel.module.css";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { BaseCarousel } from "@shared/ui/BaseCarousel/BaseCarousel";

const { carouselImage } = styles;

interface MainHomeCarouselProps {
  Allpics: string[];
  navigationValue?: boolean;
}
const MainHomeCarousel = ({
  Allpics,
  navigationValue = true,
}: MainHomeCarouselProps) => {
  return (
    <BaseCarousel<string>
      items={Allpics}
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      navigation={navigationValue}
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper"
    >
      {(pic, index) => (
        <img src={pic} alt={`Slide ${index + 1}`} className={carouselImage} />
      )}
    </BaseCarousel>
  );
};

export default MainHomeCarousel;
