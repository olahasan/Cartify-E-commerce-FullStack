import YoutubeIcon from "@assets/svg/youtube.svg?react";

import styles from "./Footer.module.css";
const { youtube } = styles;
const YoutubeLogo = () => {
  return (
    <div className={`${youtube} rounded-circle p-2`}>
      <YoutubeIcon />
    </div>
  );
};

export default YoutubeLogo;
