import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@app/hooks";
import { Login, resetUI } from "@auth/authSlice";
import Input from "@auth/Form/input/Input";
import { signInSchema, type signInType } from "@auth/validations/LoginSchema";
import { GetCartItemsByUserID, GetCartSummary } from "@cart/cartSlice";
import { GetWishlistByUserID, GetwishlistCount } from "@wishlist/wishlistSlice";
import { useRef } from "react";

import styles from "../../auth.module.css";
import { toast } from "react-toastify";
const { ForgetPasswordStyle, errorStyle } = styles;
const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error, loading } = useAppSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const message = searchParams.get("message");
  const toastShown = useRef(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signInType>({
    mode: "onBlur",
    resolver: zodResolver(signInSchema),
  });

  const submitForm: SubmitHandler<signInType> = async (data) => {
    if (searchParams.get("message")) {
      setSearchParams("");
    }
    try {
      const res = await dispatch(Login(data)).unwrap();
      if (res.success === true) {
        // Wait briefly for persisted auth state before fetching protected resources.
        await new Promise((resolve) => setTimeout(resolve, 250));

        await dispatch(GetCartItemsByUserID());
        await dispatch(GetCartSummary());

        await dispatch(GetWishlistByUserID());
        await dispatch(GetwishlistCount());

        navigate("/", { replace: true });
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(resetUI());
    };
  }, [dispatch]);

  useEffect(() => {
    if (message === "password_reset_success" && !toastShown.current) {
      toast.success("Password has been reset successfully. Please sign in.");

      toastShown.current = true;

      setSearchParams({});
    }
  }, [message, setSearchParams]);

  return (
    <div>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          {message === "login_required" && (
            <Alert variant="success">
              please login, to access this content
            </Alert>
          )}
          {message === "account_created" && (
            <Alert variant="success">
              Your account successfully created, please login
            </Alert>
          )}
          <Form onSubmit={handleSubmit(submitForm)}>
            <Input
              label="Email Address"
              name="email"
              register={register}
              error={errors.email?.message}
            />

            <Input
              type="password"
              label="Password"
              name="password"
              register={register}
              error={errors.password?.message}
            />
            <p>
              Don't have an account? <NavLink to={"/register"}>Sign Up</NavLink>
              <NavLink
                to={"/forgot-password"}
                style={{ textDecoration: "none" }}
              >
                <small className={ForgetPasswordStyle}>Forget Password</small>
              </NavLink>
            </p>
            <Button
              variant="info"
              type="submit"
              className="mb-5"
              disabled={loading === "pending"}
            >
              {loading === "pending" ? (
                <>
                  <Spinner animation="border" size="sm"></Spinner>
                  loading...
                </>
              ) : (
                "Submit"
              )}
            </Button>

            {error && <p className={errorStyle}>{error}</p>}
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default LoginForm;
