import axiosInstance from "@config/api/axios";

type TResponseTopRated = {
  productID: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  rating: number;
  totalReviews: number;
  imageUrl: string;
};

type TProductImages = {
  thumbs: string[];
  fulls: string[];
};

type TProductWithCategory = {
  productID: number;
  productName: string;
  description: string;
  price: number;
  quantity: number;
  rating: number;
  totalReviews: number;
  categoryImage: string;
  categoryName: string;
  categorySlug: string;
  createdAt: string;
  updatedAt: string;
};

type TPagination = {
  currentPage: number;
  pageSize: number;
  totalProducts: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};
export type TProducts = {
  productID: number;
  productName: string;
  description: string;
  price: number;
  quantity: number;
  rating: number;
  totalReviews: number;
  categoryImage: string | null;
  categoryName: string;
  categorySlug: string;
  createdAt: string;
  updatedAt: string;
  productImageUrl: string;
};
type TPagedProducts = {
  success: boolean;
  message: string;
  data: {
    products: TProducts[];
    pagination: TPagination;
  };
  errors: unknown | null;
};

type THomeSectionsWithSlugs = {
  sectionName: string;
  slug: string;
  displayOrder: number;
};

type THomePageSections = {
  categoryID: number;
  sectionName: string;
  sectionImage: string;
  sectionSlug: string;
  hierarchy: string;
  level: number;
  showInHome: boolean;
  showInForAll: boolean;
};

type THomeSectionCarousel = {
  categoryID: number;
  categoryName: string;
  imageUrl: string;
  categorySlug: string;
  hierarchy: string;
  level: number;
  showInHome: boolean;
  parentCategoryID: number;
};

type TCategoryInfo = {
  categoryID: number;
  name: string;
  imageUrl: string;
  parentCategoryID: number | null;
  slug: string;
  hierarchy: string;
  level: number;
  hasDirectChildren: boolean;
  navigationType: string;
};

export type TCategoryItem = {
  categoryID: number;
  name: string;
  imageUrl: string;
  slug: string;
  hierarchy: string;
  level: number;
};

export type TRandomProduct = {
  productID: number;
  productName: string;
  description: string;
  price: number;
  quantity: number; // ✅ جديد
  rating: number;
  totalReviews: number;
  categoryName: string;
  categorySlug: string;
  imageUrl: string;
};

type TCategoryNavigationResponse = {
  categoryInfo: TCategoryInfo;
  directChildren: TCategoryItem[];
  categoryProducts: TProductWithCategory[];
  randomProducts: TRandomProduct[];
};

type TCategorySidebar = {
  categoryID: number;
  categoryName: string;
  categorySlug: string;
  hierarchy: string;
  level: number;
  showInHome: boolean;
  showInForAll: boolean;
  parentCategoryID: number | null;
  categoryImageUrl: string | null;
  homepageImageUrl: string | null;
  carouselImageUrl: string | null;
  carouselAltText: string | null;
};

export type TProductItems = {
  productID: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  rating: number;
  totalReviews: number;
  imageUrl: string | null;
};

export const fetchTopRatedProducts = async () => {
  try {
    const response = await axiosInstance.get<TResponseTopRated[]>(
      `/AllTopRatedProducts`,
      {
        params: {
          minRating: 4.5,
          minReviews: 10,
          topCount: 15,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Top Rated Products", error);
    throw error;
  }
};

export const fetchProductImages = async (ProductID: number) => {
  try {
    const response = await axiosInstance.get<TProductImages>(`/ProductImages`, {
      params: {
        ProductID,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching Product Images", error);
    throw error;
  }
};

export const fetchProductThumbnails = async (ProductID: number) => {
  try {
    const response = await axiosInstance.get(`/AllProductThumbnails`, {
      params: {
        ProductID,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Product Thumbnails", error);
    throw error;
  }
};

export const fetchFashionImages = async (sectionName: string) => {
  try {
    const response = await axiosInstance.get(`/AllHomeFashionImages`, {
      params: {
        SectionName: sectionName,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching home fashion images for ${sectionName}: `,
      error,
    );
    throw error;
  }
};

export const fetchProductsByCategory = async (slug: string) => {
  try {
    const response = await axiosInstance.get<TProductWithCategory[]>(
      `/api/EcommerceAPI/categories/${slug}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching Products for category ${slug}: `, error);
    throw error;
  }
};

export const fetchPagedProducts = async (
  categoryId: number,
  pageNumber: number,
  pageSize: number,
) => {
  try {
    const response = await axiosInstance.get<TPagedProducts>(`/PagedProducts`, {
      params: { categoryId, pageNumber, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error("Error: No products found for this category", error);
    throw error;
  }
};

export const fetchHomeSectionsWithSlugs = async () => {
  try {
    const response = await axiosInstance.get<THomeSectionsWithSlugs[]>(
      `/AllHomeSectionsWithSlugs`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching home sections", error);
    throw error;
  }
};

export const fetchHomePageSections = async () => {
  try {
    const response =
      await axiosInstance.get<THomePageSections[]>(`/AllHomePageSections`);
    return response.data;
  } catch (error) {
    console.error("Error fetching home page sections:", error);
    throw error;
  }
};

export const fetchHomeSectionCarousel = async (sectionSlug: string) => {
  try {
    const response = await axiosInstance.get<THomeSectionCarousel[]>(
      `/AllHomeSectionCarousel`,
      {
        params: { sectionSlug },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching carousel for section ${sectionSlug}:`, error);
    throw error;
  }
};

export const fetchCategoryNavigationData = async (
  slugPath: string,
  navigationType: string = "AUTO",
) => {
  try {
    const response = await axiosInstance.get<TCategoryNavigationResponse>(
      `/CategoryNavigation`,
      {
        params: { slugPath, navigationType },
      },
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching navigation data for ${slugPath}:`, error);
    throw error;
  }
};

export const fetchCategorySidebar = async () => {
  try {
    const response =
      await axiosInstance.get<TCategorySidebar[]>(`/AllCategorySidebar`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Category Sidebar data", error);
    throw error;
  }
};

export const fetchProductItems = async (productID: number) => {
  try {
    const response = await axiosInstance.get<TProductItems>(
      `/GetProductById/${productID}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Product Items data", error);
    throw error;
  }
};
