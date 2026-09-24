import FAQSection from "@contact_us/Components/FAQSection";
import FormSection from "@contact_us/Components/FormSection";
import { useEffect } from "react";

const Contact_Us = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <FormSection />
      <FAQSection />
    </>
  );
};

export default Contact_Us;
