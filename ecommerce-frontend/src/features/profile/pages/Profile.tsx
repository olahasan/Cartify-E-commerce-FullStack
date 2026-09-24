import { Link, Outlet } from "react-router-dom";
import styles from "../Profile.module.css";
import "../../../FrameWork.css";
import { useAppSelector } from "@app/hooks";
import {
  CreditCard,
  LayoutDashboard,
  MapPin,
  Package,
  Settings,
  User,
} from "lucide-react";
import BackToTop from "@shared/BackToTop/BackToTop";

const { sidebar, page, content, none } = styles;

const Profile = () => {
  const { LoginReturn } = useAppSelector((state) => state.auth);
  const { userPersonalInfo } = useAppSelector((state) => state.profile);
  const firstName = userPersonalInfo?.firstName || LoginReturn?.firstName || "";

  const handleNavigate = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={`${page} d-flex`}>
      <div className={`${sidebar} bg-white p-20 p-relative`}>
        <h3 className="p-relative txt-c mt-0">
          {LoginReturn?.token ? firstName : " "}
        </h3>
        <ul>
          <li>
            <Link
              className="d-flex align-center fs-14 c-black rad-6 p-10"
              to="dashboard"
              onClick={handleNavigate}
            >
              <LayoutDashboard size={20} className="opacity-80" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              className="d-flex align-center fs-14 c-black rad-6 p-10"
              to="PersonalInfo"
              onClick={handleNavigate}
            >
              <User size={20} className="opacity-80" />
              <span>Personal Info</span>
            </Link>
          </li>
          <li>
            <Link
              className="d-flex align-center fs-14 c-black rad-6 p-10"
              to="Addresses"
              onClick={handleNavigate}
            >
              <MapPin size={20} className="opacity-80" />
              <span>Addresses</span>
            </Link>
          </li>
          <li>
            <Link
              className="d-flex align-center fs-14 c-black rad-6 p-10"
              to="PaymentMethods"
              onClick={handleNavigate}
            >
              <CreditCard size={20} className="opacity-80" />
              <span>Payment Methods</span>
            </Link>
          </li>
          <li>
            <Link
              className="d-flex align-center fs-14 c-black rad-6 p-10"
              to="Orders"
              onClick={handleNavigate}
            >
              <Package size={20} className="opacity-80" />
              <span>Orders</span>
            </Link>
          </li>
          <li>
            <Link
              className="d-flex align-center fs-14 c-black rad-6 p-10"
              to="settings"
              onClick={handleNavigate}
            >
              <Settings size={20} className="opacity-80" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className={`${content} w-full`}>
        <div className={none}>
          <div className="head bg-white p-15 between-flex">
            <div className="search p-relative">
              <input
                className="p-10"
                type="search"
                placeholder="Type A Keyword"
              />
            </div>
            <div className="icons d-flex align-center">
              <span className="notification p-relative">
                <i className="fa-regular fa-bell fa-lg"></i>
              </span>
              <img src="imgs/ola.png" alt="pic" />
            </div>
          </div>
        </div>
        <Outlet />
      </div>
      <BackToTop />
    </div>
  );
};

export default Profile;
