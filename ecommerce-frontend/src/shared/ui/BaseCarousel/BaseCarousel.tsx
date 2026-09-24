import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  A11y,
  Autoplay,
  EffectFade,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { SwiperModule } from "swiper/types";

interface IBaseCarouselProps<T> {
  items: T[];
  slidesPerView?: number | "auto";
  spaceBetween?: number;
  navigation?: boolean;
  pagination?: false | { clickable?: boolean; [key: string]: unknown };
  breakpoints?: object;
  effect?: "slide" | "fade";
  fadeEffect?: { crossFade?: boolean };
  loop?: boolean;
  autoplay?: boolean | object;
  centeredSlides?: boolean;
  className?: string;
  children: (item: T, index: number) => React.ReactNode;
}

export function BaseCarousel<T>({
  items,
  slidesPerView = 1,
  spaceBetween = 0,
  navigation = false,
  pagination = false,
  breakpoints,
  effect = "slide",
  fadeEffect,
  loop = false,
  autoplay = false,
  centeredSlides = false,
  className = "",
  children,
  modules = [Navigation, Pagination, A11y, EffectFade, Autoplay],
  ...rest
}: IBaseCarouselProps<T> & { modules?: SwiperModule[] }) {
  return (
    <Swiper
      slidesPerView={slidesPerView}
      spaceBetween={spaceBetween}
      navigation={navigation}
      pagination={pagination || false}
      modules={modules}
      breakpoints={breakpoints}
      effect={effect}
      fadeEffect={fadeEffect}
      loop={loop}
      autoplay={autoplay || false}
      centeredSlides={centeredSlides}
      className={className}
      {...rest}
    >
      {items.map((item, index) => (
        <SwiperSlide key={index}>{children(item, index)}</SwiperSlide>
      ))}
    </Swiper>
  );
}
