import AboutHero from "@about_us/Components/AboutHero";
import ReadySection from "@about_us/Components/ReadySection";
import SocialProof from "@about_us/Components/SocialProof";
import StatsSection from "@about_us/Components/StatsSection";
import { useEffect } from "react";

const About_Us = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <AboutHero />
      <StatsSection />
      <SocialProof />
      <ReadySection />
    </>
  );
};

export default About_Us;
