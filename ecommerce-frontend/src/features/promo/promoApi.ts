import axiosInstance from "@config/api/axios";

export type TvalidatePromoCodeRes = {
  isValid: boolean;
  message: string;
  discountAmount: number;
};
export type TvalidatePromoCodeReq = {
  code: string;
  orderTotal: number;
};

export const validatePromoCodeAPI = async (data: TvalidatePromoCodeReq) => {
  // try {
  const response = await axiosInstance.post<TvalidatePromoCodeRes>(
    "/ValidatePromoCode",
    data,
  );
  return response.data;
  // }
  //  catch {
  //   // throw new Error("Failed to validate promo code");
  //   throw Error;
  // }
};
