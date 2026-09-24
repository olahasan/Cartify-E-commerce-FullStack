import { useAppSelector } from "@app/hooks";
import LottieHandler from "@shared/LottieHandler/LottieHandler";
import { useEffect, useState } from "react";
// import { Navigate, useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { LoginReturn } = useAppSelector((state) => state.auth);
  // const location = useLocation();
  const [isReady, setIsReady] = useState(false);

  // Wait for Redux Persist to rehydrate the store
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 300); //wait 300ms for rehydration

    return () => clearTimeout(timer);
  }, []);

  //show loading while waiting for rehydration
  if (!isReady) {
    return <LottieHandler type="loading" />;
  }
  if (LoginReturn === undefined) {
    return null;
  }

  // Redirect to login when no valid JWT token is available
  if (!LoginReturn?.token) {
    return <Navigate to="/login?message=login_required" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
