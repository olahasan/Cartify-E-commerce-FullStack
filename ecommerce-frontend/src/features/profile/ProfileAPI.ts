import axiosInstance from "@config/api/axios";
import axios from "axios";

/* ----------------------------------------------------
   TYPES FOR USER DASHBOARD  --1
---------------------------------------------------- */
export type recentOrder = {
  orderID: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  itemsCount: number;
};
export type UserDashboardData = {
  userInfo: {
    userID: number;
    fullName: string;
    email: string;
    profilePicture: string | null;
  };
  stats: {
    orders: number;
    wishlist: number;
    addresses: number;
  };
  recentOrders: recentOrder[];
};

export type TUserDashboard = {
  success: boolean;
  message: string;
  data: UserDashboardData;
  errors: string | null;
};

/* ----------------------------------------------------
   TYPES FOR USER PERSONAL INFO --2
---------------------------------------------------- */

export type UserPersonalInfoData = {
  userID: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  profilePicture: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TUserPersonalInfo = {
  success: boolean;
  message: string;
  data: UserPersonalInfoData;
  errors: string | null;
};

/* ----------------------------------------------------
    TYPES FOR Update USER PERSONAL INFO --3
---------------------------------------------------- */

export type UpdateUserPersonalInfoData = {
  userID: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  profilePicture: string | null;
  updatedAt: string;
};

export type TUpdateUserPersonalInfo = {
  success: boolean;
  message: string;
  data: UpdateUserPersonalInfoData;
  errors: string | null;
};
/* ----------------------------------------------------
    TYPES FOR USER Addresses --4
---------------------------------------------------- */
export type UserAddressesData = {
  addressID: number;
  userID: number;
  addressType: string;
  streetAddress: string;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TUserAddresses = {
  success: boolean;
  message: string;
  data: UserAddressesData[];
  errors: string | null;
};

/* ----------------------------------------------------
    TYPES FOR Add User Address --5
---------------------------------------------------- */
export type AddUserAddressInput = {
  addressType: string;
  streetAddress: string;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
  isDefault: boolean;
};

export type AddUserAddressData = {
  addressID: number;
  userID: number;
  addressType: string;
  streetAddress: string;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TAddUserAddress = {
  success: boolean;
  message: string;
  data: AddUserAddressData;
  errors: string | null;
};

/* ----------------------------------------------------
    TYPES FOR Update User Address --6
---------------------------------------------------- */
export type UpdateUserAddressInput = {
  addressType: string;
  streetAddress: string;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
  isDefault: boolean;
};

export type UpdateUserAddressData = {
  addressID: number;
  userID: number;
  addressType: string;
  streetAddress: string;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TUpdateUserAddress = {
  success: boolean;
  message: string;
  data: UpdateUserAddressData;
  errors: string | null;
};

/* ----------------------------------------------------
    TYPES FOR Delete User Address --7
---------------------------------------------------- */
export type DeleteUserAddressData = {
  addressId: number;
  status: string;
  message: string;
};

export type TDeleteUserAddress = {
  success: boolean;
  message: string;
  data: DeleteUserAddressData;
  errors: string | null;
};

/* ----------------------------------------------------
   TYPES FOR USER Orders --11
---------------------------------------------------- */
export type UserOrdersData = {
  orderId: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  itemsCount: number;
  totalQuantity: number;
};

export type TUserOrders = {
  success: boolean;
  message: string;
  data: UserOrdersData[];
  errors: string | null;
};

/* ----------------------------------------------------
    TYPES FOR USER Order Details --12
---------------------------------------------------- */

export type OrderDetails = {
  orderItemID: number;
  orderID: number;
  productID: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  createdAt: string;
};

export type OrderSummary = {
  totalItems: number;
  totalQuantity: number;
  calculatedTotal: number;
};

export type OrderAddressDetail = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
};

export type OrderDetailsData = {
  orderID: number;
  userID: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;

  shippingAmount: number;
  taxAmount: number;
  discountAmount: number;
  finalAmount: number;
  promoCode: string | null;
  paymentBrand: string | null;
  paymentLast4: string | null;

  items: OrderDetails[];
  summary: OrderSummary;
  address: OrderAddressDetail;
};

export type TOrderDetails = {
  success: boolean;
  message: string;
  data: OrderDetailsData;
  errors: string | null;
};

/* ----------------------------------------------------
    TYPES FOR Update User Password --13
---------------------------------------------------- */
export type TUpdateUserPasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type TUpdateUserPassword = {
  success: boolean;
  message: string;
  errors: string | null;
};

/* ----------------------------------------------------
    TYPES FOR Payment Methods --14
---------------------------------------------------- */
export type TPaymentMethodsData = {
  paymentMethodID: number;
  stripePaymentMethodId?: string;
  brand: string;
  last4: string;
  cardHolderName: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
};

export type TApiError = {
  code?: number;
  details?: string;
};

export type TPaymentMethods = {
  success: boolean;
  message: string;
  data: TPaymentMethodsData[];
  errors: TApiError | null;
};

/* ----------------------------------------------------
   TYPES FOR Add Payment Methods --15
---------------------------------------------------- */
export type TAddPaymentMethodInput = {
  StripePaymentMethodId: string;
  IsDefault: boolean;
  Brand: string;
  CardLast4: string;
  CardHolderName: string;
  ExpiryMonth: number;
  ExpiryYear: number;
};

export type TAddPaymentMethodsData = {
  PaymentMethodID: number;
  Brand: string;
  Last4: string;
  ExpMonth: number;
  ExpYear: number;
  IsDefault: boolean;
};

export type TApiError2 = {
  code?: number;
  details?: string;
};

export type TAddPaymentMethods = {
  success: boolean;
  message: string;
  data: TAddPaymentMethodsData[];
  errors: TApiError2 | null;
};

/* ----------------------------------------------------
    TYPES FOR Delete Payment Method --16
---------------------------------------------------- */
export type TDeletePaymentMethodsData = {
  PaymentMethodID: number;
};

export type TApiError3 = {
  code?: number;
  details?: string;
};

export type TDeletePaymentMethods = {
  success: boolean;
  message: string;
  data: TDeletePaymentMethodsData;
  errors: TApiError3 | null;
};

/* ----------------------------------------------------
    TYPES FOR Set Payment Method --17
---------------------------------------------------- */
export type TSetDefaultPaymentMethodData = {
  paymentMethodId: number;
};

export type TApiError4 = {
  code?: number;
  details?: string;
};

export type TSetDefaultPaymentMethod = {
  success: boolean;
  message: string;
  data: TSetDefaultPaymentMethodData;
  errors: TApiError4 | null;
};

/* ----------------------------------------------------
    API CALL — USER DASHBOARD --1
---------------------------------------------------- */
export const fetchUserDashboardAPI = async (): Promise<UserDashboardData> => {
  try {
    const response = await axiosInstance.get<TUserDashboard>(`/UserDashboard`);

    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching UserDashboard:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }

    throw error;
  }
};

/* ----------------------------------------------------
   API CALL — USER PERSONAL INFO --2
---------------------------------------------------- */
export const fetchUserPersonalInfoAPI =
  async (): Promise<UserPersonalInfoData> => {
    try {
      const response =
        await axiosInstance.get<TUserPersonalInfo>(`/UserPersonalInfo`);

      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching UserPersonalInfo:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }

      throw error;
    }
  };

/* ----------------------------------------------------
    API CALL — Update User Personal Info --3
---------------------------------------------------- */
export const fetchUpdateUserPersonalInfoAPI = async (
  firstName: string,
  lastName: string,
  phone: string,
  dateOfBirth: string,
  profilePicture: string | null,
): Promise<UpdateUserPersonalInfoData> => {
  try {
    const response = await axiosInstance.put<TUpdateUserPersonalInfo>(
      `/UpdateUserPersonalInfo`,
      {
        firstName,
        lastName,
        phone,
        dateOfBirth,
        profilePicture,
      },
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching UpdateUserPersonalInfo:",
        error.response?.data,
      );
    } else {
      console.error("Unexpected error:", error);
    }

    throw error;
  }
};

/* ----------------------------------------------------
    API CALL — USER Addresses --4
---------------------------------------------------- */
export const fetchUserAddressesAPI = async (): Promise<UserAddressesData[]> => {
  try {
    const response =
      await axiosInstance.get<TUserAddresses>(`/GetUserAddresses`);

    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching UserAddresses:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }

    throw error;
  }
};

/* ----------------------------------------------------
    API CALL — Add User Address --5
---------------------------------------------------- */
export const AddUserAddressAPI = async (
  address: AddUserAddressInput,
): Promise<AddUserAddressData> => {
  try {
    const response = await axiosInstance.post<TAddUserAddress>(
      `/AddUserAddress`,
      address,
    );

    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error adding UserAddresses:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }

    throw error;
  }
};

/* ----------------------------------------------------
   API CALL — Update User Address --6
---------------------------------------------------- */
export const UpdateUserAddressAPI = async (
  addressId: number,
  address: UpdateUserAddressInput,
): Promise<UpdateUserAddressData> => {
  try {
    const response = await axiosInstance.put<TUpdateUserAddress>(
      `/UpdateUserAddress/${addressId}`,
      address,
    );

    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching UpdateUserAddress:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }

    throw error;
  }
};

/* ----------------------------------------------------
    API CALL — Delete User Address --7
---------------------------------------------------- */
export const DeleteUserAddressAPI = async (
  addressId: number,
): Promise<DeleteUserAddressData> => {
  try {
    const response = await axiosInstance.delete<TDeleteUserAddress>(
      `/DeleteUserAddress/${addressId}`,
    );

    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching DeleteUserAddress:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }

    throw error;
  }
};
/* ----------------------------------------------------
    API CALL — User Orders --11
---------------------------------------------------- */
export const fetchUserOrdersAPI = async (): Promise<UserOrdersData[]> => {
  try {
    const response = await axiosInstance.get<TUserOrders>(`/GetUserOrders`);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching UserOrders:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }

    throw error;
  }
};

/* ----------------------------------------------------
    API CALL — User Orders Details --12
---------------------------------------------------- */
export const fetchOrderDetailsAPI = async (
  orderID: number,
): Promise<OrderDetailsData> => {
  try {
    const response = await axiosInstance.get<TOrderDetails>(
      `/GetOrderDetails/${orderID}`,
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching OrderDetails:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }

    throw error;
  }
};

/* ----------------------------------------------------
    API CALL — Update User password --13
---------------------------------------------------- */
export const UpdateUserPasswordAPI = async (
  Passwords: TUpdateUserPasswordInput,
): Promise<TUpdateUserPassword> => {
  try {
    const response = await axiosInstance.post<TUpdateUserPassword>(
      `/UpdateUserPassword`,
      Passwords,
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching UpdateUserPassword:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }

    throw error;
  }
};
/* ----------------------------------------------------
    API CALL — Payment method --14
---------------------------------------------------- */
export const fetchPaymentMethodsAPI = async (): Promise<TPaymentMethods> => {
  try {
    const response =
      await axiosInstance.get<TPaymentMethods>(`/PaymentMethods`);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error Adding PaymentMethod:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }

    throw error;
  }
};

/* ----------------------------------------------------
    API CALL — Add Payment method --15
---------------------------------------------------- */
export const AddPaymentMethodsAPI = async (
  PaymentMethodInput: TAddPaymentMethodInput,
): Promise<TAddPaymentMethods> => {
  try {
    const response = await axiosInstance.post<TAddPaymentMethods>(
      `/AddPaymentMethods`,
      PaymentMethodInput,
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching payment-methods:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }

    throw error;
  }
};

/* ----------------------------------------------------
    API CALL — Delete User Payment Method --16
---------------------------------------------------- */
export const DeletePaymentMethodAPI = async (
  paymentMethodId: number,
): Promise<TDeletePaymentMethods> => {
  try {
    const response = await axiosInstance.delete<TDeletePaymentMethods>(
      `/DeletePaymentMethods/${paymentMethodId}`,
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error Deleteing DeletePaymentMethod:",
        error.response?.data,
      );
    } else {
      console.error("Unexpected error:", error);
    }

    throw error;
  }
};

/* ----------------------------------------------------
   API CALL — Set Default User Payment Method --17
---------------------------------------------------- */
export const SetDefaultPaymentMethodAPI = async (
  paymentMethodId: number,
): Promise<TSetDefaultPaymentMethod> => {
  try {
    const response = await axiosInstance.put<TSetDefaultPaymentMethod>(
      `/payment-methods/${paymentMethodId}/default`,
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching SetDefaultPaymentMethod:",
        error.response?.data,
      );
    } else {
      console.error("Unexpected error:", error);
    }

    throw error;
  }
};
