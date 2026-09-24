import { useAppDispatch, useAppSelector } from "@app/hooks";
import Input from "@auth/Form/input/Input";
import {
  ResetPasswordSchema,
  type ResetPasswordType,
} from "@auth/validations/ResetPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ResetPasswordThunk, resetUI } from "@auth/authSlice";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../../auth.module.css";
const { ResetPasswordMessageStyle, errorStyle } = styles;
const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const dispatch = useAppDispatch();
  const { error, loading, ResetPasswordMessage } = useAppSelector(
    (state) => state.auth,
  );

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordType>({
    mode: "onBlur",
    resolver: zodResolver(ResetPasswordSchema),
  });

  const submitForm: SubmitHandler<ResetPasswordType> = async (data) => {
    if (!token) {
      console.error("Reset token is missing");
      return;
    }
    try {
      await dispatch(
        ResetPasswordThunk({ token, newPassword: data.newpassword }),
      ).unwrap();
      navigate("/login?message=password_reset_success", { replace: true });
    } catch (err) {
      console.error("Reset failed:", err);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(resetUI());
    };
  }, [dispatch]);

  if (!token) {
    return <Alert variant="danger">Invalid or missing reset token.</Alert>;
  }

  return (
    <div>
      <Row>
        <h1>Reset Password</h1>
        <Col md={{ span: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit(submitForm)}>
            <Input
              type="password"
              label="New password"
              name="newpassword"
              register={register}
              error={errors.newpassword?.message}
            />
            <Input
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              register={register}
              error={errors.confirmPassword?.message}
            />
            <Button
              variant="info"
              type="submit"
              className="mb-5"
              disabled={loading === "pending"}
            >
              {loading === "pending" ? (
                <>
                  <Spinner animation="border" size="sm"></Spinner>Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
            {ResetPasswordMessage && (
              <p className={ResetPasswordMessageStyle}>
                {ResetPasswordMessage}
              </p>
            )}

            {error && <p className={errorStyle}>{error}</p>}
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default ResetPassword;
