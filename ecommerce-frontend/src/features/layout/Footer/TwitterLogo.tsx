import TwitterIcon from "@assets/svg/twitter.svg?react";

import styles from "./Footer.module.css";
const { twitter } = styles;
const TwitterLogo = () => {
  return (
    <div className={`${twitter} rounded-circle p-2`}>
      <TwitterIcon />
    </div>
  );
};

export default TwitterLogo;
