import FacebookIcon from "@assets/svg/facebook.svg?react";

import styles from "./Footer.module.css";
const { facebook } = styles;
const FacebookLogo = () => {
  return (
    <div className={`${facebook} rounded-circle p-2`}>
      <FacebookIcon />
    </div>
  );
};

export default FacebookLogo;
