import { Container } from "react-bootstrap";
import styles from "../home.module.css";
// const { title3, right } = styles;
const { title3 } = styles;

const HomeMainSection = () => {
  return (
    <Container>
      <div>
        <div>
          <div>
            <h3 className={title3}>
              recommended <span>For You</span>
            </h3>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HomeMainSection;
