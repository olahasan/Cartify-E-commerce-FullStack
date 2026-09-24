import { Container } from "react-bootstrap";
import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom";
import styles from "./NotFoundPage.module.css";
import LottieHandler from "./LottieHandler/LottieHandler";

const { errorPage } = styles;
const NotFoundPage = () => {
  const error = useRouteError();
  console.error(error);
  let statusText: string;
  let message: string;

  if (isRouteErrorResponse(error)) {
    statusText = error.statusText;
    message = error.data.Error;
  } else {
    statusText = "Page Not Found";
    message = "No route matches URL";
  }
  return (
    <Container>
      <LottieHandler type="notFound" />
      <div className={errorPage}>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{statusText || message}</i>
        </p>
        <Link to="/" replace={true}>
          How about going back safety?
        </Link>
      </div>
    </Container>
  );
};

export default NotFoundPage;
