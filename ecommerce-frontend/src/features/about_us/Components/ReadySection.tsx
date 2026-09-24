import { Link } from "react-router-dom";
import styles from "../ReadySection.module.css";
const { title, ready } = styles;
const ReadySection = () => {
  return (
    <div className={ready}>
      <div className={title}> Ready to Start Shopping?</div>
      <Link
        to="/categories"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <button>Explore Products</button>
      </Link>
    </div>
  );
};

export default ReadySection;
