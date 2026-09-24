import WishlistIcon from "@assets/svg/wishlist.svg?react";

import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

import styles from "./Wishlist.module.css";
import { Button, Modal } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@app/hooks";
const { iconContainer, basketQuantity, pumpCartQuantity } = styles;

type WishlistLogoProps = {
  totalQuantity: number;
};
const WishlistLogo = ({ totalQuantity }: WishlistLogoProps) => {
  const navigate = useNavigate();
  const [isAnimate, setIsAnimate] = useState(false);
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [showAuthChoice, setShowAuthChoice] = useState(false);

  const { LoginReturn } = useAppSelector((state) => state.auth);
  const token = LoginReturn?.token;

  const quantityStyle = `${basketQuantity} ${
    isAnimate ? pumpCartQuantity : ""
  }`;

  const handleGetWishlistItems = useCallback(() => {
    if (!token) {
      setShowLoginRequired(true);
    } else {
      navigate("/wishlist");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!totalQuantity) {
      return;
    }
    setIsAnimate(true);

    const debounce = setTimeout(() => {
      setIsAnimate(false);
    }, 300);

    return () => clearTimeout(debounce);
  }, [totalQuantity]);

  return (
    <>
      <AnimatePresence>
        {showLoginRequired && (
          <motion.div
            key="loginRequired"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
          >
            <Modal
              show={showLoginRequired}
              onHide={() => setShowLoginRequired(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Login Required</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <p>You need to log in first to access this feature</p>
                <p className="text-muted">
                  Log in to save your items and track your orders!
                </p>
              </Modal.Body>

              <Modal.Footer>
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowLoginRequired(false);
                    setShowAuthChoice(true);
                  }}
                >
                  Log in/Register
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowLoginRequired(false)}
                >
                  Maybe Later
                </Button>
              </Modal.Footer>
            </Modal>
          </motion.div>
        )}

        {showAuthChoice && (
          <motion.div
            key="authChoice"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
          >
            <Modal
              show={showAuthChoice}
              onHide={() => setShowAuthChoice(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Continue</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Do you already have an account?</p>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowAuthChoice(false);
                    navigate("/login");
                  }}
                >
                  Yes, Login
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    setShowAuthChoice(false);
                    navigate("/register");
                  }}
                >
                  No, Create Account
                </Button>
              </Modal.Footer>
            </Modal>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={iconContainer} onClick={handleGetWishlistItems}>
        <WishlistIcon />
        {token && totalQuantity > 0 && (
          <div className={quantityStyle}>{totalQuantity}</div>
        )}
      </div>
    </>
  );
};

export default WishlistLogo;
