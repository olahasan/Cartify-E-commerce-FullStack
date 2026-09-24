import { describe, expect, it, vi, beforeEach } from "vitest";
import reducer, {
  GetUserAddressesThunk,
  GetUserDashboardThunk,
  GetUserPersonalInfoThunk,
  UpdateUserPersonalInfoThunk,
  GetUserPaymentMethodsThunk,
  GetUserOrdersThunk,
  GetOrderDetailsThunk,
  UpdateUserPasswordThunk,
} from "./ProfileSlice";
import * as ProfileAPI from "./ProfileAPI";
import type { RootState } from "@app/store/store";

const createMockState = (token: string | null) =>
  ({
    auth: {
      LoginReturn: token ? { token } : null,
    },
  }) as RootState;

vi.mock("./ProfileAPI", async () => {
  const actual =
    await vi.importActual<typeof import("./ProfileAPI")>("./ProfileAPI");

  return {
    ...actual,
    fetchUserDashboardAPI: vi.fn(),
    fetchUserPersonalInfoAPI: vi.fn(),
    fetchUpdateUserPersonalInfoAPI: vi.fn(),
    fetchUserAddressesAPI: vi.fn(),
    fetchPaymentMethodsAPI: vi.fn(),
    fetchUserOrdersAPI: vi.fn(),
    fetchOrderDetailsAPI: vi.fn(),
    UpdateUserPasswordAPI: vi.fn(),
  };
});

const mockedFetchUserDashboardAPI = vi.mocked(ProfileAPI.fetchUserDashboardAPI);
const mockedFetchOrderDetailsAPI = vi.mocked(ProfileAPI.fetchOrderDetailsAPI);

const dashboardData = {
  userInfo: {
    userID: 1,
    fullName: "Ola Ahmed",
    email: "ola@test.com",
    profilePicture: null,
  },
  stats: {
    orders: 5,
    wishlist: 3,
    addresses: 2,
  },
  recentOrders: [
    {
      orderID: 1,
      orderNumber: "ORD-001",
      totalAmount: 250,
      status: "Delivered",
      createdAt: "2026-08-18T10:00:00Z",
      itemsCount: 2,
    },
  ],
};

describe("Profile Slice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Dashboard
  it("should return the initial state", () => {
    const state = reducer(undefined, { type: "unknown" });

    expect(state).toEqual({
      loading: "idle",
      error: null,
      userDashboard: null,
      userPersonalInfo: null,
      userAddresses: [],
      userPaymentMethods: [],
      userOrders: [],
      orderDetails: null,
      passwordChanged: false,
    });
  });

  it("should set loading to pending when fetching dashboard", () => {
    const state = reducer(undefined, {
      type: GetUserDashboardThunk.pending.type,
    });

    expect(state.loading).toBe("pending");
    expect(state.error).toBeNull();
  });

  it("should store dashboard data when fetching succeeds", () => {
    const state = reducer(undefined, {
      type: GetUserDashboardThunk.fulfilled.type,
      payload: dashboardData,
    });

    expect(state.loading).toBe("succeeded");
    expect(state.userDashboard).toEqual(dashboardData);
  });

  it("should store the error when fetching dashboard fails", () => {
    const state = reducer(undefined, {
      type: GetUserDashboardThunk.rejected.type,
      payload: "Failed to fetch user dashboard",
    });

    expect(state.loading).toBe("failed");
    expect(state.error).toBe("Failed to fetch user dashboard");
  });

  it("should reject when there is no auth token", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn(() => createMockState(null));

    const result = await GetUserDashboardThunk()(dispatch, getState, undefined);

    expect(result.type).toBe("profile/GetUserDashboardThunk/rejected");
    expect(result.payload).toBe("Unauthorized: No token found");
    expect(mockedFetchUserDashboardAPI).not.toHaveBeenCalled();
  });

  it("should fetch dashboard successfully when user is authenticated", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn(() => createMockState("test-token"));

    mockedFetchUserDashboardAPI.mockResolvedValue(dashboardData);

    const result = await GetUserDashboardThunk()(dispatch, getState, undefined);

    expect(result.type).toBe("profile/GetUserDashboardThunk/fulfilled");
    expect(result.payload).toEqual(dashboardData);
    expect(mockedFetchUserDashboardAPI).toHaveBeenCalledTimes(1);
  });

  //   Personal Info
  const mockedFetchUserPersonalInfoAPI = vi.mocked(
    ProfileAPI.fetchUserPersonalInfoAPI,
  );

  const personalInfoData = {
    userID: 1,
    firstName: "Ola",
    lastName: "Ahmed",
    fullName: "Ola Ahmed",
    email: "ola@test.com",
    phone: "01012345678",
    dateOfBirth: "2000-01-01",
    profilePicture: null,
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-08-18T10:00:00Z",
  };

  it("should set loading to pending when fetching personal info", () => {
    const state = reducer(undefined, {
      type: GetUserPersonalInfoThunk.pending.type,
    });

    expect(state.loading).toBe("pending");
    expect(state.error).toBeNull();
  });

  it("should store personal info when fetching succeeds", () => {
    const state = reducer(undefined, {
      type: GetUserPersonalInfoThunk.fulfilled.type,
      payload: personalInfoData,
    });

    expect(state.loading).toBe("succeeded");
    expect(state.userPersonalInfo).toEqual(personalInfoData);
  });

  it("should store the error when fetching personal info fails", () => {
    const state = reducer(undefined, {
      type: GetUserPersonalInfoThunk.rejected.type,
      payload: "Failed to fetch user personal info",
    });

    expect(state.loading).toBe("failed");
    expect(state.error).toBe("Failed to fetch user personal info");
  });

  it("should reject when there is no auth token for personal info", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn(() => createMockState(null));

    const result = await GetUserPersonalInfoThunk()(
      dispatch,
      getState,
      undefined,
    );

    expect(result.type).toBe("profile/GetUserPersonalInfoThunk/rejected");
    expect(result.payload).toBe("Unauthorized: No token found");
    expect(mockedFetchUserPersonalInfoAPI).not.toHaveBeenCalled();
  });

  it("should fetch personal info successfully when user is authenticated", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn(() => createMockState("test-token"));

    mockedFetchUserPersonalInfoAPI.mockResolvedValue(personalInfoData);

    const result = await GetUserPersonalInfoThunk()(
      dispatch,
      getState,
      undefined,
    );

    expect(result.type).toBe("profile/GetUserPersonalInfoThunk/fulfilled");
    expect(result.payload).toEqual(personalInfoData);
    expect(mockedFetchUserPersonalInfoAPI).toHaveBeenCalledTimes(1);
  });

  // Update User Personal Info
  const mockedFetchUpdateUserPersonalInfoAPI = vi.mocked(
    ProfileAPI.fetchUpdateUserPersonalInfoAPI,
  );

  const updatedPersonalInfoData = {
    userID: 1,
    firstName: "Ola",
    lastName: "Mohamed",
    fullName: "Ola Mohamed",
    email: "ola@test.com",
    phone: "01111111111",
    dateOfBirth: "2000-01-01",
    profilePicture: null,
    updatedAt: "2026-08-18T12:00:00Z",
  };

  const personalInfoInput = {
    firstName: "Ola",
    lastName: "Mohamed",
    phone: "01111111111",
    dateOfBirth: "2000-01-01",
    profilePicture: null,
  };

  it("should set loading to pending when updating personal info", () => {
    const state = reducer(undefined, {
      type: UpdateUserPersonalInfoThunk.pending.type,
    });

    expect(state.loading).toBe("pending");
    expect(state.error).toBeNull();
  });

  it("should update personal info when update succeeds", () => {
    const state = reducer(
      {
        loading: "pending",
        error: null,
        userDashboard: null,
        userPersonalInfo: personalInfoData,
        userAddresses: [],
        userPaymentMethods: [],
        userOrders: [],
        orderDetails: null,
        passwordChanged: false,
      },
      {
        type: UpdateUserPersonalInfoThunk.fulfilled.type,
        payload: updatedPersonalInfoData,
      },
    );

    expect(state.loading).toBe("succeeded");
    expect(state.userPersonalInfo).toEqual({
      ...personalInfoData,
      ...updatedPersonalInfoData,
    });
  });

  it("should store the error when updating personal info fails", () => {
    const state = reducer(undefined, {
      type: UpdateUserPersonalInfoThunk.rejected.type,
      payload: "Failed to update user personal info",
    });

    expect(state.loading).toBe("failed");
    expect(state.error).toBe("Failed to update user personal info");
  });

  it("should reject when there is no auth token for updating personal info", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn(() => createMockState(null));

    const result = await UpdateUserPersonalInfoThunk(personalInfoInput)(
      dispatch,
      getState,
      undefined,
    );

    expect(result.type).toBe("profile/UpdateUserPersonalInfoThunk/rejected");

    expect(result.payload).toBe("Unauthorized: No token found");

    expect(mockedFetchUpdateUserPersonalInfoAPI).not.toHaveBeenCalled();
  });

  it("should update personal info and dispatch updateCurrentUser when authenticated", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn(() => createMockState("test-token"));

    mockedFetchUpdateUserPersonalInfoAPI.mockResolvedValue(
      updatedPersonalInfoData,
    );

    const result = await UpdateUserPersonalInfoThunk(personalInfoInput)(
      dispatch,
      getState,
      undefined,
    );

    expect(result.type).toBe("profile/UpdateUserPersonalInfoThunk/fulfilled");
    expect(result.payload).toEqual(updatedPersonalInfoData);
    expect(mockedFetchUpdateUserPersonalInfoAPI).toHaveBeenCalledTimes(1);
    expect(mockedFetchUpdateUserPersonalInfoAPI).toHaveBeenCalledWith(
      "Ola",
      "Mohamed",
      "01111111111",
      "2000-01-01",
      null,
    );
  });

  // User Addresses
  const mockedFetchUserAddressesAPI = vi.mocked(
    ProfileAPI.fetchUserAddressesAPI,
  );

  const addressesData: ProfileAPI.UserAddressesData[] = [
    {
      addressID: 1,
      userID: 1,
      addressType: "Home",
      streetAddress: "123 Main Street",
      city: "Cairo",
      state: "Cairo",
      postalCode: "11511",
      country: "Egypt",
      isDefault: true,
      createdAt: "2026-08-18T10:00:00Z",
      updatedAt: "2026-08-18T10:00:00Z",
    },
    {
      addressID: 2,
      userID: 1,
      addressType: "Work",
      streetAddress: "456 Second Street",
      city: "Giza",
      state: "Giza",
      postalCode: "12511",
      country: "Egypt",
      isDefault: false,
      createdAt: "2026-08-18T11:00:00Z",
      updatedAt: "2026-08-18T11:00:00Z",
    },
  ];

  it("should set loading to pending when fetching user addresses", () => {
    const state = reducer(undefined, {
      type: GetUserAddressesThunk.pending.type,
    });

    expect(state.loading).toBe("pending");
    expect(state.error).toBeNull();
  });

  it("should store user addresses when fetching succeeds", () => {
    const state = reducer(undefined, {
      type: GetUserAddressesThunk.fulfilled.type,
      payload: addressesData,
    });

    expect(state.loading).toBe("succeeded");
    expect(state.userAddresses).toEqual(addressesData);
  });

  it("should store the error when fetching user addresses fails", () => {
    const state = reducer(undefined, {
      type: GetUserAddressesThunk.rejected.type,
      payload: "Failed to fetch user addresses",
    });

    expect(state.loading).toBe("failed");
    expect(state.error).toBe("Failed to fetch user addresses");
  });

  it("should reject when there is no auth token for user addresses", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn(() => createMockState(null));

    const result = await GetUserAddressesThunk()(dispatch, getState, undefined);

    expect(result.type).toBe("profile/GetUserAddressesThunk/rejected");
    expect(result.payload).toBe("Unauthorized: No token found");
    expect(mockedFetchUserAddressesAPI).not.toHaveBeenCalled();
  });

  it("should fetch user addresses successfully when user is authenticated", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn(() => createMockState("test-token"));

    mockedFetchUserAddressesAPI.mockResolvedValue(addressesData);

    const result = await GetUserAddressesThunk()(dispatch, getState, undefined);

    expect(result.type).toBe("profile/GetUserAddressesThunk/fulfilled");
    expect(result.payload).toEqual(addressesData);
    expect(mockedFetchUserAddressesAPI).toHaveBeenCalledTimes(1);
  });

  // User Payment Methods
  const mockedFetchPaymentMethodsAPI = vi.mocked(
    ProfileAPI.fetchPaymentMethodsAPI,
  );

  const paymentMethodsResponse: ProfileAPI.TPaymentMethods = {
    success: true,
    message: "Payment methods fetched successfully",
    data: [
      {
        paymentMethodID: 1,
        stripePaymentMethodId: "pm_card_visa",
        brand: "visa",
        last4: "4242",
        cardHolderName: "Ola Ahmed",
        expMonth: 12,
        expYear: 2030,
        isDefault: true,
      },
      {
        paymentMethodID: 2,
        stripePaymentMethodId: "pm_card_mastercard",
        brand: "mastercard",
        last4: "5555",
        cardHolderName: "Ola Ahmed",
        expMonth: 6,
        expYear: 2029,
        isDefault: false,
      },
    ],
    errors: null,
  };

  it("should set loading to pending when fetching user payment methods", () => {
    const state = reducer(undefined, {
      type: GetUserPaymentMethodsThunk.pending.type,
    });

    expect(state.loading).toBe("pending");
    expect(state.error).toBeNull();
  });

  it("should store user payment methods when fetching succeeds", () => {
    const state = reducer(undefined, {
      type: GetUserPaymentMethodsThunk.fulfilled.type,
      payload: paymentMethodsResponse,
    });

    expect(state.loading).toBe("succeeded");
    expect(state.userPaymentMethods).toEqual(paymentMethodsResponse.data);
  });

  it("should store the error when fetching user payment methods fails", () => {
    const state = reducer(undefined, {
      type: GetUserPaymentMethodsThunk.rejected.type,
      payload: "Failed to fetch user payment methods",
    });

    expect(state.loading).toBe("failed");
    expect(state.error).toBe("Failed to fetch user payment methods");
  });

  it("should reject when there is no auth token for user payment methods", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn(() => createMockState(null));

    const result = await GetUserPaymentMethodsThunk()(
      dispatch,
      getState,
      undefined,
    );

    expect(result.type).toBe("profile/GetUserPaymentMethodsThunk/rejected");

    expect(result.payload).toBe("Unauthorized: No token found");

    expect(mockedFetchPaymentMethodsAPI).not.toHaveBeenCalled();
  });

  it("should fetch user payment methods successfully when user is authenticated", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn(() => createMockState("test-token"));

    mockedFetchPaymentMethodsAPI.mockResolvedValue(paymentMethodsResponse);

    const result = await GetUserPaymentMethodsThunk()(
      dispatch,
      getState,
      undefined,
    );

    expect(result.type).toBe("profile/GetUserPaymentMethodsThunk/fulfilled");

    expect(result.payload).toEqual(paymentMethodsResponse);

    expect(mockedFetchPaymentMethodsAPI).toHaveBeenCalledTimes(1);
  });

  // User Orders
  const mockedFetchUserOrdersAPI = vi.mocked(ProfileAPI.fetchUserOrdersAPI);

  const ordersData: ProfileAPI.UserOrdersData[] = [
    {
      orderId: 1,
      orderNumber: "ORD-001",
      totalAmount: 250,
      status: "Delivered",
      createdAt: "2026-08-18T10:00:00Z",
      updatedAt: "2026-08-18T12:00:00Z",
      itemsCount: 2,
      totalQuantity: 3,
    },
    {
      orderId: 2,
      orderNumber: "ORD-002",
      totalAmount: 150,
      status: "Pending",
      createdAt: "2026-08-19T10:00:00Z",
      updatedAt: "2026-08-19T10:30:00Z",
      itemsCount: 1,
      totalQuantity: 2,
    },
  ];

  it("should set loading to pending when fetching user orders", () => {
    const state = reducer(undefined, {
      type: GetUserOrdersThunk.pending.type,
    });

    expect(state.loading).toBe("pending");
    expect(state.error).toBeNull();
  });

  it("should store user orders when fetching succeeds", () => {
    const state = reducer(undefined, {
      type: GetUserOrdersThunk.fulfilled.type,
      payload: ordersData,
    });

    expect(state.loading).toBe("succeeded");
    expect(state.userOrders).toEqual(ordersData);
  });

  it("should store the error when fetching user orders fails", () => {
    const state = reducer(undefined, {
      type: GetUserOrdersThunk.rejected.type,
      payload: "Failed to fetch User Orders",
    });

    expect(state.loading).toBe("failed");
    expect(state.error).toBe("Failed to fetch User Orders");
  });

  it("should reject when there is no auth token for user orders", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn(() => createMockState(null));

    const result = await GetUserOrdersThunk()(dispatch, getState, undefined);

    expect(result.type).toBe("profile/GetUserOrdersThunk/rejected");
    expect(result.payload).toBe("Unauthorized: No token found");
    expect(mockedFetchUserOrdersAPI).not.toHaveBeenCalled();
  });

  it("should fetch user orders successfully when user is authenticated", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn(() => createMockState("test-token"));

    mockedFetchUserOrdersAPI.mockResolvedValue(ordersData);

    const result = await GetUserOrdersThunk()(dispatch, getState, undefined);

    expect(result.type).toBe("profile/GetUserOrdersThunk/fulfilled");
    expect(result.payload).toEqual(ordersData);
    expect(mockedFetchUserOrdersAPI).toHaveBeenCalledTimes(1);
  });

  // Order Details
  const orderDetailsData: ProfileAPI.OrderDetailsData = {
    orderID: 1,
    userID: 1,
    orderNumber: "ORD-001",
    totalAmount: 250,
    status: "Delivered",
    createdAt: "2026-08-18T10:00:00Z",
    updatedAt: "2026-08-18T12:00:00Z",
    shippingAmount: 20,
    taxAmount: 30,
    discountAmount: 10,
    finalAmount: 290,
    promoCode: "WELCOME10",
    paymentBrand: "visa",
    paymentLast4: "4242",

    items: [
      {
        orderItemID: 1,
        orderID: 1,
        productID: 10,
        productName: "Test Product",
        quantity: 2,
        price: 100,
        subtotal: 200,
        createdAt: "2026-08-18T10:00:00Z",
      },
    ],

    summary: {
      totalItems: 1,
      totalQuantity: 2,
      calculatedTotal: 200,
    },

    address: {
      firstName: "Ola",
      lastName: "Ahmed",
      email: "ola@test.com",
      phone: "01012345678",
      streetAddress: "123 Main Street",
      city: "Cairo",
      state: "Cairo",
      postalCode: "11511",
      country: "Egypt",
    },
  };

  it("should set loading to pending when fetching order details", () => {
    const state = reducer(undefined, {
      type: GetOrderDetailsThunk.pending.type,
    });

    expect(state.loading).toBe("pending");
    expect(state.error).toBeNull();
  });

  it("should store order details when fetching succeeds", () => {
    const state = reducer(undefined, {
      type: GetOrderDetailsThunk.fulfilled.type,
      payload: orderDetailsData,
    });

    expect(state.loading).toBe("succeeded");
    expect(state.orderDetails).toEqual(orderDetailsData);
  });

  it("should store the error when fetching order details fails", () => {
    const state = reducer(undefined, {
      type: GetOrderDetailsThunk.rejected.type,
      payload: "Failed to fetch Order Details",
    });

    expect(state.loading).toBe("failed");
    expect(state.error).toBe("Failed to fetch Order Details");
  });

  it("should reject when there is no auth token for order details", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn(() => createMockState(null));

    const result = await GetOrderDetailsThunk(1)(dispatch, getState, undefined);

    expect(result.type).toBe("profile/GetOrderDetailsThunk/rejected");
    expect(result.payload).toBe("Unauthorized: No token found");
    expect(mockedFetchOrderDetailsAPI).not.toHaveBeenCalled();
  });

  it("should fetch order details successfully when user is authenticated", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn(() => createMockState("test-token"));

    mockedFetchOrderDetailsAPI.mockResolvedValue(orderDetailsData);

    const result = await GetOrderDetailsThunk(1)(dispatch, getState, undefined);

    expect(result.type).toBe("profile/GetOrderDetailsThunk/fulfilled");
    expect(result.payload).toEqual(orderDetailsData);
    expect(mockedFetchOrderDetailsAPI).toHaveBeenCalledTimes(1);
    expect(mockedFetchOrderDetailsAPI).toHaveBeenCalledWith(1);
  });

  // Update User Password
  const mockedUpdateUserPasswordAPI = vi.mocked(
    ProfileAPI.UpdateUserPasswordAPI,
  );
  const passwordInput: ProfileAPI.TUpdateUserPasswordInput = {
    currentPassword: "OldPassword123!",
    newPassword: "NewPassword123!",
  };

  const passwordResponse: ProfileAPI.TUpdateUserPassword = {
    success: true,
    message: "Password updated successfully",
    errors: null,
  };

  // Update User Password
  it("should set loading to pending when updating user password", () => {
    const state = reducer(undefined, {
      type: UpdateUserPasswordThunk.pending.type,
    });

    expect(state.loading).toBe("pending");
    expect(state.error).toBeNull();
    expect(state.passwordChanged).toBe(false);
  });

  it("should set passwordChanged to true when updating password succeeds", () => {
    const state = reducer(undefined, {
      type: UpdateUserPasswordThunk.fulfilled.type,
      payload: passwordResponse,
    });

    expect(state.loading).toBe("succeeded");
    expect(state.error).toBeNull();
    expect(state.passwordChanged).toBe(true);
  });

  it("should reset passwordChanged when updating password fails", () => {
    const state = reducer(undefined, {
      type: UpdateUserPasswordThunk.rejected.type,
      payload: "Failed to Update User Password",
    });

    expect(state.loading).toBe("failed");
    expect(state.error).toBe("Failed to Update User Password");
    expect(state.passwordChanged).toBe(false);
  });

  it("should reject when there is no auth token for updating password", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn(() => createMockState(null));

    const result = await UpdateUserPasswordThunk(passwordInput)(
      dispatch,
      getState,
      undefined,
    );

    expect(result.type).toBe("profile/UpdateUserPasswordThunk/rejected");

    expect(result.payload).toBe("Unauthorized: No token found");

    expect(mockedUpdateUserPasswordAPI).not.toHaveBeenCalled();
  });

  it("should update password successfully when user is authenticated", async () => {
    const dispatch = vi.fn();
    const getState = vi.fn(() => createMockState("test-token"));

    mockedUpdateUserPasswordAPI.mockResolvedValue(passwordResponse);

    const result = await UpdateUserPasswordThunk(passwordInput)(
      dispatch,
      getState,
      undefined,
    );

    expect(result.type).toBe("profile/UpdateUserPasswordThunk/fulfilled");

    expect(result.payload).toEqual(passwordResponse);

    expect(mockedUpdateUserPasswordAPI).toHaveBeenCalledTimes(1);

    expect(mockedUpdateUserPasswordAPI).toHaveBeenCalledWith(passwordInput);
  });
});
