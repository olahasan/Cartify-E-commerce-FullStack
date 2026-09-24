import { describe, it, expect, beforeEach, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";

import authReducer, {
  Register,
  Login,
  ForgotPasswordThunk,
  ResetPasswordThunk,
  resetUI,
  Logout,
  updateCurrentUser,
} from "./authSlice";

import * as AuthAPI from "./authAPI";

vi.mock("./authAPI", async () => {
  const actual = await vi.importActual<typeof import("./authAPI")>("./authAPI");

  return {
    ...actual,
    RegisterAPI: vi.fn(),
    LoginAPI: vi.fn(),
    ForgotPasswordApi: vi.fn(),
    ResetPasswordApi: vi.fn(),
  };
});

const createTestStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
  });

describe("Auth Async Thunks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Register", () => {
    it("should register a user successfully", async () => {
      const registerData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "Password123!",
      };

      const mockResponse = {
        NewUserID: 10,
        Success: true,
        Message: "User registered successfully",
      };

      vi.mocked(AuthAPI.RegisterAPI).mockResolvedValue(mockResponse);

      const store = createTestStore();

      const result = await store.dispatch(Register(registerData));

      expect(result.type).toBe("auth/Register/fulfilled");

      expect(AuthAPI.RegisterAPI).toHaveBeenCalledTimes(1);

      expect(AuthAPI.RegisterAPI).toHaveBeenCalledWith(registerData);

      expect(store.getState().auth.loading).toBe("succeeded");

      expect(store.getState().auth.RegisterReturn).toEqual(mockResponse);

      expect(store.getState().auth.error).toBeNull();
    });

    it("should fail when registering a user fails", async () => {
      vi.mocked(AuthAPI.RegisterAPI).mockRejectedValue(
        new Error("Failed to register user"),
      );

      const store = createTestStore();

      const result = await store.dispatch(
        Register({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          password: "Password123!",
        }),
      );

      expect(result.type).toBe("auth/Register/rejected");

      expect(AuthAPI.RegisterAPI).toHaveBeenCalledTimes(1);

      expect(store.getState().auth.loading).toBe("failed");

      expect(store.getState().auth.error).toBe("An unexpected error");
    });
  });

  describe("Login", () => {
    it("should login a user successfully", async () => {
      const loginData = {
        email: "john@example.com",
        password: "Password123!",
      };

      const mockResponse = {
        userID: 10,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: "User",
        isEmailVerified: true,
        token: "test-token",
        success: true,
        message: "Login successful",
      };

      vi.mocked(AuthAPI.LoginAPI).mockResolvedValue(mockResponse);

      const store = createTestStore();

      const result = await store.dispatch(Login(loginData));

      expect(result.type).toBe("auth/Login/fulfilled");

      expect(AuthAPI.LoginAPI).toHaveBeenCalledTimes(1);

      expect(AuthAPI.LoginAPI).toHaveBeenCalledWith(loginData);

      expect(store.getState().auth.loading).toBe("succeeded");

      expect(store.getState().auth.LoginReturn).toEqual(mockResponse);

      expect(store.getState().auth.error).toBeNull();
    });

    it("should fail when login fails", async () => {
      vi.mocked(AuthAPI.LoginAPI).mockRejectedValue(
        new Error("Failed to login"),
      );

      const store = createTestStore();

      const result = await store.dispatch(
        Login({
          email: "john@example.com",
          password: "Password123!",
        }),
      );

      expect(result.type).toBe("auth/Login/rejected");

      expect(AuthAPI.LoginAPI).toHaveBeenCalledTimes(1);

      expect(store.getState().auth.loading).toBe("failed");

      expect(store.getState().auth.error).toBe("An unexpected error");
    });
  });

  describe("ForgotPasswordThunk", () => {
    it("should send forgot password request successfully", async () => {
      const email = "john@example.com";

      const mockResponse = {
        success: true,
        message: "Password reset email sent",
        resetLink: "https://example.com/reset/test-token",
      };

      vi.mocked(AuthAPI.ForgotPasswordApi).mockResolvedValue(mockResponse);

      const store = createTestStore();

      const result = await store.dispatch(ForgotPasswordThunk(email));

      expect(result.type).toBe("auth/ForgotPasswordThunk/fulfilled");

      expect(AuthAPI.ForgotPasswordApi).toHaveBeenCalledTimes(1);

      expect(AuthAPI.ForgotPasswordApi).toHaveBeenCalledWith(email);

      expect(store.getState().auth.loading).toBe("succeeded");

      expect(store.getState().auth.ForgotPasswordMessage).toBe(
        "Password reset email sent",
      );

      expect(store.getState().auth.ResetLink).toBe(
        "https://example.com/reset/test-token",
      );

      expect(store.getState().auth.error).toBeNull();
    });

    it("should fail when forgot password request fails", async () => {
      vi.mocked(AuthAPI.ForgotPasswordApi).mockRejectedValue(
        new Error("Failed to send reset email"),
      );

      const store = createTestStore();

      const result = await store.dispatch(
        ForgotPasswordThunk("john@example.com"),
      );

      expect(result.type).toBe("auth/ForgotPasswordThunk/rejected");

      expect(AuthAPI.ForgotPasswordApi).toHaveBeenCalledTimes(1);

      expect(AuthAPI.ForgotPasswordApi).toHaveBeenCalledWith(
        "john@example.com",
      );

      expect(store.getState().auth.loading).toBe("failed");

      expect(store.getState().auth.error).toBe("An unexpected error");
    });
  });

  describe("ResetPasswordThunk", () => {
    it("should reset password successfully", async () => {
      const resetData = {
        token: "test-token",
        newPassword: "NewPassword123!",
      };

      const mockResponse = {
        success: true,
        message: "Password reset successfully",
      };

      vi.mocked(AuthAPI.ResetPasswordApi).mockResolvedValue(mockResponse);

      const store = createTestStore();

      const result = await store.dispatch(ResetPasswordThunk(resetData));

      expect(result.type).toBe("auth/ResetPasswordThunk/fulfilled");

      expect(AuthAPI.ResetPasswordApi).toHaveBeenCalledTimes(1);

      expect(AuthAPI.ResetPasswordApi).toHaveBeenCalledWith(resetData);

      expect(store.getState().auth.loading).toBe("succeeded");

      expect(store.getState().auth.ResetPasswordMessage).toBe(
        "Password reset successfully",
      );

      expect(store.getState().auth.error).toBeNull();
    });

    it("should fail when reset password fails", async () => {
      vi.mocked(AuthAPI.ResetPasswordApi).mockRejectedValue(
        new Error("Invalid or expired token"),
      );

      const store = createTestStore();

      const result = await store.dispatch(
        ResetPasswordThunk({
          token: "invalid-token",
          newPassword: "NewPassword123!",
        }),
      );

      expect(result.type).toBe("auth/ResetPasswordThunk/rejected");

      expect(AuthAPI.ResetPasswordApi).toHaveBeenCalledTimes(1);

      expect(store.getState().auth.loading).toBe("failed");

      expect(store.getState().auth.error).toBe("An unexpected error");
    });
  });
});

describe("Auth Slice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("resetUI", () => {
    it("should reset UI state", () => {
      const store = createTestStore();

      store.dispatch(
        Register({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          password: "Password123!",
        }),
      );

      store.dispatch(resetUI());

      const state = store.getState().auth;

      expect(state.loading).toBe("idle");

      expect(state.error).toBeNull();

      expect(state.ForgotPasswordMessage).toBeNull();

      expect(state.ResetPasswordMessage).toBeNull();

      expect(state.ResetLink).toBeNull();
    });
  });

  describe("Logout", () => {
    it("should clear authentication data", () => {
      const store = createTestStore();

      const loggedInUser = {
        userID: 10,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: "User",
        isEmailVerified: true,
        token: "test-token",
        success: true,
        message: "Login successful",
      };

      store.dispatch({
        type: "auth/Login/fulfilled",
        payload: loggedInUser,
      });

      store.dispatch(Logout());

      const state = store.getState().auth;

      expect(state.loading).toBe("idle");

      expect(state.error).toBeNull();

      expect(state.LoginReturn).toBeNull();

      expect(state.RegisterReturn).toBeNull();
    });
  });

  describe("updateCurrentUser", () => {
    it("should update the current user's first and last name", () => {
      const store = createTestStore();

      const loggedInUser = {
        userID: 10,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: "User",
        isEmailVerified: true,
        token: "test-token",
        success: true,
        message: "Login successful",
      };

      store.dispatch({
        type: "auth/Login/fulfilled",
        payload: loggedInUser,
      });

      store.dispatch(
        updateCurrentUser({
          firstName: "Jane",
          lastName: "Smith",
        }),
      );

      const state = store.getState().auth;

      expect(state.LoginReturn?.firstName).toBe("Jane");

      expect(state.LoginReturn?.lastName).toBe("Smith");
    });
  });
});
