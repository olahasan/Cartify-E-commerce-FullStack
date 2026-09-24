import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "@home/pages/Home";
import Categories from "@categories/Categories.tsx";
import About_Us from "@about_us/Pages/About_Us";
import App from "@app/App";
import Login from "@auth/Login/Pages/LoginPage";
import Register from "@auth/Register/Pages/RegisterPage";
import Blog from "@blog/Blog";
import Contact_Us from "@contact_us/Pages/Contact_Us";
import NotFoundPage from "@shared/NotFoundPage";
import ProductDetails from "@products/pages/ProductDetails";
import Cart from "@cart/Pages/Cart";
import Checkout from "src/features/checkout/Pages/Checkout";
import Wishlist from "@wishlist/Pages/Wishlist";
import Profile from "src/features/profile/pages/Profile";
import ProtectedRoute from "@app/protectedRoute/ProtectedRoute";
import AuthChoice from "@auth/AuthChoice/AuthChoice";
import Dashboard from "@profile/components/Dashboard/Dashboard";
import Settings from "@profile/components/Settings/Settings";
import PersonalInfo from "@profile/components/PersonalInfo/PersonalInfo";
import Addresses from "@profile/components/Addresses/Addresses";
import PaymentMethods from "@profile/components/PaymentMethods/PaymentMethods";
import Orders from "@profile/components/Orders/Orders";
import ForgotPassword from "@auth/Login/Pages/ForgotPassword";
import ResetPassword from "@auth/Login/Pages/ResetPassword";
import OrderSuccess from "@checkout/Pages/OrderSuccess";
import Search from "@search/pages/Search";
import PrivacyPolicy from "@privacy-policy/Pages/PrivacyPolicy";
import TermsOfService from "@terms-of-service/Pages/TermsOfService";
// import cart

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      { path: "/categories", element: <Categories /> },
      { path: "/categories/*", element: <Categories /> },
      {
        path: "products/:id",
        element: <ProductDetails />,
      },
      {
        path: "/cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <Checkout />,
          </ProtectedRoute>
        ),
      },
      {
        path: "/order-success",
        element: <OrderSuccess />,
      },
      {
        path: "/wishlist",
        element: (
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        ),
      },
      {
        path: "about-us",
        element: <About_Us />,
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "auth-choice",
        element: <AuthChoice />,
      },

      {
        path: "blog",
        element: <Blog />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Dashboard /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "PersonalInfo", element: <PersonalInfo /> },
          { path: "Addresses", element: <Addresses /> },
          { path: "PaymentMethods", element: <PaymentMethods /> },
          { path: "Orders", element: <Orders /> },
          { path: "settings", element: <Settings /> },
        ],
      },
      {
        path: "contact-us",
        element: <Contact_Us />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "terms-of-service",
        element: <TermsOfService />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
