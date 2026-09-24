import axiosInstance from "@config/api/axios";

export type WishlistCountData = {
  wishlistCount: number;
};

export type WishlistCountResponse = {
  success: boolean;
  message: string;
  data: WishlistCountData;
  errors: string | null;
};

export type TWishlistItem = {
  wishlistID: number;
  userID: number;
  productID: number;
  productName: string;
  description: string;
  price: number;
  quantity: number;
  rating: number;
  totalReviews: number;
  imageUrl: string;
  AddedToWishlistAt: Date;
};

export const fetchWishlistCount = async (): Promise<WishlistCountData> => {
  try {
    const response =
      await axiosInstance.get<WishlistCountResponse>(`/GetWishlistCount`);
    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to fetch wishlist count",
      );
    }
    return response.data.data;
  } catch {
    throw new Error("Failed to fetch wishlist count");
  }
};

export const fetchWishlistByUserID = async () => {
  const response =
    await axiosInstance.get<TWishlistItem[]>(`/AllWishlistByUserID`);
  return response.data;
};

export const fetchIsProductInWishlist = async (ProductID: number) => {
  const response = await axiosInstance.get<boolean>(`/IsProductInWishlist`, {
    params: {
      ProductID,
    },
  });
  return response.data;
};

export const fetchAddToWishlist = async (ProductID: number) => {
  const response = await axiosInstance.post<boolean>(`/AddToWishlist`, null, {
    params: {
      ProductID,
    },
  });
  return response.data;
};

export const fetchRemoveFromWishlist = async (ProductID: number) => {
  const response = await axiosInstance.delete<boolean>(`/RemoveFromWishlist`, {
    params: {
      ProductID,
    },
  });
  return response.data;
};

export const fetchClearWishlist = async () => {
  const response = await axiosInstance.delete<boolean>(`/ClearWishlist`);
  return response.data;
};
