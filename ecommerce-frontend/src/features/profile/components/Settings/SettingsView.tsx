import Input from "@auth/Form/input/Input";
import styles from "../../Profile.module.css";
import {
  ChangePasswordSchema,
  type ChangePasswordFormDataType,
} from "@profile/validations/ChangePasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Form } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import {
  UpdateUserPasswordThunk,
  resetPasswordChanged,
} from "@profile/ProfileSlice";

import { Logout } from "@auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LottieHandler from "@shared/LottieHandler/LottieHandler";
import BackToTop from "@shared/BackToTop/BackToTop";

const { mainAddrBox } = styles;

const SettingsView = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, passwordChanged } = useAppSelector((state) => state.profile);
  const isLoading = loading === "pending";

  // React Hook Form + Zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormDataType>({
    mode: "onBlur",
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmit: SubmitHandler<ChangePasswordFormDataType> = async (
    data: ChangePasswordFormDataType,
  ) => {
    try {
      await dispatch(
        UpdateUserPasswordThunk({
          currentPassword: data.currentpassword,
          newPassword: data.newpassword,
        }),
      ).unwrap();

      reset();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    if (passwordChanged) {
      dispatch(resetPasswordChanged());
      dispatch(Logout());
      navigate("/login");
    }
  }, [passwordChanged, dispatch, navigate]);

  if (loading === "pending") return <LottieHandler type="loading" />;

  return (
    <>
      <div className={`card shadow-sm p-4 mb-4 ${mainAddrBox}`}>
        <h2 className="h3 fw-bold text-dartk mb-4">Settings</h2>

        <div className="row g-4">
          <div className="d-flex flex-column gap-4">
            <div className="pb-4 border-bottom">
              <Form onSubmit={handleSubmit(onSubmit)}>
                <h3 className="h5 fw-semibold text-dark mb-3">
                  Change Password
                </h3>

                <div className="d-flex flex-column">
                  <Input<ChangePasswordFormDataType>
                    className="form-control"
                    name="currentpassword"
                    placeholder="Current Password"
                    register={register}
                    error={errors.currentpassword?.message}
                  />

                  <Input<ChangePasswordFormDataType>
                    className="form-control"
                    name="newpassword"
                    placeholder="New Password"
                    register={register}
                    error={errors.newpassword?.message}
                  />
                  <Input<ChangePasswordFormDataType>
                    className="form-control"
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    register={register}
                    error={errors.confirmPassword?.message}
                  />

                  <button
                    className="btn btn-primary align-self-start"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </Form>
            </div>

            <div>
              <h3 className="h5 fw-semibold text-dark mb-3">Notifications</h3>

              <div className="d-flex flex-column gap-2">
                <label className="form-check d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    defaultChecked
                  />
                  <span>Email Notifications</span>
                </label>
                <label className="form-check d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    defaultChecked
                  />
                  <span>Order Notifications</span>
                </label>
                <label className="form-check d-flex align-items-center gap-2">
                  <input type="checkbox" className="form-check-input" />
                  <span>Promotional Notifications</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BackToTop />
    </>
  );
};

export default SettingsView;
