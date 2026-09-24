import axiosInstance from "@config/api/axios";

export type TRegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type TRegisterReturn = {
  NewUserID: number;
  Success: boolean;
  Message: string;
};

export const RegisterAPI = async (data: TRegisterData) => {
  const response = await axiosInstance.post<TRegisterReturn>(`/Register`, {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
  });
  return response.data;
};

export type TLoginData = {
  email: string;
  password: string;
};

export type TLoginReturn = {
  userID?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  isEmailVerified?: boolean;
  token?: string;
  success: boolean;
  message: string;
};

export const LoginAPI = async (data: TLoginData) => {
  const response = await axiosInstance.post<TLoginReturn>(`/Login`, {
    email: data.email,
    password: data.password,
  });
  return response.data;
};

export type TForgotPasswordReturn = {
  success: boolean;
  message: string;
  resetLink: string | null;
};

export const ForgotPasswordApi = async (email: string) => {
  const response = await axiosInstance.post<TForgotPasswordReturn>(
    `/ForgotPassword`,
    { email },
  );
  return response.data;
};

export type TResetPasswordReturn = {
  success: boolean;
  message: string;
};

export type TResetPasswordData = {
  token: string;
  newPassword: string;
};

export const ResetPasswordApi = async (data: TResetPasswordData) => {
  const response = await axiosInstance.post<TResetPasswordReturn>(
    `/ResetPassword`,
    data,
  );
  return response.data;
};
