import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import {
  ForgotPasswordApi,
  LoginAPI,
  RegisterAPI,
  ResetPasswordApi,
  type TForgotPasswordReturn,
  type TLoginData,
  type TLoginReturn,
  type TRegisterData,
  type TRegisterReturn,
  type TResetPasswordData,
  type TResetPasswordReturn,
} from "./authAPI";

const Register = createAsyncThunk<
  TRegisterReturn,
  TRegisterData,
  { rejectValue: string }
>("auth/Register", async (formData: TRegisterData, thunk) => {
  const { rejectWithValue } = thunk;

  try {
    const res = await RegisterAPI(formData);
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data.message || error.message);
    } else {
      return rejectWithValue("An unexpected error");
    }
  }
});

const Login = createAsyncThunk<
  TLoginReturn,
  TLoginData,
  { rejectValue: string }
>("auth/Login", async (formData: TLoginData, thunk) => {
  const { rejectWithValue } = thunk;

  try {
    const res = await LoginAPI(formData);
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data.message || error.message);
    } else {
      return rejectWithValue("An unexpected error");
    }
  }
});

const ForgotPasswordThunk = createAsyncThunk<
  TForgotPasswordReturn,
  string,
  { rejectValue: string }
>("auth/ForgotPasswordThunk", async (email, thunk) => {
  const { rejectWithValue } = thunk;

  try {
    const res = await ForgotPasswordApi(email);
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data.message || error.message);
    } else {
      return rejectWithValue("An unexpected error");
    }
  }
});

const ResetPasswordThunk = createAsyncThunk<
  TResetPasswordReturn,
  TResetPasswordData,
  { rejectValue: string }
>("auth/ResetPasswordThunk", async (data, thunk) => {
  const { rejectWithValue } = thunk;

  try {
    const res = await ResetPasswordApi(data);
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || error.message);
    } else {
      return rejectWithValue("An unexpected error");
    }
  }
});

interface IAuthState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  RegisterReturn: TRegisterReturn | null;
  LoginReturn: TLoginReturn | null;
  ForgotPasswordMessage: string | null;
  ResetLink: string | null;
  ResetPasswordMessage: string | null;
}

const initialState: IAuthState = {
  loading: "idle",
  error: null,
  RegisterReturn: null,
  LoginReturn: null,
  ForgotPasswordMessage: null,
  ResetLink: null,
  ResetPasswordMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetUI: (state) => {
      state.loading = "idle";
      state.error = null;
      state.ForgotPasswordMessage = null;
      state.ResetPasswordMessage = null;
      state.ResetLink = null;
    },
    Logout: (state) => {
      state.loading = "idle";
      state.error = null;
      state.LoginReturn = null;
      state.RegisterReturn = null;
    },
    updateCurrentUser: (
      state,
      action: PayloadAction<{
        firstName: string;
        lastName: string;
      }>,
    ) => {
      if (state.LoginReturn) {
        state.LoginReturn.firstName = action.payload.firstName;
        state.LoginReturn.lastName = action.payload.lastName;
      }
    },
  },
  extraReducers: (builder) => {
    ///////////////////////register -> RegisterAPI//////////////////////////////
    builder.addCase(Register.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(Register.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.RegisterReturn = action.payload;
    });
    builder.addCase(Register.rejected, (state, action) => {
      state.loading = "failed";
      if (action.payload && typeof action.payload === "string") {
        state.error = action.payload;
        // state.error = action.payload ?? "Something went wrong";
      }
    });

    /////////////////////////login -> Login////////////////////////////////
    builder.addCase(Login.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(Login.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.LoginReturn = action.payload;
    });
    builder.addCase(Login.rejected, (state, action) => {
      state.loading = "failed";
      if (action.payload && typeof action.payload === "string") {
        state.error = action.payload;
      }
    });

    /////////////////////////ForgotPassword -> ForgotPassword////////////////////////////////
    builder.addCase(ForgotPasswordThunk.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(ForgotPasswordThunk.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.ForgotPasswordMessage = action.payload.message;
      state.ResetLink = action.payload.resetLink;
    });
    builder.addCase(ForgotPasswordThunk.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload ?? "Something went wrong";
    });

    /////////////////////////ResetPassword -> ResetPassword////////////////////////////////
    builder.addCase(ResetPasswordThunk.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(ResetPasswordThunk.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.ResetPasswordMessage = action.payload.message;
    });
    builder.addCase(ResetPasswordThunk.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload ?? "Invalid or expired token";
    });
  },
});

export { Register, Login, ForgotPasswordThunk, ResetPasswordThunk };
export const { resetUI, Logout, updateCurrentUser } = authSlice.actions;
export default authSlice.reducer;
