import LinkedinIcon from "@assets/svg/linkedin.svg?react";

import styles from "./Footer.module.css";
const { linkedin } = styles;
const LinkedinLogo = () => {
  return (
    <div className={`${linkedin} rounded-circle p-2`}>
      <LinkedinIcon />
    </div>
  );
};

export default LinkedinLogo;
