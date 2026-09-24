import axiosInstance from "@config/api/axios";
export type CartSummaryData = {
  totalQuantity: number;
  totalPrice: number;
};
export type TCartSummary = {
  success: boolean;
  message: string;
  data: CartSummaryData;
  errors: string | null;
};
export type TCartItem = {
  productID: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  imageUrl: string;
  altText: string;
  availableQuantity: number;
};

export type TInsertUpdateCartItem = {
  success: boolean;
  message: string;
  data: {
    Action: "Inserted" | "Updated";
    ProductID: number;
  } | null;
  errors: string | null;
};

export type TRemoveCartItem = {
  success: boolean;
  message: string;
  data: {
    Action: "Deleted" | "NotFound";
    ProductID: number;
  } | null;
  errors: string | object | null;
};

export type TIncrementDecrementCartItem = {
  success: boolean;
  message: string;
  data: {
    action: "Increment" | "Decrement";
    productID: number;
    newQuantity: number;
  } | null;
  errors: string | object | null;
};

export type TClearCart = {
  success: boolean;
  message: string;
  data: boolean;
  errors: string | object | null;
};

export const fetchCartSummary = async (): Promise<CartSummaryData> => {
  const response = await axiosInstance.get<TCartSummary>(`/GetCartSummary`);
  return response.data.data;
};

export const fetchCartItemsByUserID = async (): Promise<TCartItem[]> => {
  const response = await axiosInstance.get<TCartItem[]>(
    `/GetCartItemsByUserID`,
  );
  return response.data;
};

export const InsertUpdateCartItems = async (
  ProductID: number,
): Promise<TInsertUpdateCartItem> => {
  const response = await axiosInstance.post<TInsertUpdateCartItem>(
    `/InsertUpdateCartItems`,
    null,
    {
      params: {
        ProductID,
      },
    },
  );
  return response.data;
};

export const RemoveCartItem = async (
  ProductID: number,
): Promise<TRemoveCartItem> => {
  const response = await axiosInstance.delete<TRemoveCartItem>(
    `/RemoveCartItem`,
    {
      params: {
        ProductID,
      },
    },
  );
  return response.data;
};

export const IncrementDecrementCartItems = async (
  ProductID: number,
  Action: "Increment" | "Decrement",
): Promise<TIncrementDecrementCartItem> => {
  const response = await axiosInstance.post<TIncrementDecrementCartItem>(
    `/IncrementDecrementCartItem`,
    null,
    {
      params: {
        ProductID,
        Action,
      },
    },
  );
  return response.data;
};

export const fetchClearCart = async (): Promise<TClearCart> => {
  const response = await axiosInstance.delete<TClearCart>(`/ClearCart`);
  return response.data;
};
