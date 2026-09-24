// import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { MainLayout } from "@layout";
import { useEffect } from "react";
import { eventBus } from "./eventBus";
import { Logout } from "@auth/authSlice";
import { useAppDispatch } from "./hooks";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@profile/components/PaymentMethods/stripe";
import { ToastContainer } from "react-toastify";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    eventBus.onLogout(() => {
      dispatch(Logout());
      window.location.href = "/login";
    });
  }, []);

  return (
    <>
      <Elements stripe={stripePromise}>
        <MainLayout />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </Elements>
    </>
  );
}

export default App;
