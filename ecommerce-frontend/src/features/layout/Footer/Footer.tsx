import FacebookLogo from "./FacebookLogo";
import TwitterLogo from "./TwitterLogo";
import LinkedinLogo from "./LinkedinLogo";
import YoutubeLogo from "./YoutubeLogo";
import { Link, NavLink } from "react-router-dom";

import styles from "./Footer.module.css";
import { useAppSelector } from "@app/hooks";
const {
  footerContainer,
  footer,
  logo,
  links,
  icons,
  copyright,
  contact,
  mainBtn,
} = styles;

const Footer = () => {
  const { LoginReturn } = useAppSelector((state) => state.auth);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <footer className={footerContainer}>
      <div
        className={`${footer} pt-5 pb-5 text-white-50 text-center text-md-start`}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-lg-4">
              <div className="info mb-5">
                <h1>
                  <Link
                    to="/"
                    className={`${logo} mb-4 text-light `}
                    role="button"
                    tabIndex={0}
                    onClick={scrollToTop}
                  >
                    CARTIFY
                  </Link>
                </h1>
                <p className="text-white-50 mb-5">
                  Discover quality products, exclusive deals, and a smooth
                  shopping experience. Cartify makes online shopping simple,
                  secure, and enjoyable from start to finish.
                </p>
                <div className={copyright}>
                  Created with ❤️ by
                  <a
                    href="https://github.com/olahasan"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span> Ola Ali</span>
                  </a>
                  <div>
                    &copy; 2026
                    <Link to="/" onClick={scrollToTop}>
                      <span> Cartify</span>
                    </Link>
                    . All rights reserved.
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-2 mb-sm-5">
              <div className={links}>
                <h5 className="text-light">Links</h5>
                <ul className="list-unstyled lh-lg ">
                  <li>
                    <NavLink to="/" onClick={scrollToTop}>
                      Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/categories" onClick={scrollToTop}>
                      Categories
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/wishlist" onClick={scrollToTop}>
                      Wishlist
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/cart" onClick={scrollToTop}>
                      Cart
                    </NavLink>
                  </li>
                  {LoginReturn?.token && (
                    <li>
                      <NavLink to="/profile/settings" onClick={scrollToTop}>
                        Settings
                      </NavLink>
                    </li>
                  )}
                  <li>
                    <NavLink to="/contact-us" onClick={scrollToTop}>
                      FAQ
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-6 col-lg-2 mb-sm-5">
              <div className={links}>
                <h5 className="text-light">Account</h5>
                <ul className="list-unstyled lh-lg ">
                  {!LoginReturn?.token && (
                    <>
                      <li>
                        <NavLink to="/login" onClick={scrollToTop}>
                          Sign In
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/register" onClick={scrollToTop}>
                          Register
                        </NavLink>
                      </li>
                    </>
                  )}
                  {LoginReturn?.token && (
                    <>
                      <li>
                        <NavLink to="/profile" onClick={scrollToTop}>
                          My Profile
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/profile/orders" onClick={scrollToTop}>
                          My Orders
                        </NavLink>
                      </li>
                    </>
                  )}
                  <li>
                    <NavLink to="/about-us" onClick={scrollToTop}>
                      About Us
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/blog" onClick={scrollToTop}>
                      Blog
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/contact-us" onClick={scrollToTop}>
                      Contact Us
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/privacy-policy" onClick={scrollToTop}>
                      Privacy Policy
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/terms-of-service" onClick={scrollToTop}>
                      Terms of Service
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className={contact}>
                <h5 className="text-light">Contact Us</h5>
                <p className="lh-lg mt-3 mb-5">
                  Get in touch with us via email or social media. We're always
                  happy to help.
                </p>
                <a
                  href="mailto:Cartify@gmail.com"
                  className={`btn rounded-pill ${mainBtn} w-100`}
                >
                  Cartify@gmail.com
                </a>
                <div className={icons}>
                  <ul className="d-flex mt-0 mt-md-5 list-unstyled gap-3 justify-content-center">
                    <li>
                      <a
                        className="d-block text-light pointer"
                        onClick={(e) => e.preventDefault()}
                      >
                        <FacebookLogo />
                      </a>
                    </li>
                    <li>
                      <a
                        className="d-block text-light pointer"
                        onClick={(e) => e.preventDefault()}
                      >
                        <TwitterLogo />
                      </a>
                    </li>
                    <li>
                      <a
                        className="d-block text-light pointer"
                        onClick={(e) => e.preventDefault()}
                      >
                        <LinkedinLogo />
                      </a>
                    </li>
                    <li>
                      <a
                        className="d-block text-light pointer"
                        onClick={(e) => e.preventDefault()}
                      >
                        <YoutubeLogo />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
