import { Container } from "react-bootstrap";
import { Footer, Header } from "@layout";
import styles from "./MainLayout.module.css";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { persistor } from "@app/store/store";

const { container, mainContent } = styles;

const MainLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const handleAuthLogout = () => {
      persistor.purge();
      navigate("/login", { replace: true });
    };

    window.addEventListener("auth:logout", handleAuthLogout);

    return () => window.removeEventListener("auth:logout", handleAuthLogout);
  }, [navigate]);

  return (
    <Container className={container}>
      <Header />
      <main className={mainContent}>
        <Outlet />
      </main>
      <Footer />
    </Container>
  );
};

export default MainLayout;
