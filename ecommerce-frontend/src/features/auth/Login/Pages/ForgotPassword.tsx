import { useAppDispatch, useAppSelector } from "@app/hooks";
import Input from "@auth/Form/input/Input";
import {
  ForgotPasswordSchema,
  type ForgotPasswordType,
} from "@auth/validations/ForgotPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ForgotPasswordThunk, resetUI } from "@auth/authSlice";
import { useEffect } from "react";
import styles from "../../auth.module.css";
import { useNavigate } from "react-router-dom";
const { ForgotPasswordMessageStyle, errorStyle } = styles;

const ForgotPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, loading, ForgotPasswordMessage, ResetLink } = useAppSelector(
    (state) => state.auth,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordType>({
    mode: "onBlur",
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const submitForm: SubmitHandler<ForgotPasswordType> = (data) => {
    dispatch(ForgotPasswordThunk(data.email));
  };

  useEffect(() => {
    return () => {
      dispatch(resetUI());
    };
  }, [dispatch]);

  return (
    <div>
      <Row>
        <h1>Forgot Password</h1>
        <Col md={{ span: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit(submitForm)}>
            <Input
              label="Email Address"
              name="email"
              register={register}
              error={errors.email?.message}
            />
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
                "Send Reset Link"
              )}
            </Button>
            {ForgotPasswordMessage && (
              <p className={ForgotPasswordMessageStyle}>
                {ForgotPasswordMessage}
              </p>
            )}
            {ResetLink && (
              <Button
                variant="outline-success"
                className="mt-3"
                onClick={() => {
                  const url = new URL(ResetLink);
                  navigate(url.pathname + url.search);
                }}
              >
                Didn't receive the reset email? Continue here
              </Button>
            )}
            {error && <p className={errorStyle}>{error}</p>}
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default ForgotPassword;
