import { useEffect } from "react";
import styles from "../TermsOfService.module.css";
import BackToTop from "@shared/BackToTop/BackToTop";
const { container, title, section } = styles;

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className={container}>
      <h1 className={title}>Terms of Service</h1>

      <div className={section}>
        <p>
          Welcome to <strong>Cartify</strong>. By using this website, you agree
          to the following terms and conditions.
        </p>

        <h3>Website Usage</h3>
        <p>
          This website is a demo e-commerce application created for educational
          and portfolio purposes.
        </p>

        <h3>User Responsibilities</h3>
        <p>
          Users should provide accurate information when interacting with the
          application and use the website responsibly.
        </p>

        <h3>Intellectual Property</h3>
        <p>
          All content, designs, and code belong to the project creator unless
          otherwise stated.
        </p>

        <h3>Changes to These Terms</h3>
        <p>
          These terms may be updated at any time without prior notice to improve
          the project.
        </p>

        <h3>Contact</h3>
        <p>
          For any questions regarding these terms, please contact us through the
          Contact Us page.
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

export default TermsOfService;
