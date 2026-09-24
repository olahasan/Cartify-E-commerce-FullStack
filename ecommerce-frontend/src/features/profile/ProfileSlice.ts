import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  AddPaymentMethodsAPI,
  AddUserAddressAPI,
  DeletePaymentMethodAPI,
  DeleteUserAddressAPI,
  fetchOrderDetailsAPI,
  fetchPaymentMethodsAPI,
  fetchUpdateUserPersonalInfoAPI,
  fetchUserAddressesAPI,
  fetchUserDashboardAPI,
  fetchUserOrdersAPI,
  fetchUserPersonalInfoAPI,
  SetDefaultPaymentMethodAPI,
  UpdateUserAddressAPI,
  UpdateUserPasswordAPI,
  type AddUserAddressData,
  type AddUserAddressInput,
  type DeleteUserAddressData,
  type OrderDetailsData,
  type TAddPaymentMethodInput,
  type TAddPaymentMethods,
  type TDeletePaymentMethods,
  type TPaymentMethods,
  type TPaymentMethodsData,
  type TSetDefaultPaymentMethod,
  type TUpdateUserPassword,
  type TUpdateUserPasswordInput,
  type UpdateUserAddressData,
  type UpdateUserAddressInput,
  type UpdateUserPersonalInfoData,
  type UserAddressesData,
  type UserDashboardData,
  type UserOrdersData,
  type UserPersonalInfoData,
} from "./ProfileAPI";
import type { RootState } from "@app/store/store";
import { updateCurrentUser } from "@auth/authSlice";
import axios from "axios";

export const GetUserDashboardThunk = createAsyncThunk<
  UserDashboardData,
  void,
  { state: RootState; rejectValue: string }
>("profile/GetUserDashboardThunk", async (_, thunkAPI) => {
  const { rejectWithValue, getState } = thunkAPI;

  const token = getState().auth.LoginReturn?.token;
  if (!token) {
    return rejectWithValue("Unauthorized: No token found");
  }

  try {
    const data = await fetchUserDashboardAPI();
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("GetUserDashboardThunk error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message ??
          error.message ??
          "Failed to fetch user dashboard",
      );
    }
    if (error instanceof Error) {
      console.error("Unexpected error:", error);
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Failed to fetch user dashboard");
  }
});

export const GetUserPersonalInfoThunk = createAsyncThunk<
  UserPersonalInfoData,
  void,
  { state: RootState; rejectValue: string }
>("profile/GetUserPersonalInfoThunk", async (_, thunkAPI) => {
  const { rejectWithValue, getState } = thunkAPI;

  const token = getState().auth.LoginReturn?.token;
  if (!token) {
    return rejectWithValue("Unauthorized: No token found");
  }

  try {
    const data = await fetchUserPersonalInfoAPI();
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("GetUserPersonalInfoThunk error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message ??
          error.message ??
          "Failed to fetch user personal info",
      );
    }
    if (error instanceof Error) {
      console.error("Unexpected error:", error);
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Failed to fetch user personal info");
  }
});

export type TPersonalInfoInputs = {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  profilePicture: string | null;
};

export const UpdateUserPersonalInfoThunk = createAsyncThunk<
  UpdateUserPersonalInfoData,
  TPersonalInfoInputs,
  { state: RootState; rejectValue: string }
>(
  "profile/UpdateUserPersonalInfoThunk",
  async (
    { firstName, lastName, phone, dateOfBirth, profilePicture },
    thunkAPI,
  ) => {
    const { rejectWithValue, getState, dispatch } = thunkAPI;

    const token = getState().auth.LoginReturn?.token;
    if (!token) {
      return rejectWithValue("Unauthorized: No token found");
    }

    try {
      const data = await fetchUpdateUserPersonalInfoAPI(
        firstName,
        lastName,
        phone,
        dateOfBirth,
        profilePicture,
      );
      dispatch(
        updateCurrentUser({
          firstName: data.firstName,
          lastName: data.lastName,
        }),
      );

      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "UpdateUserPersonalInfoThunk error:",
          error.response?.data,
        );
        return rejectWithValue(
          error.response?.data?.message ??
            error.message ??
            "Failed to update user personal info",
        );
      }
      if (error instanceof Error) {
        console.error("Unexpected error:", error);
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to update user personal info");
    }
  },
);

export const GetUserAddressesThunk = createAsyncThunk<
  UserAddressesData[],
  void,
  { state: RootState; rejectValue: string }
>("profile/GetUserAddressesThunk", async (_, thunkAPI) => {
  const { rejectWithValue, getState } = thunkAPI;

  const token = getState().auth.LoginReturn?.token;
  if (!token) {
    return rejectWithValue("Unauthorized: No token found");
  }

  try {
    const data = await fetchUserAddressesAPI();
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("GetUserAddressesThunk error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message ??
          error.message ??
          "Failed to fetch user addresses",
      );
    }
    if (error instanceof Error) {
      console.error("Unexpected error:", error);
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Failed to fetch user addresses");
  }
});

export const AddUserAddressInfoThunk = createAsyncThunk<
  AddUserAddressData,
  AddUserAddressInput,
  { state: RootState; rejectValue: string }
>(
  "profile/AddUserAddressInfoThunk",
  async (FormData: AddUserAddressInput, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;

    const token = getState().auth.LoginReturn?.token;
    if (!token) {
      return rejectWithValue("Unauthorized: No token found");
    }

    try {
      const data = await AddUserAddressAPI(FormData);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("AddUserAddressInfoThunk error:", error.response?.data);
        return rejectWithValue(
          error.response?.data?.message ??
            error.message ??
            "Failed to add user address info",
        );
      }
      if (error instanceof Error) {
        console.error("Unexpected error:", error);
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to add user address info");
    }
  },
);

export const UpdateUserAddressInfoThunk = createAsyncThunk<
  UpdateUserAddressData,
  { addressId: number; address: UpdateUserAddressInput },
  { state: RootState; rejectValue: string }
>(
  "profile/UpdateUserAddressInfoThunk",
  async ({ addressId, address }, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;

    const token = getState().auth.LoginReturn?.token;
    if (!token) {
      return rejectWithValue("Unauthorized: No token found");
    }

    try {
      const data = await UpdateUserAddressAPI(addressId, address);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "UpdateUserAddressInfoThunk error:",
          error.response?.data,
        );
        return rejectWithValue(
          error.response?.data?.message ??
            error.message ??
            "Failed to update user address info",
        );
      }
      if (error instanceof Error) {
        console.error("Unexpected error:", error);
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to update user address info");
    }
  },
);

export const DeleteUserAddressThunk = createAsyncThunk<
  DeleteUserAddressData,
  { addressId: number },
  { state: RootState; rejectValue: string }
>("profile/DeleteUserAddressThunk", async ({ addressId }, thunkAPI) => {
  const { rejectWithValue, getState } = thunkAPI;

  const token = getState().auth.LoginReturn?.token;
  if (!token) {
    return rejectWithValue("Unauthorized: No token found");
  }

  try {
    const data = await DeleteUserAddressAPI(addressId);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("DeleteUserAddressThunk error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message ??
          error.message ??
          "Failed to delete user address",
      );
    }
    if (error instanceof Error) {
      console.error("Unexpected error:", error);
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Failed to delete user address");
  }
});
export const GetUserPaymentMethodsThunk = createAsyncThunk<
  TPaymentMethods,
  void,
  { state: RootState; rejectValue: string }
>("profile/GetUserPaymentMethodsThunk", async (_, thunkAPI) => {
  const { rejectWithValue, getState } = thunkAPI;

  const token = getState().auth.LoginReturn?.token;
  if (!token) {
    return rejectWithValue("Unauthorized: No token found");
  }

  try {
    const data = await fetchPaymentMethodsAPI();
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("GetUserPaymentMethodsThunk error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message ??
          error.message ??
          "Failed to fetch user payment methods",
      );
    }
    if (error instanceof Error) {
      console.error("Unexpected error:", error);
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Failed to fetch user payment methods");
  }
});

export const AddUserPaymentMethodThunk = createAsyncThunk<
  TAddPaymentMethods,
  TAddPaymentMethodInput,
  { state: RootState; rejectValue: string }
>(
  "profile/AddUserPaymentMethodThunk",
  async (PaymentMethodInput: TAddPaymentMethodInput, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;

    const token = getState().auth.LoginReturn?.token;
    if (!token) {
      return rejectWithValue("Unauthorized: No token found");
    }

    try {
      const data = await AddPaymentMethodsAPI(PaymentMethodInput);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("AddUserPaymentMethodThunk error:", error.response?.data);
        return rejectWithValue(
          error.response?.data?.message ??
            error.message ??
            "Failed to add user payment method",
        );
      }
      if (error instanceof Error) {
        console.error("Unexpected error:", error);
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to add user payment method");
    }
  },
);

export const DeleteUserPaymentMethodThunk = createAsyncThunk<
  TDeletePaymentMethods,
  { paymentMethodId: number },
  { state: RootState; rejectValue: string }
>(
  "profile/DeleteUserPaymentMethodThunk",
  async ({ paymentMethodId }, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;

    const token = getState().auth.LoginReturn?.token;
    if (!token) {
      return rejectWithValue("Unauthorized: No token found");
    }

    try {
      const data = await DeletePaymentMethodAPI(paymentMethodId);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "DeleteUserPaymentMethodThunk error:",
          error.response?.data,
        );
        return rejectWithValue(
          error.response?.data?.message ??
            error.message ??
            "Failed to delete user payment method",
        );
      }
      if (error instanceof Error) {
        console.error("Unexpected error:", error);
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to delete user payment method");
    }
  },
);

export const SetDefaultPaymentMethodThunk = createAsyncThunk<
  TSetDefaultPaymentMethod,
  { paymentMethodId: number },
  { state: RootState; rejectValue: string }
>(
  "profile/SetDefaultPaymentMethodThunk",
  async ({ paymentMethodId }, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;

    const token = getState().auth.LoginReturn?.token;
    if (!token) {
      return rejectWithValue("Unauthorized: No token found");
    }

    try {
      const data = await SetDefaultPaymentMethodAPI(paymentMethodId);
      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("SetDefaultPaymentMethod error:", error.response?.data);
        return rejectWithValue(
          error.response?.data?.message ??
            error.message ??
            "Failed to set defaultPaymentMethod",
        );
      }
      if (error instanceof Error) {
        console.error("Unexpected error:", error);
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to set default paymentMethod");
    }
  },
);

export const GetUserOrdersThunk = createAsyncThunk<
  UserOrdersData[],
  void,
  { state: RootState; rejectValue: string }
>("profile/GetUserOrdersThunk", async (_, thunkAPI) => {
  const { rejectWithValue, getState } = thunkAPI;

  const token = getState().auth.LoginReturn?.token;
  if (!token) {
    return rejectWithValue("Unauthorized: No token found");
  }

  try {
    const data = await fetchUserOrdersAPI();
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("GetUserOrders error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message ??
          error.message ??
          "Failed to fetch User Orders",
      );
    }
    if (error instanceof Error) {
      console.error("Unexpected error:", error);
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Failed to fetch User Orders");
  }
});

export const GetOrderDetailsThunk = createAsyncThunk<
  OrderDetailsData,
  number,
  { state: RootState; rejectValue: string }
>("profile/GetOrderDetailsThunk", async (orderID, thunkAPI) => {
  const { rejectWithValue, getState } = thunkAPI;

  const token = getState().auth.LoginReturn?.token;
  if (!token) {
    return rejectWithValue("Unauthorized: No token found");
  }

  try {
    const data = await fetchOrderDetailsAPI(orderID);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("GetOrderDetails error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message ??
          error.message ??
          "Failed to fetch Order Details",
      );
    }
    if (error instanceof Error) {
      console.error("Unexpected error:", error);
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Failed to fetch Order Details");
  }
});

export const UpdateUserPasswordThunk = createAsyncThunk<
  TUpdateUserPassword,
  TUpdateUserPasswordInput,
  { state: RootState; rejectValue: string }
>("profile/UpdateUserPasswordThunk", async (Passwords, thunkAPI) => {
  const { rejectWithValue, getState } = thunkAPI;

  const token = getState().auth.LoginReturn?.token;
  if (!token) {
    return rejectWithValue("Unauthorized: No token found");
  }

  try {
    const data = await UpdateUserPasswordAPI(Passwords);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("UpdateUserPassword error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message ??
          error.message ??
          "Failed to Update User Password",
      );
    }
    if (error instanceof Error) {
      console.error("Unexpected error:", error);
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Failed to Update User Password");
  }
});

interface IProfileState {
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  userDashboard: UserDashboardData | null;
  userPersonalInfo: UserPersonalInfoData | null;
  userAddresses: UserAddressesData[];
  userPaymentMethods: TPaymentMethodsData[];
  userOrders: UserOrdersData[];
  orderDetails: OrderDetailsData | null;
  passwordChanged: boolean;
}

const initialState: IProfileState = {
  loading: "idle",
  error: null,
  userDashboard: null,
  userPersonalInfo: null,
  userAddresses: [],
  userPaymentMethods: [],
  userOrders: [],
  orderDetails: null,
  passwordChanged: false,
};

const ProfileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetPasswordChanged: (state) => {
      state.passwordChanged = false;
    },
  },
  extraReducers: (builder) => {
    ////////////////// GetUserDashboard /////////////////////
    builder.addCase(GetUserDashboardThunk.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(GetUserDashboardThunk.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.userDashboard = action.payload;
    });

    builder.addCase(GetUserDashboardThunk.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });
    ////////////////// GetUserPersonalInfo /////////////////////
    builder.addCase(GetUserPersonalInfoThunk.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(GetUserPersonalInfoThunk.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.userPersonalInfo = action.payload;
    });

    builder.addCase(GetUserPersonalInfoThunk.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });
    ////////////////// UpdateUserPersonalInfo /////////////////////
    builder.addCase(UpdateUserPersonalInfoThunk.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(UpdateUserPersonalInfoThunk.fulfilled, (state, action) => {
      state.loading = "succeeded";

      if (state.userPersonalInfo) {
        state.userPersonalInfo = {
          ...state.userPersonalInfo,
          ...action.payload,
        };
      }
    });

    builder.addCase(UpdateUserPersonalInfoThunk.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });
    ////////////////// GetUserAddresses /////////////////////
    builder.addCase(GetUserAddressesThunk.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(GetUserAddressesThunk.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.userAddresses = action.payload;
    });

    builder.addCase(GetUserAddressesThunk.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    ////////////////// AddUserAddressInfo /////////////////////
    builder.addCase(AddUserAddressInfoThunk.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(AddUserAddressInfoThunk.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.userAddresses.push(action.payload);
    });

    builder.addCase(AddUserAddressInfoThunk.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });
    ////////////////// UpdateUserAddressInfo /////////////////////
    builder.addCase(UpdateUserAddressInfoThunk.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(UpdateUserAddressInfoThunk.fulfilled, (state, action) => {
      state.loading = "succeeded";
      if (state.userAddresses) {
        const index = state.userAddresses.findIndex(
          (ele) => ele.addressID === action.payload.addressID,
        );
        if (index !== -1) {
          state.userAddresses[index] = action.payload;
        }
      }
    });

    builder.addCase(UpdateUserAddressInfoThunk.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });
    ////////////////// DeleteUserAddressThunk /////////////////////
    builder.addCase(DeleteUserAddressThunk.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(DeleteUserAddressThunk.fulfilled, (state, action) => {
      state.loading = "succeeded";
      if (state.userAddresses) {
        state.userAddresses = state.userAddresses.filter(
          // (ele) => ele.addressID != action.payload.addressId,
          (ele) => ele.addressID !== action.payload.addressId,
        );
      }
    });

    builder.addCase(DeleteUserAddressThunk.rejected, (state, action) => {
      state.loading = "failed";
      // state.error = action.payload as string;
      state.error = action.payload ?? "Failed to update user password";
    });
    ////////////////// GetUserPaymentMethods /////////////////////
    builder.addCase(GetUserPaymentMethodsThunk.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(GetUserPaymentMethodsThunk.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.userPaymentMethods = action.payload.data;
    });

    builder.addCase(GetUserPaymentMethodsThunk.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });
    ////////////////// AddUserPaymentMethodThunk /////////////////////
    builder.addCase(AddUserPaymentMethodThunk.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(AddUserPaymentMethodThunk.fulfilled, (state) => {
      state.loading = "succeeded";
    });

    builder.addCase(AddUserPaymentMethodThunk.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    ////////////////// DeleteUserPaymentMethodThunk /////////////////////
    builder.addCase(DeleteUserPaymentMethodThunk.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(DeleteUserPaymentMethodThunk.fulfilled, (state, action) => {
      state.loading = "succeeded";
      if (state.userPaymentMethods) {
        state.userPaymentMethods = state.userPaymentMethods.filter(
          // (ele) => ele.paymentMethodID != action.payload.data.PaymentMethodID,
          (ele) => ele.paymentMethodID !== action.payload.data.PaymentMethodID,
        );
      }
    });

    builder.addCase(DeleteUserPaymentMethodThunk.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    ////////////////// SetDefaultPaymentMethodThunk /////////////////////
    builder.addCase(SetDefaultPaymentMethodThunk.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(SetDefaultPaymentMethodThunk.fulfilled, (state) => {
      state.loading = "succeeded";
    });

    builder.addCase(SetDefaultPaymentMethodThunk.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    ////////////////// GetUserOrders /////////////////////
    builder.addCase(GetUserOrdersThunk.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(GetUserOrdersThunk.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.userOrders = action.payload;
    });

    builder.addCase(GetUserOrdersThunk.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    ////////////////// GetOrderDetails /////////////////////
    builder.addCase(GetOrderDetailsThunk.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(GetOrderDetailsThunk.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.orderDetails = action.payload;
    });

    builder.addCase(GetOrderDetailsThunk.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    ////////////////// UpdateUserPasswordThunk /////////////////////
    builder.addCase(UpdateUserPasswordThunk.pending, (state) => {
      state.loading = "pending";
      state.error = null;
      state.passwordChanged = false;
    });
    builder.addCase(UpdateUserPasswordThunk.fulfilled, (state) => {
      state.loading = "succeeded";
      state.error = null;
      state.passwordChanged = true;
    });

    builder.addCase(UpdateUserPasswordThunk.rejected, (state, action) => {
      // builder.addCase(UpdateUserPasswordThunk.rejected, (state) => {
      state.loading = "failed";
      // state.error = null;
      // state.error = action.payload as string;
      state.error = action.payload ?? "Failed to update user password";
      state.passwordChanged = false;
    });
  },
});

export const { resetPasswordChanged } = ProfileSlice.actions;

export default ProfileSlice.reducer;
