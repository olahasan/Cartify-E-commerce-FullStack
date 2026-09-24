import HeroCarousel from "../components/HeroCarousel";
import AdvertisementBanner from "../components/AdvertisementBanner";
import HomeCategoriesCarousel from "@swiper/carousels/HomeCategoriesCarousel";
import HomeMainSection from "../components/HomeMainSection";
import TopRatedCarousel from "@products/components/TopRatedCarousel";
import CategorySection from "../components/CategorySection";

import homeAdd from "@assets/Advertisements/HomeAdvertisement/HomeAdvertisement.jpg";
import adsImage from "@assets/Advertisements/HomeAdvertisement/Add.jpg";
import Sports from "@assets/Advertisements/HomeAdvertisement/Sports.jpg";

import slide1 from "@assets/imgs/MainHomeCarousel/breeze.jpg";
import slide2 from "@assets/imgs/MainHomeCarousel/genZ.jpg";
import slide3 from "@assets/imgs/MainHomeCarousel/goldCoffee.jpg";
import slide4 from "@assets/imgs/MainHomeCarousel/phone.jpg";
import slide5 from "@assets/imgs/MainHomeCarousel/selfCare.jpg";
import slide6 from "@assets/imgs/MainHomeCarousel/tvAccessories.jpg";
import slide7 from "@assets/imgs/MainHomeCarousel/vitamins.jpg";

import Furniture1 from "@assets/imgs/MainHomeCarousel/Furniture1.jpg";
import Furniture2 from "@assets/imgs/MainHomeCarousel/Furniture2.jpg";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { Fragment, useEffect } from "react";
import { getHomePageSections } from "@products/productSlice";
import HomeSkeleton from "@home/Skeleton/HomeSkeleton";
import LottieHandler from "@shared/LottieHandler/LottieHandler";
import BackToTop from "@shared/BackToTop/BackToTop";

const pics = [slide1, slide2, slide3, slide4, slide5, slide6, slide7];
const furnitureSlides = [Furniture1, Furniture2];

const Home = () => {
  const { homePageSections, homePageSectionsLoading, homePageSectionsError } =
    useAppSelector((state) => state.product);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getHomePageSections());
  }, [dispatch]);

  if (homePageSectionsLoading) {
    return <HomeSkeleton />;
  }

  if (homePageSectionsError) {
    return (
      <LottieHandler
        type="error"
        message={`Error loading home sections: ${homePageSectionsError}`}
      />
    );
  }
  return (
    <div>
      <HeroCarousel pics={pics} navigationValue={true} />
      <AdvertisementBanner pic={homeAdd} />
      <HomeCategoriesCarousel />
      <HomeMainSection />
      <TopRatedCarousel />
      {homePageSections.map((section) => {
        return (
          <Fragment key={section.sectionSlug}>
            <CategorySection
              sectionName={section.sectionName}
              sectionSlug={section.sectionSlug}
              link={`/categories/${encodeURIComponent(
                section.hierarchy,
              )}?type=SHOP_ALL`}
            />
            {section.sectionName === "Beauty" && (
              <AdvertisementBanner pic={Sports} />
            )}
            {section.sectionName === "Sports" && (
              <HeroCarousel pics={furnitureSlides} navigationValue={false} />
            )}
            {section.sectionName === "Furniture" && (
              <AdvertisementBanner pic={adsImage} />
            )}
          </Fragment>
        );
      })}
      <BackToTop />
    </div>
  );
};

export default Home;
