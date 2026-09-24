import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import {
  signUpSchema,
  type signUpType,
} from "@auth/validations/RegisterSchema";
import Input from "@auth/Form/input/Input";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { Register, resetUI } from "@auth/authSlice";
import { useEffect } from "react";
import styles from "../../auth.module.css";
const { paraStyle } = styles;

const RegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, LoginReturn } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<signUpType>({
    mode: "onBlur",
    resolver: zodResolver(signUpSchema),
  });

  const submitForm: SubmitHandler<signUpType> = async (data) => {
    const { firstName, lastName, email, password } = data;

    try {
      await dispatch(
        Register({ firstName, lastName, email, password }),
      ).unwrap();

      navigate("/login?message=account_created", {
        replace: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const emailOnBlurHandler = async () => {
    await trigger("email");
  };

  useEffect(() => {
    return () => {
      dispatch(resetUI());
    };
  }, [dispatch]);

  if (LoginReturn?.token) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit(submitForm)}>
            <Input
              label="First Name"
              name="firstName"
              register={register}
              error={errors.firstName?.message}
            />

            <Input
              label="Last Name"
              name="lastName"
              register={register}
              error={errors.lastName?.message}
            />

            <Input
              label="Email Address"
              name="email"
              register={register}
              onBlur={emailOnBlurHandler}
              error={errors.email?.message}
            />

            <Input
              type="password"
              label="Password"
              name="password"
              register={register}
              error={errors.password?.message}
            />

            <Input
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              register={register}
              error={errors.confirmPassword?.message}
            />
            <p>
              Already have an account? <NavLink to={"/login"}>Login</NavLink>
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
            {error && <p className={paraStyle}>{error}</p>}
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterForm;
