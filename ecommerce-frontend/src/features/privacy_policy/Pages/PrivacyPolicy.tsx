import { useEffect } from "react";
import styles from "../PrivacyPolicy.module.css";
import BackToTop from "@shared/BackToTop/BackToTop";
const { container, title, section } = styles;

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className={container}>
      <h1 className={title}>Privacy Policy</h1>

      <div className={section}>
        <p>
          At <strong>Cartify</strong>, your privacy matters to us. This Privacy
          Policy explains how we collect, use, and protect your information
          while using our website
        </p>

        <h3>Information We Collect</h3>
        <p>
          This demo project may collect basic information such as your name,
          email address, and account details for demonstration purposes only.
        </p>

        <h3>How We Use Your Information</h3>
        <p>
          Your information is used only to simulate account management,
          authentication, and shopping features within this project.
        </p>

        <h3>Data Security</h3>
        <p>
          We take reasonable measures to protect your information. However, this
          website is intended for educational and portfolio purposes only.
        </p>

        <h3>Contact</h3>
        <p>
          If you have any questions regarding this Privacy Policy, please
          contact us through the Contact Us page.
        </p>
        <p>
          Thank you for choosing <strong>Cartify</strong>. We appreciate your
          trust.
        </p>
        <small>Last Updated: July 2026</small>
      </div>
      <BackToTop />
    </div>
  );
};

export default PrivacyPolicy;
