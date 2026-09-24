import CartIcon from "@assets/svg/cart.svg?react";
import { useAppSelector } from "@app/hooks";
import { useEffect, useState } from "react";
import styles from "./cart.module.css";
import { useNavigate } from "react-router-dom";
import { selectCartQuantity } from "@cart/cartSlice";
import { Button, Modal } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";

const { iconContainer, basketQuantity, pumpCartQuantity } = styles;
const CartLogo = () => {
  const navigate = useNavigate();
  const [isAnimate, setIsAnimate] = useState(false);
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [showAuthChoice, setShowAuthChoice] = useState(false);
  const { LoginReturn } = useAppSelector((state) => state.auth);
  const token = LoginReturn?.token;
  const totalQuantity = useAppSelector(selectCartQuantity);
  const totalQuantity2 = useAppSelector(
    (state) => state.cart.summary.totalQuantity,
  );
  const quantityStyle = `${basketQuantity} ${
    isAnimate ? pumpCartQuantity : ""
  }`;
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

  const CartLogoHandler = () => {
    if (!token) {
      setShowLoginRequired(true);
    } else {
      navigate("/cart");
    }
  };

  return (
    <>
      {!token && (
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
                  <p>You need to login first to access this Feature</p>
                  <p className="text-muted">
                    "Login to save your items and track your orders!"
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
                    Login/Register
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
      )}
      <div className={iconContainer} onClick={CartLogoHandler}>
        <CartIcon />
        {token && totalQuantity2 > 0 && (
          <div className={quantityStyle}>{totalQuantity} </div>
        )}
      </div>
    </>
  );
};

export default CartLogo;
