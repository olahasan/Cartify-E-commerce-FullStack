
using Azure;
using EcommerceAPIDataAccessLayer;
using Microsoft.Data.SqlClient;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Diagnostics;
using System.Diagnostics.Metrics;
using System.Net;
using System.Reflection.Metadata;
using System.Reflection.Metadata.Ecma335;
using System.Reflection.PortableExecutable;
using System.Text.RegularExpressions;
using static System.Net.Mime.MediaTypeNames;

namespace EcommerceAPIDataAccessLayer
{

    
    public class ProductDTO
    {
        public ProductDTO(int productID, string name, string ? description, decimal price,
                          int quantity, decimal? rating, int? totalReviews, string ImageUrl = "")
        {
            this.ProductID = productID;
            this.Name = name;
            this.Description = description;
            this.Price = price;
            this.Quantity = quantity;
            this.Rating = rating;
            this.TotalReviews = totalReviews;
            this.ImageUrl = ImageUrl;
        }
        public int ProductID { get; set; }
        public string Name { get; set; }
        public string ? Description { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal ? Rating { get; set; }
        public int ? TotalReviews { get; set; }
        public string ImageUrl { get; set; }
    }


    public class ProductImagesDTO
    {
        public List<string> Thumbs { get; set; } = new List<string>();
        public List<string> Fulls { get; set; } = new List<string>();
    }

    public class ProductBasicDto
    {
        public int ProductID { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }

    public class ImagesDTO
    {
        public ImagesDTO(int displayOrder, string imageUrl, string altText, string sectionName, string slug)
        {
            this.DisplayOrder = displayOrder;
            this.ImageUrl = imageUrl;
            this.AltText = altText;
            this.SectionName = sectionName;
            this.Slug = slug;
        }
        public int DisplayOrder { get; set; }
        public string ImageUrl { get; set; }
        public string AltText { get; set; }
        public string SectionName { get; set; }
        public string Slug { get; set; }
    }

    public class ProductWithCategoryDTO
    {
        public ProductWithCategoryDTO(int productID, string productName, string description, decimal price,
                         int quantity, decimal rating, int totalReviews, string categoryImage,
                         string categoryName, string categorySlug, DateTime createdAt, DateTime updatedAt, 
                         string productImageUrl)
        {
            this.ProductID = productID;
            this.ProductName = productName;
            this.Description = description;
            this.Price = price;
            this.Quantity = quantity;
            this.Rating = rating;
            this.TotalReviews = totalReviews;
            this.CategoryImage = categoryImage;
            this.CategoryName = categoryName;
            this.CategorySlug = categorySlug;
            this.CreatedAt = createdAt;
            this.UpdatedAt = updatedAt;
            this.ProductImageUrl = productImageUrl;
        }

        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal Rating { get; set; }
        public int TotalReviews { get; set; }
        public string CategoryImage { get; set; }
        public string CategoryName { get; set; }
        public string CategorySlug { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string ProductImageUrl { get; set; }
    }

    
    // pagination
    public class PaginationInfoDTO
    {
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalProducts { get; set; }
        public int TotalPages { get; set; }
        public bool HasPreviousPage { get; set; }
        public bool HasNextPage { get; set; }
    }

    public class PagedProductsDTO
    {
        public List<ProductWithCategoryDTO> Products { get; set; } = new();
        public PaginationInfoDTO Pagination { get; set; }
    }

    
    // search 
    public class SearchSuggestionDTO
    {
        public SearchSuggestionDTO(string suggestionText)
        {
            this.SuggestionText = suggestionText;
        }
        public string SuggestionText { get; set; }
    }
    
    public class HomeSectionDTO
    {
        public HomeSectionDTO(string sectionName, string slug, int displayOrder)
        {
            this.SectionName = sectionName;
            this.Slug = slug;
            this.DisplayOrder = displayOrder;
        }
        public string SectionName { get; set; }
        public string Slug { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class HomeSectionDTOO
    {
        public HomeSectionDTOO(int categoryID, string sectionName, string sectionImage,
                             string sectionSlug, string hierarchy, int level,
                             bool showInHome, bool showInForAll)
        {
            this.CategoryID = categoryID;
            this.SectionName = sectionName;
            this.SectionImage = sectionImage;
            this.SectionSlug = sectionSlug;
            this.Hierarchy = hierarchy;
            this.Level = level;
            this.ShowInHome = showInHome;
            this.ShowInForAll = showInForAll;
        }

        public int CategoryID { get; set; }
        public string SectionName { get; set; }
        public string SectionImage { get; set; }
        public string SectionSlug { get; set; }
        public string Hierarchy { get; set; }
        public int Level { get; set; }
        public bool ShowInHome { get; set; }
        public bool ShowInForAll { get; set; }
    }

    public class CarouselItemDTO
    {
        public CarouselItemDTO(int categoryID, string categoryName, string imageUrl,
                              string categorySlug, string hierarchy, int level,
                              bool showInHome, int parentCategoryID)
        {
            this.CategoryID = categoryID;
            this.CategoryName = categoryName;
            this.ImageUrl = imageUrl;
            this.CategorySlug = categorySlug;
            this.Hierarchy = hierarchy;
            this.Level = level;
            this.ShowInHome = showInHome;
            this.ParentCategoryID = parentCategoryID;
        }
        public int CategoryID { get; set; }
        public string CategoryName { get; set; }
        public string ImageUrl { get; set; }
        public string CategorySlug { get; set; }
        public string Hierarchy { get; set; }
        public int Level { get; set; }
        public bool ShowInHome { get; set; }
        public int ParentCategoryID { get; set; }
    }

    public class CategoryInfoDTO
    {
        public CategoryInfoDTO(int categoryID, string name, string imageUrl,
                              int? parentCategoryID, string slug, string hierarchy,
                              int level, bool hasDirectChildren, string navigationType)
        {
            this.CategoryID = categoryID;
            this.Name = name;
            this.ImageUrl = imageUrl;
            this.ParentCategoryID = parentCategoryID;
            this.Slug = slug;
            this.Hierarchy = hierarchy;
            this.Level = level;
            this.HasDirectChildren = hasDirectChildren;
            this.NavigationType = navigationType;
        }
        public int CategoryID { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public int? ParentCategoryID { get; set; }
        public string Slug { get; set; }
        public string Hierarchy { get; set; }
        public int Level { get; set; }
        public bool HasDirectChildren { get; set; }
        public string NavigationType { get; set; }
    }

    public class CategoryItemDTO
    {
        public CategoryItemDTO(int categoryID, string name, string imageUrl,
                              string slug, string hierarchy, int level)
        {
            this.CategoryID = categoryID;
            this.Name = name;
            this.ImageUrl = imageUrl;
            this.Slug = slug;
            this.Hierarchy = hierarchy;
            this.Level = level;
        }
        public int CategoryID { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public string Slug { get; set; }
        public string Hierarchy { get; set; }
        public int Level { get; set; }
    }

    public class RandomProductDTO
    {
        public RandomProductDTO(int productID, string productName, string description, decimal price, int quantity,
                               decimal rating, int totalReviews, string categoryName,
                               string categorySlug, string imageUrl)
        {
            this.ProductID = productID;
            this.ProductName = productName;
            this.Description = description;
            this.Price = price;
            this.Quantity = quantity;
            this.Rating = rating;
            this.TotalReviews = totalReviews;
            this.CategoryName = categoryName;
            this.CategorySlug = categorySlug;
            this.ImageUrl = imageUrl;
        }

        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal Rating { get; set; }
        public int TotalReviews { get; set; }
        public string CategoryName { get; set; }
        public string CategorySlug { get; set; }
        public string ImageUrl { get; set; }
    }

    public class CategoryNavigationResultDTO
    {
        public CategoryNavigationResultDTO(CategoryInfoDTO categoryInfo,
                                          List<CategoryItemDTO> directChildren,
                                          List<ProductWithCategoryDTO> categoryProducts,
                                          List<RandomProductDTO> randomProducts)
        {
            this.CategoryInfo = categoryInfo;
            this.DirectChildren = directChildren ?? new List<CategoryItemDTO>();
            this.CategoryProducts = categoryProducts ?? new List<ProductWithCategoryDTO>();
            this.RandomProducts = randomProducts ?? new List<RandomProductDTO>();
        }

        public CategoryInfoDTO CategoryInfo { get; set; }
        public List<CategoryItemDTO> DirectChildren { get; set; }
        public List<ProductWithCategoryDTO> CategoryProducts { get; set; }
        public List<RandomProductDTO> RandomProducts { get; set; }
    }


    public class CategorySidebarDTO
    {
        public CategorySidebarDTO(int categoryID, string categoryName, string CategorySlug,
                             string hierarchy, int level, bool showInHome, bool showInForAll, 
                             int? parentCategoryID, string categoryImageUrl, string HomepageImageUrl, 
                             string CarouselImageUrl, string carouselAltText)
        {
            this.CategoryID = categoryID;
            this.CategoryName = categoryName;
            this.CategorySlug = CategorySlug;
            this.Hierarchy = hierarchy;
            this.Level = level;
            this.ShowInHome = showInHome;
            this.ShowInForAll = showInForAll;
            this.ParentCategoryID = parentCategoryID;
            this.CategoryImageUrl = categoryImageUrl;
            this.HomepageImageUrl = HomepageImageUrl;
            this.CarouselImageUrl = CarouselImageUrl;
            this.carouselAltText = carouselAltText;
        }
        public int CategoryID { get; set; }
        public string CategoryName { get; set; }
        public string CategorySlug { get; set; }
        public string Hierarchy { get; set; }
        public int Level { get; set; }
        public bool ShowInHome { get; set; }
        public bool ShowInForAll { get; set; }
        public int? ParentCategoryID { get; set; }
        public string CategoryImageUrl { get; set; }
        public string? HomepageImageUrl { get; set; } 
        public string? CarouselImageUrl { get; set; }
        public string? carouselAltText { get; set; }
    }

    public class WishlistDTO
    {
        public WishlistDTO(int wishlistID, int userID, int productID, string productName,
                             string? description, decimal price, int quantity, decimal? rating, int? totalReviews,
                             string? imageUrl, DateTime addedToWishlistAt)
        {
            this.WishlistID = wishlistID;
            this.UserID = userID;
            this.ProductID = productID;
            this.ProductName = productName;
            this.description = description;
            this.Price = price;
            this.Quantity = quantity; 
            this.Rating = rating;
            this.totalReviews = totalReviews;
            this.imageUrl = imageUrl;
            this.AddedToWishlistAt = addedToWishlistAt;
        }
        public int WishlistID { get; set; }
        public int UserID { get; set; }
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public string? description { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; } 
        public decimal? Rating { get; set; }
        public int? totalReviews { get; set; }
        public string? imageUrl { get; set; }
        public DateTime AddedToWishlistAt { get; set; }
    }

    public class RegisterUserDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } = "User";
    }

    public class RegisterUserResultDTO
    {
        public int Success { get; set; }
        public string Message { get; set; }
        public int? NewUserID { get; set; }
    }


    // cart    
    public class CartSummaryDTO
    {
        public int TotalQuantity { get; set; }
        public decimal TotalPrice { get; set; }
    }


    public class CartDTO
    {
        public CartDTO(int productID, string productName, int quantity, decimal price, decimal subtotal,
                             string imageUrl, string altText, int availableQuantity)
        {
            this.ProductID = productID;
            this.ProductName = productName;
            this.Quantity = quantity;
            this.Price = price;
            this.Subtotal = subtotal;
            this.ImageUrl = imageUrl;
            this.AltText = altText;
            this.AvailableQuantity = availableQuantity;
        }
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Subtotal { get; set; }
        public string ImageUrl { get; set; }
        public string AltText { get; set; }
        public int AvailableQuantity { get; set; }
    }

  
    // wishlist
    public class WishlistCountDTO
    {
        public int WishlistCount { get; set; }
    }

    public class RegisterReqDTO
    {
        public RegisterReqDTO()
        {
        }
        public RegisterReqDTO(string firstName, string lastName, string email, string password)
        {
            this.FirstName = firstName;
            this.LastName = lastName;
            this.Email = email;
            this.Password = password;
        }

        [Required(ErrorMessage = "First name is required")]
        [StringLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
        public string FirstName { get; set; }


        [Required(ErrorMessage = "Last name is required")]
        [StringLength(50, ErrorMessage = "Last name cannot exceed 50 characters")]
        public string LastName { get; set; }


        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
        public string Email { get; set; }


        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be between 8 and 100 characters")]
        public string Password { get; set; } // Plain password from front-end (will be hashed in business layer)
    }

    public class RegisterResDTO
    {
        public RegisterResDTO(int newUserID, bool success, string message)
        {
            this.NewUserID = newUserID;
            this.Success = success;
            this.Message = message;
        }
        public int NewUserID { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    // ============================================
    // UNIFIED API RESPONSE (Used by ALL endpoints)
    // ============================================
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }

        public ApiResponse(bool success, string message, T data)
        {
            Success = success;
            Message = message;
            Data = data;
        }
    }

    // ============================================
    // LOGIN DATA (Only returned on success)
    // ============================================
    public class LoginData
    {
        public int UserID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public bool IsEmailVerified { get; set; }
        public string Token { get; set; }
    }

    public class LoginReqDTO
    {
        public LoginReqDTO() { }
        public LoginReqDTO(string email, string password)
        {
            this.Email = email;
            this.Password = password; 
        }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
        public string Email { get; set; }


        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be between 8 and 100 characters")]
        public string Password { get; set; } 

    }

    public class LoginResDTO
        {
            public LoginResDTO(int userID, string firstName, string lastName, string email,
                              string role, bool isEmailVerified, string token, bool success, string message)
            {
                this.UserID = userID;
                this.FirstName = firstName;
                this.LastName = lastName;
                this.Email = email;
                this.Role = role;
                this.IsEmailVerified = isEmailVerified;
                this.Token = token;
                this.Success = success;
                this.Message = message;
            }

            public int UserID { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
            public string Role { get; set; }
            public bool IsEmailVerified { get; set; }
            public string Token { get; set; }
            public bool Success { get; set; }
            public string Message { get; set; }

            // Note: We DON'T return PasswordHash to frontend (security!)
            // Note: JWT Token will be added in Business Layer later
    }


    // Internal DTO - used between DAL and Business Layer only
    public class LoginInternalDTO
    {
        public LoginInternalDTO(int userID, string firstName, string lastName, string email,
                                string passwordHash, string role, bool isEmailVerified,
                                bool success, string message)
        {
            this.UserID = userID;
            this.FirstName = firstName;
            this.LastName = lastName;
            this.Email = email;
            this.PasswordHash = passwordHash; // Only used internally
            this.Role = role;
            this.IsEmailVerified = isEmailVerified;
            this.Success = success;
            this.Message = message;
        }

        public int UserID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; } // For BCrypt verification
        public string Role { get; set; }
        public bool IsEmailVerified { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
    }

   // profile -page
    public class UserDashboardUserDTO
    {
        public UserDashboardUserDTO(int userId, string fullName, string email, string? profilePicture)
        {
            UserID = userId;
            FullName = fullName;
            Email = email;
            ProfilePicture = profilePicture;
        }
        public int UserID { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string? ProfilePicture { get; set; }
    }

    public class UserDashboardStatsDTO
    {
        public UserDashboardStatsDTO(int orders, int wishlist, int addresses)
        {
            Orders = orders;
            Wishlist = wishlist;
            Addresses = addresses;
        }
        public int Orders { get; set; }
        public int Wishlist { get; set; }
        public int Addresses { get; set; }
    }

    public class UserDashboardOrderDTO
    {
        public UserDashboardOrderDTO(int orderId, string orderNumber, decimal totalAmount, string status, DateTime createdAt, int itemsCount)
        {
            OrderID = orderId;
            OrderNumber = orderNumber;
            TotalAmount = totalAmount;
            Status = status;
            CreatedAt = createdAt;
            ItemsCount = itemsCount;
        }
        public int OrderID { get; set; }
        public string OrderNumber { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public int ItemsCount { get; set; }
    }

    public class UserDashboardDTO
    {
        public UserDashboardDTO(UserDashboardUserDTO user, UserDashboardStatsDTO stats, List<UserDashboardOrderDTO> recentOrders)
        {
            UserInfo = user;
            Stats = stats;
            RecentOrders = recentOrders;
        }
        public UserDashboardUserDTO UserInfo { get; set; }
        public UserDashboardStatsDTO Stats { get; set; }
        public List<UserDashboardOrderDTO> RecentOrders { get; set; }
    }

    public class UserPersonalInfoDTO
    {
        public UserPersonalInfoDTO(int userId, string firstName, string lastName, string fullName,
                                   string email, string phone, DateTime? dateOfBirth,
                                   string? profilePicture, DateTime createdAt, DateTime updatedAt)
        {
            UserID = userId;
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            Email = email;
            Phone = phone;
            DateOfBirth = dateOfBirth;
            ProfilePicture = profilePicture;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
        }
        public int UserID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? ProfilePicture { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
    public class UpdateUserPersonalInfoInputDTO
    {
        [StringLength(50, MinimumLength = 2, ErrorMessage = "First name must be between 2 and 50 characters")]
        public string? FirstName { get; set; }

        [StringLength(50, MinimumLength = 2, ErrorMessage = "Last name must be between 2 and 50 characters")]
        public string? LastName { get; set; }

        [Phone(ErrorMessage = "Invalid phone number")]
        [StringLength(20, ErrorMessage = "Phone cannot exceed 20 characters")]
        public string? Phone { get; set; }

        [DataType(DataType.Date)]
        public DateTime? DateOfBirth { get; set; }

        [StringLength(255, ErrorMessage = "Profile picture URL cannot exceed 255 characters")]
        public string? ProfilePicture { get; set; }
    }
    public class UpdatedUserPersonalInfoOutputDTO
    {
        public int UserID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? ProfilePicture { get; set; }
        public DateTime UpdatedAt { get; set; }

        public UpdatedUserPersonalInfoOutputDTO(
            int userID,
            string firstName,
            string lastName,
            string fullName,
            string email,
            string? phone,
            DateTime? dateOfBirth,
            string? profilePicture,
            DateTime updatedAt
        )
        {
            UserID = userID;
            FirstName = firstName;
            LastName = lastName;
            FullName = fullName;
            Email = email;
            Phone = phone;
            DateOfBirth = dateOfBirth;
            ProfilePicture = profilePicture;
            UpdatedAt = updatedAt;
        }
    }

    public class UserAddressDTO
    {
        public int AddressID { get; set; }
        public int UserID { get; set; }
        public string AddressType { get; set; }
        public string StreetAddress { get; set; }
        public string City { get; set; }
        public string? State { get; set; }
        public string? PostalCode { get; set; }
        public string Country { get; set; }
        public bool IsDefault { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public UserAddressDTO(
            int addressID,
            int userID,
            string addressType,
            string streetAddress,
            string city,
            string? state,
            string? postalCode,
            string country,
            bool isDefault,
            DateTime createdAt,
            DateTime? updatedAt
        )
        {
            AddressID = addressID;
            UserID = userID;
            AddressType = addressType;
            StreetAddress = streetAddress;
            City = city;
            State = state;
            PostalCode = postalCode;
            Country = country;
            IsDefault = isDefault;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
        }
    }
    
    public class AddUserAddressInputDTO
    {
        [StringLength(20, ErrorMessage = "Address type cannot exceed 20 characters")]
        public string? AddressType { get; set; }

        [Required(ErrorMessage = "Street address is required")]
        [StringLength(255, ErrorMessage = "Street address cannot exceed 255 characters")]
        public string StreetAddress { get; set; }

        [Required(ErrorMessage = "City is required")]
        [StringLength(100, ErrorMessage = "City cannot exceed 100 characters")]
        public string City { get; set; }

        [StringLength(100, ErrorMessage = "State cannot exceed 100 characters")]
        public string? State { get; set; }

        [StringLength(20, ErrorMessage = "Postal code cannot exceed 20 characters")]
        public string? PostalCode { get; set; }

        [StringLength(100, ErrorMessage = "Country cannot exceed 100 characters")]
        public string? Country { get; set; }
        public bool IsDefault { get; set; } = false;
    }

    public class AddUserAddressOutputDTO
    {
        public int AddressID { get; set; }
        public int UserID { get; set; }
        public string AddressType { get; set; }
        public string StreetAddress { get; set; }
        public string City { get; set; }
        public string? State { get; set; }
        public string? PostalCode { get; set; }
        public string Country { get; set; }
        public bool IsDefault { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public AddUserAddressOutputDTO(int addressID, int userID, string addressType, string streetAddress, string city,
            string? state, string? postalCode, string country, bool isDefault, DateTime createdAt, DateTime updatedAt)
        {
            AddressID = addressID;
            UserID = userID;
            AddressType = addressType;
            StreetAddress = streetAddress;
            City = city;
            State = state;
            PostalCode = postalCode;
            Country = country;
            IsDefault = isDefault;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
        }
    }

    public class UpdateUserAddressInputDTO
    {
        public string? AddressType { get; set; }
        public string? StreetAddress { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? PostalCode { get; set; }
        public string? Country { get; set; }
        public bool? IsDefault { get; set; }
    }

    public class UpdateUserAddressOutputDTO
    {
        public int AddressID { get; set; }
        public int UserID { get; set; }
        public string AddressType { get; set; }
        public string StreetAddress { get; set; }
        public string City { get; set; }
        public string? State { get; set; }
        public string? PostalCode { get; set; }
        public string Country { get; set; }
        public bool IsDefault { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public UpdateUserAddressOutputDTO(int addressID, int userID, string addressType, string streetAddress, string city,
            string? state, string? postalCode, string country, bool isDefault,
            DateTime createdAt, DateTime updatedAt)
        {
            AddressID = addressID;
            UserID = userID;
            AddressType = addressType;
            StreetAddress = streetAddress;
            City = city;
            State = state;
            PostalCode = postalCode;
            Country = country;
            IsDefault = isDefault;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
        }
    }

    public class DeleteAddressResponseDTO
    {
        public string Status { get; set; }
        public string Message { get; set; }

        public DeleteAddressResponseDTO(string status, string message)
        {
            Status = status;
            Message = message;
        }
    }

    public class GetUserOrdersOutputDTO
    {
        public int OrderId { get; set; }
        public string OrderNumber { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int ItemsCount { get; set; }
        public int TotalQuantity { get; set; }
    }

    public class OrderAddressDetailDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string StreetAddress { get; set; }
        public string City { get; set; }
        public string? State { get; set; }
        public string? PostalCode { get; set; }
        public string Country { get; set; }
    }

    public class OrderDetailsDTO
    {
        public int OrderID { get; set; }
        public int UserID { get; set; }
        public string OrderNumber { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal ShippingAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal FinalAmount { get; set; }
        public string? PromoCode { get; set; }
        public string? PaymentBrand { get; set; }
        public string? PaymentLast4 { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public List<OrderItemDTO> Items { get; set; }
        public OrderSummaryDTO Summary { get; set; }
        public OrderAddressDetailDTO Address { get; set; }
    }

    public class OrderItemDTO
    {
        public int OrderItemID { get; set; }
        public int OrderID { get; set; }
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Subtotal { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class OrderSummaryDTO
    {
        public int TotalItems { get; set; }
        public int TotalQuantity { get; set; }
        public decimal CalculatedTotal { get; set; }
    }

    //get user by email
    public class UserInternalDTO
    {
        public int UserId { get; set; }
        public string Email { get; set; }
    }

    //forget password
    public class PasswordResetTokenInternalDTO
    {
        public int TokenId { get; set; }
        public int UserId { get; set; }
        public DateTime ExpiryDate { get; set; }
        public bool IsUsed { get; set; }
    }

    
    //PaymentMethod
    public class UserPaymentMethodInternalDTO
    {
        public int PaymentMethodID { get; set; }
        public int UserID { get; set; }
        public string StripePaymentMethodId { get; set; }
        public string Brand { get; set; }
        public string CardLast4 { get; set; }
        public string CardHolderName { get; set; }
        public int ExpiryMonth { get; set; }
        public int ExpiryYear { get; set; }
        public bool IsDefault { get; set; }
    }


    public class AddUserPaymentMethodInputDTO
    {
        [Required]
        public string StripePaymentMethodId { get; set; } = null!;

        public bool IsDefault { get; set; } = false;

        [Required]
        public string Brand { get; set; } = null!;

        [Required]
        [StringLength(4, MinimumLength = 4)]
        public string CardLast4 { get; set; } = null!;

        [Required]
        public string CardHolderName { get; set; } = null!;

        [Required]
        [Range(1, 12)]
        public int ExpiryMonth { get; set; }

        [Required]
        [Range(2025, 2099)]
        public int ExpiryYear { get; set; }
    }

    public class UserPaymentMethodDTO
    {
        public int PaymentMethodID { get; set; }
        public string StripePaymentMethodId { get; set; } = null!;
        public string Brand { get; set; }
        public string Last4 { get; set; }
        public string CardHolderName { get; set; } = null!; 
        public int ExpMonth { get; set; }
        public int ExpYear { get; set; }
        public bool IsDefault { get; set; }
    }



    //checkout DTOs
    public class UserDTO
    {
        public UserDTO(int UserID, string FirstName, string LastName, string Email, string Phone)
        {
            this.UserID = UserID;
            this.FirstName = FirstName;
            this.LastName = LastName;
            this.Email = Email;
            this.Phone = Phone;
        }
        public int UserID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }
    }

    public class PaymentMethodDTO
    {
        public PaymentMethodDTO(int PaymentMethodID, string Brand, string CardLast4, string CardHolderName, 
                                int ExpiryMonth, int ExpiryYear, bool IsDefault)
        {
            this.PaymentMethodID = PaymentMethodID;
            this.Brand = Brand;
            this.CardLast4 = CardLast4; 
            this.CardHolderName = CardHolderName;
            this.ExpiryMonth = ExpiryMonth;
            this.ExpiryYear = ExpiryYear;
            this.IsDefault = IsDefault;
        }
        public int PaymentMethodID { get; set; }
        public string Brand { get; set; }
        public string CardLast4 { get; set; }
        public string CardHolderName { get; set; } 
        public int ExpiryMonth { get; set; }
        public int ExpiryYear { get; set; }
        public bool IsDefault { get; set; }
    }

    public class CheckoutInitDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }
        public UserAddressDTO? DefaultAddress { get; set; }
        public PaymentMethodDTO? DefaultPaymentMethod { get; set; }
    }



    public class CustomerDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }

    public class AddressDto
    {
        public string AddressType { get; set; }
        public string StreetAddress { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public string Country { get; set; }
    }

    public class OrderAddressDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string StreetAddress { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public string Country { get; set; }
    }

    public class PaymentDto
    {
       public string PaymentMethodId { get; set; }
       public string? PaymentBrand { get; set; } 
       public string? PaymentLast4 { get; set; } 
    }

    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class CreateOrderRequestDto
    {
        public CustomerDto Customer { get; set; }
        public AddressDto Address { get; set; }
        public OrderAddressDto OrderAddress { get; set; }
        public PaymentDto Payment { get; set; }
        public List<OrderItemDto> Items { get; set; }
        public string? PromoCode { get; set; }
    }

    public class CreateOrderResponseDto
    {
        public string PaymentIntentId { get; set; }
        public decimal FinalAmount { get; set; }
        public string ClientSecret { get; set; }
        public string OrderNumber { get; set; } 
        public decimal Subtotal { get; set; } 
        public decimal Shipping { get; set; } 
        public decimal Tax { get; set; } 
        public decimal Discount { get; set; }
    }


    // PromoCode DTOS
    public class PromoValidationResultDto
    {
        public PromoValidationResultDto(bool IsValid, string Message, Decimal DiscountAmount)
        {
            this.IsValid = IsValid;
            this.Message = Message;
            this.DiscountAmount = DiscountAmount;
        }
        public bool IsValid { get; set; }
        public string Message { get; set; } 
        public decimal DiscountAmount { get; set; }
    }

    public class PromoCodeDto
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public byte DiscountType { get; set; }
        public decimal DiscountValue { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public int? UsageLimit { get; set; }
        public int UsedCount { get; set; }
        public bool IsActive { get; set; }
        public decimal? MinimumOrderAmount { get; set; }
        public decimal? MaximumDiscountAmount { get; set; }
        public int? UserId { get; set; }
        public bool IsFirstOrderOnly { get; set; }
    }

    public class ValidatePromoDto
    {
        public string Code { get; set; }
        public decimal OrderTotal { get; set; }
    }


 

    public class EcommerceDataAccess
        {

        private static string _connectionString = "";

        public static void ConfigureConnectionString(string connectionString)
        {
            _connectionString = connectionString;
        }

        public static List<ProductDTO> GetTopRatedProducts(float minRating,int minReviews, int topCount)
        {
            var ProductList = new List<ProductDTO>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetTopRatedProducts", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@MinRating", minRating);
                    command.Parameters.AddWithValue("@MinReviews", minReviews);
                    command.Parameters.AddWithValue("@TopCount", topCount);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            ProductList.Add(new ProductDTO
                            (
                                reader.GetInt32(reader.GetOrdinal("ProductID")),
                                reader.GetString(reader.GetOrdinal("Name")),
                                reader.GetString(reader.GetOrdinal("Description")),
                                reader.GetDecimal(reader.GetOrdinal("Price")),
                                reader.GetInt32(reader.GetOrdinal("Quantity")),
                                reader.GetDecimal(reader.GetOrdinal("Rating")),
                                reader.GetInt32(reader.GetOrdinal("TotalReviews")),
                                reader.GetString(reader.GetOrdinal("ImageUrl"))
                            ));
                        }
                    }
                }
                return ProductList;
            }
        }


        public static ProductImagesDTO GetProductImages(int ProductID)
        {
            var result = new ProductImagesDTO();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetProductImages", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ProductID", ProductID);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            string imageUrl = reader.GetString(reader.GetOrdinal("ImageUrl"));
                            string type = reader.GetString(reader.GetOrdinal("ImageType"));

                            if (type == "thumb")
                                result.Thumbs.Add(imageUrl);
                            else if (type == "full")
                                result.Fulls.Add(imageUrl);
                        }
                    }
                }
            }

            return result;
        }


        public static List<string> GetProductThumbnails(int ProductID)
        {
            var ProductThumbnailsList = new List<string>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetProductThumbnails", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ProductID", ProductID);
                    command.Parameters.AddWithValue("@IsThumbnail", true);
   

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            ProductThumbnailsList.Add(reader.GetString(reader.GetOrdinal("ImageUrl")));
                        }
                    }
                }
                return ProductThumbnailsList;
            }

        }

        public static List<ImagesDTO> GetHomeFashionImages(string sectionName)
        {
            var ImagesList = new List<ImagesDTO>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetHomeFashionImages", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@SectionName", sectionName);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            int displayOrder = reader.IsDBNull(reader.GetOrdinal("DisplayOrder"))
                                              ? 0
                                              : reader.GetInt32(reader.GetOrdinal("DisplayOrder"));

                            string altText = reader.IsDBNull(reader.GetOrdinal("AltText"))
                                              ? string.Empty
                                              : reader.GetString(reader.GetOrdinal("AltText"));

                            string SectionName = reader.IsDBNull(reader.GetOrdinal("SectionName"))
                                              ? string.Empty
                                              : reader.GetString(reader.GetOrdinal("SectionName"));

                            ImagesList.Add(new ImagesDTO
                            (
                                displayOrder, 
                                reader.GetString(reader.GetOrdinal("ImageUrl")), 
                                altText, 
                                SectionName,
                                reader.GetString(reader.GetOrdinal("Slug"))
                            ));
                        }
                    }
                }
                return ImagesList;
            }
        }

        public static List<ProductWithCategoryDTO> GetProductWithCategory(string slug)
        {
            var ProductWithCategoryList = new List<ProductWithCategoryDTO>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetProductsByCategorySluggggg", connection)) 
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Slug", slug);
                    

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            ProductWithCategoryList.Add(new ProductWithCategoryDTO
                            (
                                  reader.IsDBNull(reader.GetOrdinal("ProductID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ProductID")),
                                  reader.IsDBNull(reader.GetOrdinal("ProductName")) ? null : reader.GetString(reader.GetOrdinal("ProductName")),
                                  reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                                  reader.IsDBNull(reader.GetOrdinal("Price")) ? 0m : reader.GetDecimal(reader.GetOrdinal("Price")),
                                  reader.IsDBNull(reader.GetOrdinal("Quantity")) ? 0 : reader.GetInt32(reader.GetOrdinal("Quantity")),
                                  reader.IsDBNull(reader.GetOrdinal("Rating")) ? 0m : reader.GetDecimal(reader.GetOrdinal("Rating")),
                                  reader.IsDBNull(reader.GetOrdinal("TotalReviews")) ? 0 : reader.GetInt32(reader.GetOrdinal("TotalReviews")),
                                  reader.IsDBNull(reader.GetOrdinal("CategoryImage")) ? null : reader.GetString(reader.GetOrdinal("CategoryImage")),
                                  reader.IsDBNull(reader.GetOrdinal("CategoryName")) ? null : reader.GetString(reader.GetOrdinal("CategoryName")),
                                  reader.IsDBNull(reader.GetOrdinal("CategorySlug")) ? null : reader.GetString(reader.GetOrdinal("CategorySlug")),
                                  reader.IsDBNull(reader.GetOrdinal("CreatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                                  reader.IsDBNull(reader.GetOrdinal("UpdatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("UpdatedAt")),
                                  reader.IsDBNull(reader.GetOrdinal("ProductImageUrl")) ? null : reader.GetString(reader.GetOrdinal("ProductImageUrl"))
                            ));
                        }
                    }
                }
                return ProductWithCategoryList;
            }
        }

        //pagination
        public static PagedProductsDTO GetPagedProducts(int categoryID, int pageNumber, int pageSize)
        {
            var result = new PagedProductsDTO();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            using (SqlCommand command = new SqlCommand("SP_GetCategoryProductsPaged", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.AddWithValue("@CategoryID", categoryID);
                command.Parameters.AddWithValue("@PageNumber", pageNumber);
                command.Parameters.AddWithValue("@PageSize", pageSize);

                connection.Open();

                using (SqlDataReader reader = command.ExecuteReader())
                {
                    // =========================
                    // RESULT SET 1 → PRODUCTS
                    // =========================
                    while (reader.Read())
                    {
                        result.Products.Add(
                            new ProductWithCategoryDTO(
                                reader.GetInt32(reader.GetOrdinal("ProductID")),
                                reader.GetString(reader.GetOrdinal("ProductName")),
                                reader.GetString(reader.GetOrdinal("Description")),
                                reader.GetDecimal(reader.GetOrdinal("Price")),
                                reader.GetInt32(reader.GetOrdinal("Quantity")),
                                reader.GetDecimal(reader.GetOrdinal("Rating")),
                                reader.GetInt32(reader.GetOrdinal("TotalReviews")),
                                null, // CategoryImage is not returned by the stored procedure
                                reader.GetString(reader.GetOrdinal("CategoryName")),
                                reader.GetString(reader.GetOrdinal("CategorySlug")),
                                reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                                reader.GetDateTime(reader.GetOrdinal("UpdatedAt")),
                                reader.GetString(reader.GetOrdinal("ProductImageUrl"))
                            )
                        );
                    }
                    // =========================
                    // RESULT SET 2 → PAGINATION
                    // =========================
                    if (reader.NextResult())
                    {
                        if (reader.Read())
                        {
                            result.Pagination = new PaginationInfoDTO
                            {
                                CurrentPage = reader.GetInt32(reader.GetOrdinal("CurrentPage")),
                                PageSize = reader.GetInt32(reader.GetOrdinal("PageSize")),
                                TotalProducts = reader.GetInt32(reader.GetOrdinal("TotalProducts")),
                                TotalPages = reader.GetInt32(reader.GetOrdinal("TotalPages")),
                                HasPreviousPage = reader.GetBoolean(reader.GetOrdinal("HasPreviousPage")),
                                HasNextPage = reader.GetBoolean(reader.GetOrdinal("HasNextPage"))
                            };
                        }
                    }
                }
            }

            return result;
        }

        // Search feature
        // phase-1 with pagination
        public static PagedProductsDTO GetSearchedProducts(string searchTerm, int pageNumber, int pageSize)
        {
            var result = new PagedProductsDTO();
           
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_SearchProducts", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@SearchTerm", searchTerm);
                    command.Parameters.AddWithValue("@PageNumber", pageNumber);
                    command.Parameters.AddWithValue("@PageSize", pageSize);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        // =========================
                        // RESULT SET 1 → PRODUCTS
                        // =========================
                        while (reader.Read())
                        {
                            result.Products.Add(
                                new ProductWithCategoryDTO(
                                     reader.IsDBNull(reader.GetOrdinal("ProductID")) ? 0 : reader.GetInt32(reader.GetOrdinal("ProductID")),
                                     reader.IsDBNull(reader.GetOrdinal("ProductName")) ? null : reader.GetString(reader.GetOrdinal("ProductName")),
                                     reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                                     reader.IsDBNull(reader.GetOrdinal("Price")) ? 0m : reader.GetDecimal(reader.GetOrdinal("Price")),
                                     reader.IsDBNull(reader.GetOrdinal("Quantity")) ? 0 : reader.GetInt32(reader.GetOrdinal("Quantity")),
                                     reader.IsDBNull(reader.GetOrdinal("Rating")) ? 0m : reader.GetDecimal(reader.GetOrdinal("Rating")),
                                     reader.IsDBNull(reader.GetOrdinal("TotalReviews")) ? 0 : reader.GetInt32(reader.GetOrdinal("TotalReviews")),
                                     reader.IsDBNull(reader.GetOrdinal("CategoryImage")) ? null : reader.GetString(reader.GetOrdinal("CategoryImage")),
                                     reader.IsDBNull(reader.GetOrdinal("CategoryName")) ? null : reader.GetString(reader.GetOrdinal("CategoryName")),
                                     reader.IsDBNull(reader.GetOrdinal("CategorySlug")) ? null : reader.GetString(reader.GetOrdinal("CategorySlug")),
                                     reader.IsDBNull(reader.GetOrdinal("CreatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                                     reader.IsDBNull(reader.GetOrdinal("UpdatedAt")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("UpdatedAt")),
                                     null
                                )
                            );
                        }
                        // =========================
                        // RESULT SET 2 → PAGINATION
                        // =========================
                        if (reader.NextResult())
                        {
                            if (reader.Read())
                            {
                                result.Pagination = new PaginationInfoDTO
                                {
                                    CurrentPage = reader.GetInt32(reader.GetOrdinal("CurrentPage")),
                                    PageSize = reader.GetInt32(reader.GetOrdinal("PageSize")),
                                    TotalProducts = reader.GetInt32(reader.GetOrdinal("TotalProducts")),
                                    TotalPages = reader.GetInt32(reader.GetOrdinal("TotalPages")),
                                    HasPreviousPage = reader.GetBoolean(reader.GetOrdinal("HasPreviousPage")),
                                    HasNextPage = reader.GetBoolean(reader.GetOrdinal("HasNextPage"))
                                };
                            }
                        }
                    }

                }
            }
            return result;
        }

        //phase-2
        public static List<SearchSuggestionDTO> GetSearchSuggestions(string searchTerm)
        {
            var SuggestionsList = new List<SearchSuggestionDTO>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetSearchSuggestions", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@SearchTerm", searchTerm);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            SuggestionsList.Add(
                                new SearchSuggestionDTO
                                (
                                    reader.IsDBNull(reader.GetOrdinal("SuggestionText"))
                                        ? null
                                        : reader.GetString(reader.GetOrdinal("SuggestionText"))
                                )
                            );
                        }
                    }
                }
            }
            return SuggestionsList;
        }


        public static List<HomeSectionDTO> GetHomeSectionsWithSlugs()
        {
            var HomeSectionList = new List<HomeSectionDTO>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetHomeSectionsWithSlugs", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            HomeSectionList.Add(new HomeSectionDTO
                            (
                                reader.GetString(reader.GetOrdinal("SectionName")),
                                reader.GetString(reader.GetOrdinal("Slug")),
                                reader.GetInt32(reader.GetOrdinal("DisplayOrder"))
                            ));
                        }
                    }
                }
                return HomeSectionList;
            }
        }

        public static List<HomeSectionDTOO> GetHomePageSections()
        {
            var HomeSectionList = new List<HomeSectionDTOO>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetHomePageSections", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            HomeSectionList.Add(new HomeSectionDTOO
                            (
                                reader.GetInt32(reader.GetOrdinal("CategoryID")),
                                reader.GetString(reader.GetOrdinal("SectionName")),
                                reader.IsDBNull(reader.GetOrdinal("SectionImage")) ? string.Empty : reader.GetString(reader.GetOrdinal("SectionImage")),
                                reader.GetString(reader.GetOrdinal("SectionSlug")),
                                reader.GetString(reader.GetOrdinal("Hierarchy")),
                                reader.GetInt32(reader.GetOrdinal("Level")),
                                reader.GetBoolean(reader.GetOrdinal("ShowInHome")),
                                reader.GetBoolean(reader.GetOrdinal("ShowInForAll"))
                            ));
                        }
                    }
                }
                return HomeSectionList;
            }
        }

        public static List<CarouselItemDTO> GetHomeSectionCarousel(string sectionSlug)
        {
            var CarouselItemList = new List<CarouselItemDTO>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetHomeSectionCarousel", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@SectionSlug", sectionSlug);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            CarouselItemList.Add(new CarouselItemDTO
                            (
                                reader.GetInt32(reader.GetOrdinal("CategoryID")),
                                reader.GetString(reader.GetOrdinal("CategoryName")),
                                reader.IsDBNull(reader.GetOrdinal("ImageUrl")) ? string.Empty : reader.GetString(reader.GetOrdinal("ImageUrl")),
                                reader.GetString(reader.GetOrdinal("CategorySlug")),
                                reader.GetString(reader.GetOrdinal("Hierarchy")),
                                reader.GetInt32(reader.GetOrdinal("Level")),
                                reader.GetBoolean(reader.GetOrdinal("ShowInHome")),
                                reader.GetInt32(reader.GetOrdinal("ParentCategoryID"))
                            ));
                        }
                    }
                }
                return CarouselItemList;
            }
        }

        
        public static CategoryNavigationResultDTO GetCategoryNavigationData(string slugPath, string navigationType = "AUTO")
        {
            CategoryInfoDTO categoryInfo = null;
            var directChildren = new List<CategoryItemDTO>();
            var categoryProducts = new List<ProductWithCategoryDTO>();
            var randomProducts = new List<RandomProductDTO>();
            
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetCategoryNavigationDataFinal", connection))
                {

                    command.CommandType = CommandType.StoredProcedure;

                    slugPath = Uri.UnescapeDataString(slugPath).Trim();                    
                    command.Parameters.AddWithValue("@SlugPath", slugPath);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            string dataType = reader.IsDBNull(reader.GetOrdinal("DataType"))
                                ? ""
                                : reader.GetString(reader.GetOrdinal("DataType"));

                            if (dataType == "error")
                            {
                                string errorMsg = reader.GetString(reader.GetOrdinal("ErrorMessage"));
                                throw new Exception(errorMsg); 
                            }

                            categoryInfo = new CategoryInfoDTO
                            (
                                reader.GetInt32(reader.GetOrdinal("CategoryID")),
                                reader.GetString(reader.GetOrdinal("Name")),
                                reader.IsDBNull(reader.GetOrdinal("ImageUrl")) ? string.Empty : reader.GetString(reader.GetOrdinal("ImageUrl")),
                                reader.IsDBNull(reader.GetOrdinal("ParentCategoryID")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("ParentCategoryID")),
                                reader.GetString(reader.GetOrdinal("Slug")),
                                reader.GetString(reader.GetOrdinal("Hierarchy")),
                                reader.GetInt32(reader.GetOrdinal("Level")),
                                reader.GetBoolean(reader.GetOrdinal("HasDirectChildren")),
                                reader.GetString(reader.GetOrdinal("NavigationType"))
                            ); 
                        }

                        // Move to Second Result Set
                        if (reader.NextResult())
                        {
                            string dataType = "";
                            if (reader.Read())
                            {
                                dataType = reader.GetString(reader.GetOrdinal("DataType"));

                                reader.Close();

                                using (SqlCommand command2 = new SqlCommand("SP_GetCategoryNavigationDataFinal", connection))
                                {
                                    command2.CommandType = CommandType.StoredProcedure;
                                    command2.Parameters.AddWithValue("@SlugPath", slugPath);
                                    command2.Parameters.AddWithValue("@NavigationType", navigationType);

                                    using (SqlDataReader reader2 = command2.ExecuteReader())
                                    {
                                        // Skip first result set
                                        reader2.NextResult();

                                        if (dataType == "direct_children")
                                        {
                                            // Read Direct Children
                                            while (reader2.Read())
                                            {
                                                directChildren.Add(new CategoryItemDTO
                                                (
                                                    reader2.GetInt32(reader2.GetOrdinal("CategoryID")),
                                                    reader2.GetString(reader2.GetOrdinal("Name")),
                                                    reader2.IsDBNull(reader2.GetOrdinal("ImageUrl")) ? string.Empty : reader2.GetString(reader2.GetOrdinal("ImageUrl")),
                                                    reader2.GetString(reader2.GetOrdinal("Slug")),
                                                    reader2.GetString(reader2.GetOrdinal("Hierarchy")),
                                                    reader2.GetInt32(reader2.GetOrdinal("Level"))
                                                ));
                                            }
                                        }
                                        else if (dataType == "category_products")
                                        {
                                            // Read Category Products
                                            while (reader2.Read())
                                            {
                                                categoryProducts.Add(new ProductWithCategoryDTO
                                                (
                                                    reader2.IsDBNull(reader2.GetOrdinal("ProductID")) ? 0 : reader2.GetInt32(reader2.GetOrdinal("ProductID")),
                                                    reader2.IsDBNull(reader2.GetOrdinal("ProductName")) ? null : reader2.GetString(reader2.GetOrdinal("ProductName")),
                                                    reader2.IsDBNull(reader2.GetOrdinal("Description")) ? null : reader2.GetString(reader2.GetOrdinal("Description")),
                                                    reader2.IsDBNull(reader2.GetOrdinal("Price")) ? 0m : reader2.GetDecimal(reader2.GetOrdinal("Price")),
                                                    reader2.IsDBNull(reader2.GetOrdinal("Quantity")) ? 0 : reader2.GetInt32(reader2.GetOrdinal("Quantity")),
                                                    reader2.IsDBNull(reader2.GetOrdinal("Rating")) ? 0m : reader2.GetDecimal(reader2.GetOrdinal("Rating")),
                                                    reader2.IsDBNull(reader2.GetOrdinal("TotalReviews")) ? 0 : reader2.GetInt32(reader2.GetOrdinal("TotalReviews")),
                                                    reader2.IsDBNull(reader2.GetOrdinal("CategoryImage")) ? null : reader2.GetString(reader2.GetOrdinal("CategoryImage")),
                                                    reader2.IsDBNull(reader2.GetOrdinal("CategoryName")) ? null : reader2.GetString(reader2.GetOrdinal("CategoryName")),
                                                    reader2.IsDBNull(reader2.GetOrdinal("CategorySlug")) ? null : reader2.GetString(reader2.GetOrdinal("CategorySlug")),
                                                    reader2.IsDBNull(reader2.GetOrdinal("CreatedAt")) ? DateTime.MinValue : reader2.GetDateTime(reader2.GetOrdinal("CreatedAt")),
                                                    reader2.IsDBNull(reader2.GetOrdinal("UpdatedAt")) ? DateTime.MinValue : reader2.GetDateTime(reader2.GetOrdinal("UpdatedAt")),
                                                    reader2.IsDBNull(reader2.GetOrdinal("ProductImageUrl")) ? null : reader2.GetString(reader2.GetOrdinal("ProductImageUrl"))
                                                ));
                                            }
                                        }

                                        // Move to Third Result Set (Random Products)
                                        if (reader2.NextResult())
                                        {
                                            while (reader2.Read())
                                            {
                                                randomProducts.Add(new RandomProductDTO
                                                (
                                                    reader2.GetInt32(reader2.GetOrdinal("ProductID")),
                                                    reader2.GetString(reader2.GetOrdinal("ProductName")),
                                                    reader2.IsDBNull(reader2.GetOrdinal("Description")) ? string.Empty : reader2.GetString(reader2.GetOrdinal("Description")),
                                                    reader2.GetDecimal(reader2.GetOrdinal("Price")),
                                                    reader2.GetInt32(reader2.GetOrdinal("Quantity")),
                                                    reader2.GetDecimal(reader2.GetOrdinal("Rating")),
                                                    reader2.GetInt32(reader2.GetOrdinal("TotalReviews")),
                                                    reader2.GetString(reader2.GetOrdinal("CategoryName")),
                                                    reader2.GetString(reader2.GetOrdinal("CategorySlug")),
                                                    reader2.IsDBNull(reader2.GetOrdinal("ImageUrl")) ? string.Empty : reader2.GetString(reader2.GetOrdinal("ImageUrl"))
                                                ));
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return new CategoryNavigationResultDTO(categoryInfo, directChildren, categoryProducts, randomProducts);
        }
         

        public static List<CategorySidebarDTO> GetCategorySidebar()
        {
            var CategorySidebarList = new List<CategorySidebarDTO>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetCategorySidebar", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            CategorySidebarList.Add(new CategorySidebarDTO
                            (
                                reader.GetInt32(reader.GetOrdinal("CategoryID")),
                                reader.GetString(reader.GetOrdinal("CategoryName")),
                                reader.GetString(reader.GetOrdinal("CategorySlug")),
                                reader.GetString(reader.GetOrdinal("Hierarchy")),
                                reader.GetInt32(reader.GetOrdinal("Level")),
                                reader.GetBoolean(reader.GetOrdinal("ShowInHome")),
                                reader.GetBoolean(reader.GetOrdinal("ShowInForAll")),
                                reader.IsDBNull(reader.GetOrdinal("ParentCategoryID")) ? (int?) null : reader.GetInt32(reader.GetOrdinal("ParentCategoryID")),
                                reader.IsDBNull(reader.GetOrdinal("CategoryImageUrl")) ? null : reader.GetString(reader.GetOrdinal("CategoryImageUrl")),
                                reader.IsDBNull(reader.GetOrdinal("HomepageImageUrl")) ? null : reader.GetString(reader.GetOrdinal("HomepageImageUrl")),
                                reader.IsDBNull(reader.GetOrdinal("CarouselImageUrl")) ? null : reader.GetString(reader.GetOrdinal("CarouselImageUrl")),
                                reader.IsDBNull(reader.GetOrdinal("carouselAltText")) ? null : reader.GetString(reader.GetOrdinal("carouselAltText"))
                                
                            ));
                        }
                    }
                }
                return CategorySidebarList;
            }
        }


        public static ProductDTO GetProductById(int ProductID)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetProductById", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ProductID", ProductID);
                  
                    connection.Open();

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return (new ProductDTO
                            (
                               reader.GetInt32(reader.GetOrdinal("ProductID")),
                               reader.GetString(reader.GetOrdinal("Name")),
                               reader.IsDBNull(reader.GetOrdinal("Description")) ? (string ?)null : reader.GetString(reader.GetOrdinal("Description")),
                               reader.GetDecimal(reader.GetOrdinal("Price")),
                               reader.GetInt32(reader.GetOrdinal("Quantity")),
                               reader.IsDBNull(reader.GetOrdinal("Rating")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("Rating")), 
                               reader.IsDBNull(reader.GetOrdinal("TotalReviews")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("TotalReviews")) 
                            ));
                        }
                    }
                }
                return null;
            }
        }


        // wishlist
        public static WishlistCountDTO GetWishlistCount(int UserID)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetWishlistCount", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserID", UserID);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new WishlistCountDTO
                            {
                                WishlistCount = reader.GetInt32(reader.GetOrdinal("WishlistCount")),
                            };
                        }
                    }
                }
            }
            return new WishlistCountDTO {WishlistCount = 0};
        }


        public static List<WishlistDTO> GetWishlistByUserID(int UserID)
        {
            var WishlistList = new List<WishlistDTO>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetWishlistByUserID", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserID", UserID);
                   

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            WishlistList.Add(new WishlistDTO
                            (
                                reader.GetInt32(reader.GetOrdinal("WishlistID")),
                                reader.GetInt32(reader.GetOrdinal("UserID")),
                                reader.GetInt32(reader.GetOrdinal("ProductID")),
                                reader.GetString(reader.GetOrdinal("ProductName")),
                                reader.IsDBNull(reader.GetOrdinal("description")) ? (string?)null : reader.GetString(reader.GetOrdinal("description")),
                                reader.GetDecimal(reader.GetOrdinal("Price")),
                                reader.GetInt32(reader.GetOrdinal("Quantity")),
                                reader.IsDBNull(reader.GetOrdinal("Rating")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("Rating")), 
                                reader.IsDBNull(reader.GetOrdinal("totalReviews")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("totalReviews")), 
                                reader.IsDBNull(reader.GetOrdinal("imageUrl")) ? (string?)null : reader.GetString(reader.GetOrdinal("imageUrl")),
                                reader.GetDateTime(reader.GetOrdinal("AddedToWishlistAt")) 
                            ));
                        }
                    }
                }
                return WishlistList;
            }
        }


        public static bool IsProductInWishlist(int UserID, int ProductID)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_IsProductInWishlist", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserID", UserID);
                    command.Parameters.AddWithValue("@ProductID", ProductID);

                    connection.Open();

                    var result = command.ExecuteScalar();

                    return (Convert.ToInt32(result) == 1);

                }
            }
        }


        public static bool AddToWishlist(int UserID, int ProductID)
        {

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_AddToWishlist", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserID", UserID);
                    command.Parameters.AddWithValue("@ProductID", ProductID);

                    // Add a parameter to receive the stored procedure return value
                    var returnParameter = command.Parameters.Add("@ReturnVal", SqlDbType.Int);
                    returnParameter.Direction = ParameterDirection.ReturnValue;

                    connection.Open();
                    command.ExecuteNonQuery();

                    int result = (int)returnParameter.Value;

                    return (result == 1);
                }
            }
        }


        public static bool RemoveFromWishlist(int UserID, int ProductID)
        {

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_RemoveFromWishlist", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserID", UserID);
                    command.Parameters.AddWithValue("@ProductID", ProductID);

                    // Add a parameter to receive the stored procedure return value
                    var returnParameter = command.Parameters.Add("@ReturnVal", SqlDbType.Int);
                    returnParameter.Direction = ParameterDirection.ReturnValue;

                    connection.Open();

                    command.ExecuteNonQuery();

                    int ret = (returnParameter.Value != DBNull.Value) ? Convert.ToInt32(returnParameter.Value) : 0;
                    return ret == 1;
                }
            }
        }


        public static bool ClearWishlist(int UserID)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_ClearWishlist", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserID", UserID);

                    // Add a parameter to receive the stored procedure return value
                    var returnParameter = command.Parameters.Add("@ReturnVal", SqlDbType.Int);
                    returnParameter.Direction = ParameterDirection.ReturnValue;

                    connection.Open();

                    command.ExecuteNonQuery(); 

                    int ret = (returnParameter.Value != DBNull.Value) ? Convert.ToInt32(returnParameter.Value) : 0;
                    return ret == 1;

                }
            }

        }


        //cart
        public static CartSummaryDTO GetCartSummary(int UserID)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetCartSummary", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserID", UserID);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new CartSummaryDTO
                            {
                                TotalQuantity = reader.GetInt32(reader.GetOrdinal("TotalQuantity")),
                                TotalPrice = reader.GetDecimal(reader.GetOrdinal("TotalPrice"))
                            };
                        }
                    }
                }
            }
            return new CartSummaryDTO
            {
                TotalQuantity = 0,
                TotalPrice = 0m
            };

        }

        public static List<CartDTO> GetCartItemsByUserID(int UserID)
        {
            var CartList = new List<CartDTO>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetCartItemsByUserID", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserID", UserID);


                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            CartList.Add(new CartDTO
                            (
                                reader.GetInt32(reader.GetOrdinal("ProductID")),
                                reader.GetString(reader.GetOrdinal("ProductName")),
                                reader.GetInt32(reader.GetOrdinal("Quantity")),
                                reader.GetDecimal(reader.GetOrdinal("Price")),
                                reader.GetDecimal(reader.GetOrdinal("Subtotal")),
                                reader.IsDBNull(reader.GetOrdinal("ImageUrl")) ? (string?)null : reader.GetString(reader.GetOrdinal("ImageUrl")),
                                reader.GetString(reader.GetOrdinal("AltText")),
                                reader.GetInt32(reader.GetOrdinal("availableQuantity"))
                            ));
                        }
                    }
                }
                return CartList;
            }
        }

        public static object InsertUpdateCartItems(int UserID, int ProductID)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_InsertUpdateCartItems", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserID", UserID);
                    command.Parameters.AddWithValue("@ProductID", ProductID);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new
                            {
                                Action = reader.GetString(reader.GetOrdinal("Action")),
                                ProductID = reader.GetInt32(reader.GetOrdinal("ProductID"))
                            };
                        }
                    }
                }
            }
            return null;
        }


        public static object RemoveCartItem(int UserID, int ProductID)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_RemoveCartItem", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserID", UserID);
                    command.Parameters.AddWithValue("@ProductID", ProductID);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new
                            {
                                Action = reader.GetString(reader.GetOrdinal("Action")),
                                ProductID = reader.GetInt32(reader.GetOrdinal("ProductID"))
                            };
                        }
                    }
                }
            }
            return null;
        }


        public static object IncrementDecrementCartItem(int UserID, int ProductID, string Action)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_IncrementDecrementCartItem", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserID", UserID);
                    command.Parameters.AddWithValue("@ProductID", ProductID);
                    command.Parameters.AddWithValue("@Action", Action);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new
                            {
                                Action = reader.GetString(reader.GetOrdinal("Action")),
                                ProductID = reader.GetInt32(reader.GetOrdinal("ProductID")),
                                NewQuantity = reader.GetInt32(reader.GetOrdinal("NewQuantity")),
                            };
                        }
                    }
                }
            }
            return null;
        }


        public static bool ClearCart(int UserID)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_ClearCart", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserID", UserID);

                    // Add a parameter to receive the stored procedure return value
                    var returnParameter = command.Parameters.Add("@ReturnVal", SqlDbType.Int);
                    returnParameter.Direction = ParameterDirection.ReturnValue;

                    connection.Open();

                    command.ExecuteNonQuery();

                    int ret = (returnParameter.Value != DBNull.Value) ? Convert.ToInt32(returnParameter.Value) : 0;
                    return ret == 1;
                }
            }
        }

        public static bool CheckEmailExists(string email)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_CheckEmailExists", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Email", email);

                    connection.Open();

                    var result = command.ExecuteScalar();

                    return (Convert.ToInt32(result) == 1);
                }
            }
        }

        public static RegisterUserResultDTO RegisterUser(RegisterUserDTO dto)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            using (SqlCommand command = new SqlCommand("SP_RegisterUser", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.AddWithValue("@FirstName", dto.FirstName);
                command.Parameters.AddWithValue("@LastName", dto.LastName);
                command.Parameters.AddWithValue("@Email", dto.Email);
                command.Parameters.AddWithValue("@PasswordHash", dto.PasswordHash);
                command.Parameters.AddWithValue("@Role", dto.Role);

                connection.Open();

                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        bool hasNewUserID = false;
                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            if (reader.GetName(i).Equals("NewUserID", StringComparison.OrdinalIgnoreCase))
                            {
                                hasNewUserID = true;
                                break;
                            }
                        }

                        return new RegisterUserResultDTO
                        {
                            Success = reader.GetInt32(reader.GetOrdinal("Success")),
                            Message = reader.GetString(reader.GetOrdinal("Message")),
                            NewUserID = hasNewUserID && !reader.IsDBNull(reader.GetOrdinal("NewUserID"))
                                ? Convert.ToInt32(reader["NewUserID"])
                                : (int?)null
                        };
                    }
                }
            }

            // Fallback if no result is returned from the stored procedure
            return new RegisterUserResultDTO
            {
                Success = 0,
                Message = "Unexpected error while registering user",
                NewUserID = null
            };
        }


        public static RegisterResDTO Register(RegisterReqDTO RegisterDTO)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            using (SqlCommand command = new SqlCommand("SP_RegisterUserOLA", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.AddWithValue("@FirstName", RegisterDTO.FirstName);
                command.Parameters.AddWithValue("@LastName", RegisterDTO.LastName);
                command.Parameters.AddWithValue("@Email", RegisterDTO.Email);
                command.Parameters.AddWithValue("@PasswordHash", RegisterDTO.Password); 
                command.Parameters.AddWithValue("@Role", "User"); 

                connection.Open();

                using (SqlDataReader reader = command.ExecuteReader()) 
                {
                    if (reader.Read()) 
                    {
                        bool success = reader.GetInt32(reader.GetOrdinal("Success")) == 1;
                        return (new RegisterResDTO(
                        reader.GetInt32(reader.GetOrdinal("NewUserID")),
                        success,
                        reader.GetString(reader.GetOrdinal("Message"))
                        ));
                    }else
                    {
                        return (new RegisterResDTO(
                        0,
                        false,
                        "Unexpected error occurred while registering the user."
                        ));
                    }
                }
            }
        }
        

        public static LoginInternalDTO Login(LoginReqDTO LoginDTO)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString)) 
            using (SqlCommand command = new SqlCommand("SP_LoginUserOLA", connection))
            {
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@Email", LoginDTO.Email);

                connection.Open();

                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        bool success = reader.GetInt32(reader.GetOrdinal("Success")) == 1;

                        if (!success)
                        {
                            return new LoginInternalDTO(
                                0, null, null, null, null, null, false, false,
                                reader.GetString(reader.GetOrdinal("Message"))
                            );
                        }

                        return new LoginInternalDTO(
                            reader.GetInt32(reader.GetOrdinal("UserID")),
                            reader.GetString(reader.GetOrdinal("FirstName")),
                            reader.GetString(reader.GetOrdinal("LastName")),
                            reader.GetString(reader.GetOrdinal("Email")),
                            reader.GetString(reader.GetOrdinal("PasswordHash")),
                            reader.GetString(reader.GetOrdinal("Role")),
                            reader.GetBoolean(reader.GetOrdinal("IsEmailVerified")),
                            true,
                            reader.GetString(reader.GetOrdinal("Message")) 
                        );
                    }
                    else
                    {
                        return new LoginInternalDTO( 
                            0, null, null, null, null, null, false, false,
                            "Unexpected error occurred during login."
                        );
                    }
                }
            }
        }

        // profile page
        public static UserDashboardDTO GetUserDashboard(int userId)
        {
            UserDashboardUserDTO userInfo = null;
            UserDashboardStatsDTO stats = null;
            var recentOrders = new List<UserDashboardOrderDTO>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetUserDashboard", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserID", userId);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        // ============================
                        // 1. User information
                        // ============================
                        if (reader.Read())
                        {
                            userInfo = new UserDashboardUserDTO
                            (
                                reader.GetInt32(reader.GetOrdinal("UserID")),
                                reader.GetString(reader.GetOrdinal("FullName")),
                                reader.GetString(reader.GetOrdinal("Email")),
                                reader.IsDBNull(reader.GetOrdinal("ProfilePicture"))
                                    ? string.Empty
                                    : reader.GetString(reader.GetOrdinal("ProfilePicture"))
                            );
                        }

                        // ============================
                        // 2. Statistics
                        // ============================
                        if (reader.NextResult() && reader.Read())
                        {
                            stats = new UserDashboardStatsDTO
                            (
                                reader.GetInt32(reader.GetOrdinal("Orders")),
                                reader.GetInt32(reader.GetOrdinal("Wishlist")),
                                reader.GetInt32(reader.GetOrdinal("Addresses"))
                            );
                        }

                        // ============================
                        //  3. Recent orders
                        // ============================
                        if (reader.NextResult())
                        {
                            while (reader.Read())
                            {                        
                                recentOrders.Add(new UserDashboardOrderDTO
                                (
                                    reader.GetInt32(reader.GetOrdinal("OrderID")),
                                    reader.GetString(reader.GetOrdinal("OrderNumber")),
                                    reader.GetDecimal(reader.GetOrdinal("TotalAmount")),
                                    reader.GetString(reader.GetOrdinal("Status")),
                                    reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                                    reader.GetInt32(reader.GetOrdinal("ItemsCount"))
                                ));
                            }
                        }
                    }
                }
            }
            return new UserDashboardDTO(userInfo, stats, recentOrders);
        }

        public static UserPersonalInfoDTO GetUserPersonalInfo(int userId)
        {
            UserPersonalInfoDTO userInfo = null;

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetUserPersonalInfo", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserID", userId);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            userInfo = new UserPersonalInfoDTO
                            (
                                reader.GetInt32(reader.GetOrdinal("UserID")),
                                reader.GetString(reader.GetOrdinal("FirstName")),
                                reader.GetString(reader.GetOrdinal("LastName")),
                                reader.GetString(reader.GetOrdinal("FullName")),
                                reader.GetString(reader.GetOrdinal("Email")),
                                reader.IsDBNull(reader.GetOrdinal("Phone")) ? "" : reader.GetString(reader.GetOrdinal("Phone")),
                                reader.IsDBNull(reader.GetOrdinal("DateOfBirth")) ? null : reader.GetDateTime(reader.GetOrdinal("DateOfBirth")),
                                reader.IsDBNull(reader.GetOrdinal("ProfilePicture")) ? "" : reader.GetString(reader.GetOrdinal("ProfilePicture")),
                                reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                                reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
                            );
                        }
                    }
                }
            }
            return userInfo;
        }

        public static UpdatedUserPersonalInfoOutputDTO UpdateUserPersonalInfo(int userId, UpdateUserPersonalInfoInputDTO model)
        {
            UpdatedUserPersonalInfoOutputDTO updatedUser = null;

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_UpdateUserPersonalInfo", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@UserID", userId);

                    command.Parameters.AddWithValue("@FirstName", (object?)model.FirstName ?? DBNull.Value);
                    command.Parameters.AddWithValue("@LastName", (object?)model.LastName ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Phone", (object?)model.Phone ?? DBNull.Value);
                    command.Parameters.AddWithValue("@DateOfBirth", (object?)model.DateOfBirth ?? DBNull.Value);
                    command.Parameters.AddWithValue("@ProfilePicture", (object?)model.ProfilePicture ?? DBNull.Value);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                        
                            updatedUser = new UpdatedUserPersonalInfoOutputDTO 
                            (
                                reader.GetInt32(reader.GetOrdinal("UserID")),
                                reader.GetString(reader.GetOrdinal("FirstName")),
                                reader.GetString(reader.GetOrdinal("LastName")),
                                reader.GetString(reader.GetOrdinal("FullName")),
                                reader.GetString(reader.GetOrdinal("Email")),
                                reader.IsDBNull(reader.GetOrdinal("Phone")) ? null : reader.GetString(reader.GetOrdinal("Phone")),
                                reader.IsDBNull(reader.GetOrdinal("DateOfBirth")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("DateOfBirth")),
                                reader.IsDBNull(reader.GetOrdinal("ProfilePicture")) ? null : reader.GetString(reader.GetOrdinal("ProfilePicture")),
                                reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
                            );
                        }
                    }
                }
            }
            return updatedUser;
        }

        public static List<UserAddressDTO> GetUserAddresses(int userId)
        {
            var addresses = new List<UserAddressDTO>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetUserAddresses", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserID", userId);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            addresses.Add(new UserAddressDTO(
                                reader.GetInt32(reader.GetOrdinal("AddressID")),
                                reader.GetInt32(reader.GetOrdinal("UserID")),
                                 reader.IsDBNull(reader.GetOrdinal("AddressType")) ? "home" : reader.GetString(reader.GetOrdinal("AddressType")),
                                reader.GetString(reader.GetOrdinal("StreetAddress")),
                                reader.GetString(reader.GetOrdinal("City")),
                                reader.IsDBNull(reader.GetOrdinal("State")) ? null : reader.GetString(reader.GetOrdinal("State")),
                                reader.IsDBNull(reader.GetOrdinal("PostalCode")) ? null : reader.GetString(reader.GetOrdinal("PostalCode")),
                                reader.IsDBNull(reader.GetOrdinal("Country")) ? "Egypt" : reader.GetString(reader.GetOrdinal("Country")),
                                reader.GetBoolean(reader.GetOrdinal("IsDefault")),
                                reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                                reader.IsDBNull(reader.GetOrdinal("UpdatedAt")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
                            ));
                        }
                    }
                }
            }
            return addresses;
        }

      
        public static AddUserAddressOutputDTO AddUserAddress(int userId, AddUserAddressInputDTO model)
        {
           AddUserAddressOutputDTO addedAddress = null;

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_AddUserAddress", connection))
                {
                     command.CommandType = CommandType.StoredProcedure;

                     command.Parameters.AddWithValue("@UserID", userId);
                     command.Parameters.AddWithValue("@AddressType", string.IsNullOrWhiteSpace(model.AddressType) ? (object)DBNull.Value : model.AddressType);
                     command.Parameters.AddWithValue("@StreetAddress", model.StreetAddress);
                     command.Parameters.AddWithValue("@City", model.City);
                     command.Parameters.AddWithValue("@State", string.IsNullOrWhiteSpace(model.State) ? (object)DBNull.Value : model.State);
                     command.Parameters.AddWithValue("@PostalCode", string.IsNullOrWhiteSpace(model.PostalCode) ? (object)DBNull.Value : model.PostalCode);
                     command.Parameters.AddWithValue("@Country", string.IsNullOrWhiteSpace(model.Country) ? (object)DBNull.Value : model.Country);
                     command.Parameters.AddWithValue("@IsDefault", model.IsDefault);

                     connection.Open();

                     using (SqlDataReader reader = command.ExecuteReader())
                     {
                          if (reader.Read())
                          {
                              addedAddress = new AddUserAddressOutputDTO(
                                  reader.GetInt32(reader.GetOrdinal("AddressID")),
                                  reader.GetInt32(reader.GetOrdinal("UserID")),
                                  reader.GetString(reader.GetOrdinal("AddressType")),
                                  reader.GetString(reader.GetOrdinal("StreetAddress")),
                                  reader.GetString(reader.GetOrdinal("City")),
                                  reader.IsDBNull(reader.GetOrdinal("State")) ? null : reader.GetString(reader.GetOrdinal("State")),
                                  reader.IsDBNull(reader.GetOrdinal("PostalCode")) ? null : reader.GetString(reader.GetOrdinal("PostalCode")),
                                  reader.GetString(reader.GetOrdinal("Country")),
                                  reader.GetBoolean(reader.GetOrdinal("IsDefault")),
                                  reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                                  reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
                              );
                          }
                     }
                }
            }
            return addedAddress;
        }


        public static UpdateUserAddressOutputDTO UpdateUserAddress(int userId, int addressId, UpdateUserAddressInputDTO model)
        {
            UpdateUserAddressOutputDTO updated = null;

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_UpdateUserAddress", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@AddressID", addressId);
                    command.Parameters.AddWithValue("@UserID", userId);

                    // Convert empty strings to DBNull
                    command.Parameters.AddWithValue("@AddressType",
                        string.IsNullOrWhiteSpace(model.AddressType) ? (object)DBNull.Value : model.AddressType);

                    command.Parameters.AddWithValue("@StreetAddress",
                        string.IsNullOrWhiteSpace(model.StreetAddress) ? (object)DBNull.Value : model.StreetAddress);

                    command.Parameters.AddWithValue("@City",
                        string.IsNullOrWhiteSpace(model.City) ? (object)DBNull.Value : model.City);

                    command.Parameters.AddWithValue("@State",
                        string.IsNullOrWhiteSpace(model.State) ? (object)DBNull.Value : model.State);

                    command.Parameters.AddWithValue("@PostalCode",
                        string.IsNullOrWhiteSpace(model.PostalCode) ? (object)DBNull.Value : model.PostalCode);

                    command.Parameters.AddWithValue("@Country",
                        string.IsNullOrWhiteSpace(model.Country) ? (object)DBNull.Value : model.Country);

                    command.Parameters.AddWithValue("@IsDefault",
                        model.IsDefault.HasValue ? (object)model.IsDefault.Value : DBNull.Value);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            if (reader.FieldCount == 2 && reader.GetName(0) == "Status")
                            {
                                string status = reader.GetString(reader.GetOrdinal("Status"));
                                if (status == "Error")
                                {
                                    string message = reader.GetString(reader.GetOrdinal("Message"));
                                    throw new UnauthorizedAccessException(message);
                                }
                                return null;
                            }
                            updated = new UpdateUserAddressOutputDTO(
                                reader.GetInt32(reader.GetOrdinal("AddressID")),
                                reader.GetInt32(reader.GetOrdinal("UserID")),
                                reader.IsDBNull(reader.GetOrdinal("AddressType")) ? "home" : reader.GetString(reader.GetOrdinal("AddressType")),
                                reader.GetString(reader.GetOrdinal("StreetAddress")),
                                reader.GetString(reader.GetOrdinal("City")),
                                reader.IsDBNull(reader.GetOrdinal("State")) ? null : reader.GetString(reader.GetOrdinal("State")),
                                reader.IsDBNull(reader.GetOrdinal("PostalCode")) ? null : reader.GetString(reader.GetOrdinal("PostalCode")),
                                reader.IsDBNull(reader.GetOrdinal("Country")) ? "Egypt" : reader.GetString(reader.GetOrdinal("Country")),
                                reader.GetBoolean(reader.GetOrdinal("IsDefault")),
                                reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                                reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
                            );
                        }
                    }
                }
            }

            if (updated == null)
            {
                throw new Exception("Failed to update address");
            }

            return updated;
        }

        public static DeleteAddressResponseDTO DeleteUserAddress(int userId, int addressId)
        {
            DeleteAddressResponseDTO response = null;

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_DeleteUserAddress", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@AddressID", addressId);
                    command.Parameters.AddWithValue("@UserID", userId);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            response = new DeleteAddressResponseDTO(
                                reader.GetString(reader.GetOrdinal("Status")),
                                reader.GetString(reader.GetOrdinal("Message"))
                            );
                        }
                    }
                }
            }

            if (response == null)
            {
                throw new Exception("Failed to delete address - no response from database");
            }

            if (response.Status == "Error")
            {
                throw new UnauthorizedAccessException(response.Message);
            }

            return response;
        }


        public static void UnsetDefaultAddress(int userId)
        {
            using SqlConnection conn = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("SP_UnsetDefaultAddress", conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserID", userId);

            conn.Open();
            cmd.ExecuteNonQuery();
        }


        public static List<GetUserOrdersOutputDTO> GetUserOrders(int userId)
        {
            List<GetUserOrdersOutputDTO> orders = new List<GetUserOrdersOutputDTO>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetUserOrders", conn))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserID", userId);

                    conn.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            orders.Add(new GetUserOrdersOutputDTO
                            {
                                OrderId = Convert.ToInt32(reader["OrderID"]),
                                OrderNumber = reader["OrderNumber"].ToString(),
                                TotalAmount = Convert.ToDecimal(reader["TotalAmount"]),
                                Status = reader["Status"].ToString(),
                                CreatedAt = Convert.ToDateTime(reader["CreatedAt"]),
                                UpdatedAt = Convert.ToDateTime(reader["UpdatedAt"]),
                                ItemsCount = Convert.ToInt32(reader["ItemsCount"]),
                                TotalQuantity = Convert.ToInt32(reader["TotalQuantity"])
                            });
                        }
                    }
                }
            }
            return orders;
        }

        public static OrderDetailsDTO GetOrderDetails(int orderId, int userId)
        {
            OrderDetailsDTO orderDetails = null;
            List<OrderItemDTO> items = new List<OrderItemDTO>();
            OrderSummaryDTO summary = null;

            using (SqlConnection connection = new SqlConnection(_connectionString))
            using (SqlCommand command = new SqlCommand("GetOrderDetails", connection))
            {
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@OrderID", orderId);
                command.Parameters.AddWithValue("@UserID", userId);

                connection.Open();
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    // 1. First result: order header or error
                    if (reader.Read())
                    {
                        // Check if error response
                        if (reader["Status"].ToString() == "Error")
                        {
                            throw new Exception(reader["Message"].ToString());
                        }

                        orderDetails = new OrderDetailsDTO
                        {
                            OrderID = Convert.ToInt32(reader["OrderID"]),
                            UserID = Convert.ToInt32(reader["UserID"]),
                            OrderNumber = reader["OrderNumber"].ToString(),
                            TotalAmount = Convert.ToDecimal(reader["TotalAmount"]),
                            ShippingAmount = Convert.ToDecimal(reader["ShippingAmount"]),
                            TaxAmount = Convert.ToDecimal(reader["TaxAmount"]),          
                            DiscountAmount = Convert.ToDecimal(reader["DiscountAmount"]),
                            FinalAmount = Convert.ToDecimal(reader["FinalAmount"]),  
                            PromoCode = reader["PromoCode"] as string,
                            PaymentBrand = reader["PaymentBrand"] as string,
                            PaymentLast4 = reader["PaymentLast4"] as string,
                            Status = reader["Status"].ToString(),
                            CreatedAt = Convert.ToDateTime(reader["CreatedAt"]),
                            UpdatedAt = Convert.ToDateTime(reader["UpdatedAt"]),
                            Items = new List<OrderItemDTO>()
                        };
                    }

                    // 2. Next result: order items
                    if (reader.NextResult())
                    {
                        while (reader.Read())
                        {
                            items.Add(new OrderItemDTO
                            {
                                OrderItemID = Convert.ToInt32(reader["OrderItemID"]),
                                OrderID = Convert.ToInt32(reader["OrderID"]),
                                ProductID = Convert.ToInt32(reader["ProductID"]),
                                ProductName = reader["ProductName"].ToString(),
                                Quantity = Convert.ToInt32(reader["Quantity"]),
                                Price = Convert.ToDecimal(reader["Price"]),
                                Subtotal = Convert.ToDecimal(reader["Subtotal"]),
                                CreatedAt = Convert.ToDateTime(reader["CreatedAt"])
                            });
                        }
                    }

                    // 3. Next result: order summary
                    if (reader.NextResult() && reader.Read())
                    {
                        summary = new OrderSummaryDTO
                        {
                            TotalItems = Convert.ToInt32(reader["TotalItems"]),
                            TotalQuantity = Convert.ToInt32(reader["TotalQuantity"]),
                            CalculatedTotal = Convert.ToDecimal(reader["CalculatedTotal"])
                        };
                    }

                    // 4. Next result: shipping address
                    if (reader.NextResult() && reader.Read())
                    {
                        orderDetails.Address = new OrderAddressDetailDTO
                        {
                            FirstName = reader["FirstName"].ToString(),
                            LastName = reader["LastName"].ToString(),
                            Email = reader["Email"].ToString(),
                            Phone = reader["Phone"].ToString(),
                            StreetAddress = reader["StreetAddress"].ToString(),
                            City = reader["City"].ToString(),
                            State = reader["State"] as string,
                            PostalCode = reader["PostalCode"] as string,
                            Country = reader["Country"].ToString()
                        };
                    }
                }
            }

            orderDetails.Items = items;
            orderDetails.Summary = summary;

            return orderDetails;
        }


        //Change Password
        public static string GetPasswordHashByUserId(int userId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            using (SqlCommand command = new SqlCommand(
                "SELECT PasswordHash FROM Users WHERE UserID = @UserID",
                connection))
            {
                command.Parameters.AddWithValue("@UserID", userId);

                connection.Open();

                object result = command.ExecuteScalar();

                return result as string;
            }
        }


        public static bool UpdateUserPassword(int userId, string newPasswordHash)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            using (SqlCommand command = new SqlCommand("SP_UpdateUserPassword", connection))
            {
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@UserID", userId);
                command.Parameters.AddWithValue("@PasswordHash", newPasswordHash);

                connection.Open();

                int rowsAffected = command.ExecuteNonQuery();

                return rowsAffected > 0;
            }
        }

        public static UserInternalDTO GetUserByEmail(string email)
        {
            using SqlConnection conn = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("SP_GetUserByEmail", conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Email", email);

            conn.Open();
            using var reader = cmd.ExecuteReader();

            if (!reader.Read()) return null;

            return new UserInternalDTO
            {
                UserId = reader.GetInt32(0),
                Email = reader.GetString(1)
            };
        }


        // forget Password 
        public static void CreatePasswordResetToken(int userId, string token)
        {
            using SqlConnection conn = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("SP_CreatePasswordResetToken", conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", userId);
            cmd.Parameters.AddWithValue("@Token", token);

            conn.Open();
            cmd.ExecuteNonQuery();
        }

        public static PasswordResetTokenInternalDTO GetPasswordResetToken(string token)
        {
            using SqlConnection conn = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("SP_GetPasswordResetToken", conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Token", token);

            conn.Open();
            using var reader = cmd.ExecuteReader();

            if (!reader.Read()) return null;

            return new PasswordResetTokenInternalDTO
            {
                TokenId = reader.GetInt32(0),
                UserId = reader.GetInt32(1),
                ExpiryDate = reader.GetDateTime(2),
                IsUsed = reader.GetBoolean(3)
            };
        }

        public static void MarkPasswordResetTokenAsUsed(int tokenId)
        {
            using SqlConnection conn = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("SP_MarkPasswordResetTokenAsUsed", conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@TokenId", tokenId);

            conn.Open();
            cmd.ExecuteNonQuery();
        }


        //PaymentMethods
        //Get User Payment Methods
        public static List<UserPaymentMethodInternalDTO> GetUserPaymentMethods(int userId)
        {
            var list = new List<UserPaymentMethodInternalDTO>();

            using SqlConnection conn = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("GetUserPaymentMethods", conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserID", userId);

            conn.Open();
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                list.Add(new UserPaymentMethodInternalDTO
                {
                    PaymentMethodID = reader.GetInt32(0),
                    StripePaymentMethodId = reader.GetString(1),
                    Brand = reader.GetString(2),
                    CardLast4 = reader.GetString(3),
                    CardHolderName = reader.GetString(4),
                    ExpiryMonth = reader.GetByte(5),
                    ExpiryYear = reader.GetInt16(6),
                    IsDefault = reader.GetBoolean(7)
                });
            }

            return list;
        }


        public static void AddUserPaymentMethod(UserPaymentMethodInternalDTO dto)
        {
            using SqlConnection conn = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("AddUserPaymentMethod", conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserID", dto.UserID);
            cmd.Parameters.AddWithValue("@StripePaymentMethodId", dto.StripePaymentMethodId);
            cmd.Parameters.AddWithValue("@Brand", dto.Brand);
            cmd.Parameters.AddWithValue("@CardLast4", dto.CardLast4);
            cmd.Parameters.AddWithValue("@CardHolderName", dto.CardHolderName);
            cmd.Parameters.Add("@ExpiryMonth", SqlDbType.TinyInt).Value = dto.ExpiryMonth;
            cmd.Parameters.Add("@ExpiryYear", SqlDbType.SmallInt).Value = dto.ExpiryYear;
            cmd.Parameters.AddWithValue("@IsDefault", dto.IsDefault);

            conn.Open();
            cmd.ExecuteNonQuery();
        }

        public static void DeleteUserPaymentMethod(int paymentMethodId, int userId)
        {
            using SqlConnection conn = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("DeleteUserPaymentMethod", conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@PaymentMethodID", paymentMethodId);
            cmd.Parameters.AddWithValue("@UserID", userId);

            conn.Open();
            cmd.ExecuteNonQuery();
        }


        public static void SetDefaultPaymentMethod(int paymentMethodId, int userId)
        {
            using SqlConnection conn = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("SetDefaultPaymentMethod", conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@PaymentMethodID", paymentMethodId);
            cmd.Parameters.AddWithValue("@UserID", userId);

            conn.Open();
            cmd.ExecuteNonQuery();
        }


        public static void UnsetDefaultPaymentMethod(int userId)
        {
            using SqlConnection conn = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("SP_UnsetDefaultPaymentMethod", conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserID", userId);

            conn.Open();
            cmd.ExecuteNonQuery();
        }



        //Checkout
        public static UserDTO GetUserById(int userId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("GetUserById", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserID", userId);

                    connection.Open();

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return (new UserDTO
                            (
                               reader.GetInt32(reader.GetOrdinal("UserID")),
                               reader.GetString(reader.GetOrdinal("FirstName")),
                               reader.GetString(reader.GetOrdinal("LastName")),
                               reader.GetString(reader.GetOrdinal("Email")),
                               reader.IsDBNull(reader.GetOrdinal("Phone"))? null: reader.GetString(reader.GetOrdinal("Phone"))
                            ));
                        }
                    }
                }
                return null;
            }

        }

        public static UserAddressDTO GetDefaultAddress(int userId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("GetDefaultAddress", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserID", userId);

                    connection.Open();

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return (new UserAddressDTO
                            (
                               reader.GetInt32(reader.GetOrdinal("AddressID")),
                               reader.GetInt32(reader.GetOrdinal("UserID")),
                               reader.GetString(reader.GetOrdinal("AddressType")),
                               reader.GetString(reader.GetOrdinal("StreetAddress")),
                               reader.GetString(reader.GetOrdinal("City")),
                               reader.IsDBNull(reader.GetOrdinal("State")) ? null : reader.GetString(reader.GetOrdinal("State")),
                               reader.IsDBNull(reader.GetOrdinal("PostalCode")) ? null : reader.GetString(reader.GetOrdinal("PostalCode")),
                               reader.GetString(reader.GetOrdinal("Country")),
                               reader.GetBoolean(reader.GetOrdinal("IsDefault")),
                               reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                               reader.IsDBNull(reader.GetOrdinal("UpdatedAt")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
                            ));                            
                        }
                    }
                }
                return null;
            }
        }

        public static PaymentMethodDTO GetDefaultPaymentMethod(int userId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("GetDefaultPaymentMethod", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserID", userId);

                    connection.Open();

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return (new PaymentMethodDTO
                            (
                               reader.GetInt32(reader.GetOrdinal("PaymentMethodID")),
                               reader.GetString(reader.GetOrdinal("Brand")),
                               reader.GetString(reader.GetOrdinal("CardLast4")),
                               reader.GetString(reader.GetOrdinal("CardHolderName")),
                               Convert.ToInt32(reader["ExpiryMonth"]),
                               Convert.ToInt32(reader["ExpiryYear"]),
                               reader.GetBoolean(reader.GetOrdinal("IsDefault"))                            
                            ));
                        }
                    }
                }
                return null;
            }
        }



        public static List<ProductBasicDto> GetProductsByIds(List<int> productIds)
        {
            var products = new List<ProductBasicDto>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                var parameters = productIds
                    .Select((id, index) => new SqlParameter($"@id{index}", id))
                    .ToList();

                string inClause = string.Join(",", parameters.Select(p => p.ParameterName));

                string query = $@"SELECT ProductID, Price, Quantity 
                          FROM Products
                          WHERE ProductID IN ({inClause})";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddRange(parameters.ToArray());

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            products.Add(new ProductBasicDto
                            {
                                ProductID = reader.GetInt32(0),
                                Price = reader.GetDecimal(1),
                                Quantity = reader.GetInt32(2)
                            });
                        }
                    }
                }
            }

            return products;
        }


        public static PromoCodeDto GetPromoByCode(string code) 
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            using (SqlCommand command = new SqlCommand("SP_GetPromoCodeByCode", connection))
            {
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@Code", code);

                connection.Open();

                using (var reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return new PromoCodeDto
                        {
                            Id = reader.GetInt32(reader.GetOrdinal("Id")),
                            Code = reader.GetString(reader.GetOrdinal("Code")),
                            DiscountType = reader.GetByte(reader.GetOrdinal("DiscountType")),
                            DiscountValue = reader.GetDecimal(reader.GetOrdinal("DiscountValue")),
                            ExpiryDate = reader["ExpiryDate"] as DateTime?,
                            UsageLimit = reader["UsageLimit"] as int?,
                            UsedCount = reader.GetInt32(reader.GetOrdinal("UsedCount")),
                            IsActive = reader.GetBoolean(reader.GetOrdinal("IsActive")),
                            MinimumOrderAmount = reader["MinimumOrderAmount"] as decimal?,
                            MaximumDiscountAmount = reader["MaximumDiscountAmount"] as decimal?,
                            UserId = reader["UserId"] as int?,
                            IsFirstOrderOnly = reader.GetBoolean(reader.GetOrdinal("IsFirstOrderOnly"))
                        };
                    }
                }
            }
            return null;
        }


        public static void CleanupExpiredPendingOrders()
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = @"
                   DELETE FROM OrderAddresses 
                   WHERE OrderID IN (
                       SELECT OrderID FROM Orders 
                       WHERE PaymentStatus = 'Pending'
                       AND CreatedAt < DATEADD(HOUR, -24, GETDATE())
                   )
                   
                   DELETE FROM OrderItems 
                   WHERE OrderID IN (
                       SELECT OrderID FROM Orders 
                       WHERE PaymentStatus = 'Pending'
                       AND CreatedAt < DATEADD(HOUR, -24, GETDATE())
                   )
                   
                   DELETE FROM Orders 
                   WHERE PaymentStatus = 'Pending'
                   AND CreatedAt < DATEADD(HOUR, -24, GETDATE())";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }
        }


        public static int SaveOrderWithTransaction(
            int userId,
            decimal subtotal,
            decimal shipping,
            decimal tax,
            decimal discount,
            decimal totalAmount,
            decimal finalAmount,
            string promoCode,
            string paymentIntentId,
            string? PaymentBrand,   
            string? PaymentLast4,   
            string? PaymentMethodId,
            OrderAddressDto address,
            List<OrderItemDto> items)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                using (SqlTransaction transaction = connection.BeginTransaction())
                {
                    try
                    {
                        string insertOrderQuery = @"
                        INSERT INTO Orders
                        (UserID, OrderNumber, TotalAmount, Subtotal, ShippingAmount, TaxAmount,
                         DiscountAmount, FinalAmount, PromoCode, PaymentIntentId,
                         PaymentBrand, PaymentLast4, PaymentMethodId,
                         PaymentStatus, Status, CreatedAt)
                        OUTPUT INSERTED.OrderID
                        VALUES
                        (@UserID, @OrderNumber, @TotalAmount, @Subtotal, @Shipping, @Tax,
                         @Discount, @FinalAmount, @PromoCode, @PaymentIntentId,
                         @PaymentBrand, @PaymentLast4, @PaymentMethodId,
                         @PaymentStatus, @Status, GETDATE())";

                        using (SqlCommand orderCmd = new SqlCommand(insertOrderQuery, connection, transaction))
                        {
                            orderCmd.Parameters.AddWithValue("@UserID", userId);
                            orderCmd.Parameters.AddWithValue("@OrderNumber", Guid.NewGuid().ToString());
                            orderCmd.Parameters.AddWithValue("@TotalAmount", totalAmount);
                            orderCmd.Parameters.AddWithValue("@Subtotal", subtotal);
                            orderCmd.Parameters.AddWithValue("@Shipping", shipping);
                            orderCmd.Parameters.AddWithValue("@Tax", tax);
                            orderCmd.Parameters.AddWithValue("@Discount", discount);
                            orderCmd.Parameters.AddWithValue("@FinalAmount", finalAmount);
                            orderCmd.Parameters.AddWithValue("@PromoCode", string.IsNullOrEmpty(promoCode) ? DBNull.Value : (object)promoCode);
                            orderCmd.Parameters.AddWithValue("@PaymentIntentId", paymentIntentId);
                            orderCmd.Parameters.AddWithValue("@PaymentBrand", (object?)PaymentBrand ?? DBNull.Value);
                            orderCmd.Parameters.AddWithValue("@PaymentLast4", (object?)PaymentLast4 ?? DBNull.Value);
                            orderCmd.Parameters.AddWithValue("@PaymentMethodId", (object?)PaymentMethodId ?? DBNull.Value);
                            orderCmd.Parameters.AddWithValue("@PaymentStatus", "Pending");
                            orderCmd.Parameters.AddWithValue("@Status", "Pending");

                            int orderId = (int)orderCmd.ExecuteScalar();
                            string insertAddressQuery = @"
                            INSERT INTO OrderAddresses
                            (OrderID, FirstName, LastName, Email, Phone, StreetAddress, City, State, PostalCode, Country)                            
                            VALUES
                            (@OrderID, @FirstName, @LastName, @Email, @Phone, @StreetAddress, @City, @State, @PostalCode, @Country)";
                            using (SqlCommand addressCmd = new SqlCommand(insertAddressQuery, connection, transaction))
                            {
                                addressCmd.Parameters.AddWithValue("@OrderID", orderId);
                                addressCmd.Parameters.AddWithValue("@FirstName", address.FirstName);   
                                addressCmd.Parameters.AddWithValue("@LastName", address.LastName); 
                                addressCmd.Parameters.AddWithValue("@Email", address.Email); 
                                addressCmd.Parameters.AddWithValue("@Phone", address.Phone); 
                                addressCmd.Parameters.AddWithValue("@StreetAddress", address.StreetAddress);
                                addressCmd.Parameters.AddWithValue("@City", address.City);
                                addressCmd.Parameters.AddWithValue("@State", (object?)address.State ?? DBNull.Value);
                                addressCmd.Parameters.AddWithValue("@PostalCode", (object?)address.PostalCode ?? DBNull.Value);
                                addressCmd.Parameters.AddWithValue("@Country", address.Country);

                                addressCmd.ExecuteNonQuery();
                            }

                            // 2. Insert order items
                            foreach (var item in items)
                            {
                                string insertItemQuery = @"
                                INSERT INTO OrderItems
                                (OrderID, ProductID, ProductName, Quantity, Price,CreatedAt)
                                SELECT
                                @OrderID, ProductID, Name, @Quantity, Price, GETDATE()
                                FROM Products
                                WHERE ProductID = @ProductID";

                                using (SqlCommand itemCmd = new SqlCommand(insertItemQuery, connection, transaction))
                                {
                                    itemCmd.Parameters.AddWithValue("@OrderID", orderId);
                                    itemCmd.Parameters.AddWithValue("@ProductID", item.ProductId);
                                    itemCmd.Parameters.AddWithValue("@Quantity", item.Quantity);
                                    itemCmd.ExecuteNonQuery();
                                }
                            }
                             transaction.Commit();
                             return orderId;
                        }
                    }
                    catch
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }




        public static void UpdateOrderPaymentStatus(string paymentIntentId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = @"
                    UPDATE Orders
                    SET PaymentStatus = 'Paid',
                        OrderStatus = 'Completed',
                        Status = 'Processing',
                        UpdatedAt = GETDATE()
                    WHERE PaymentIntentId = @PaymentIntentId";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@PaymentIntentId", paymentIntentId);

                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }
        }

        public static void CompleteOrderAfterPayment(string paymentIntentId, 
                                                     string? paymentBrand = null,   
                                                     string? paymentLast4 = null,   
                                                     string? paymentMethodId = null)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                using (SqlTransaction transaction = connection.BeginTransaction())
                {
                    try
                    {
                        int orderId = 0;
                        string promoCode = null;
                        string paymentStatus = null;

                        string getOrderQuery = @"
                             SELECT OrderID, PromoCode, PaymentStatus
                             FROM Orders
                             WHERE PaymentIntentId = @PaymentIntentId
                        ";

                        using (SqlCommand cmd = new SqlCommand(getOrderQuery, connection, transaction))
                        {
                            cmd.Parameters.AddWithValue("@PaymentIntentId", paymentIntentId);

                            using (var reader = cmd.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    orderId = reader.GetInt32(0);
                                    promoCode = reader["PromoCode"] as string;
                                    paymentStatus = reader["PaymentStatus"].ToString();
                                }
                                else
                                {
                                    throw new Exception("Order not found");
                                }
                            }
                        }

                        if (paymentStatus == "Paid")
                        {
                            if (!string.IsNullOrEmpty(paymentBrand) || !string.IsNullOrEmpty(paymentLast4))
                            {
                                string updateDetailsQuery = @"
                                 UPDATE Orders
                                 SET PaymentBrand = COALESCE(@PaymentBrand, PaymentBrand),
                                     PaymentLast4 = COALESCE(@PaymentLast4, PaymentLast4),
                                     PaymentMethodId = COALESCE(@PaymentMethodId, PaymentMethodId)
                                 WHERE OrderID = @OrderID";

                                using (SqlCommand cmd = new SqlCommand(updateDetailsQuery, connection, transaction))
                                {
                                    cmd.Parameters.AddWithValue("@OrderID", orderId);
                                    cmd.Parameters.AddWithValue("@PaymentBrand", (object?)paymentBrand ?? DBNull.Value);
                                    cmd.Parameters.AddWithValue("@PaymentLast4", (object?)paymentLast4 ?? DBNull.Value);
                                    cmd.Parameters.AddWithValue("@PaymentMethodId", (object?)paymentMethodId ?? DBNull.Value);
                                    cmd.ExecuteNonQuery();
                                }
                            }

                            transaction.Commit();
                            return;
                        }

                        // 1. Reduce product stock
                        string reduceStockQuery = @"
                            UPDATE P
                            SET P.Quantity = P.Quantity - OI.Quantity
                            FROM Products P
                            INNER JOIN OrderItems OI ON P.ProductID = OI.ProductID
                            WHERE OI.OrderID = @OrderID
                        ";

                        using (SqlCommand cmd = new SqlCommand(reduceStockQuery, connection, transaction))
                        {
                            cmd.Parameters.AddWithValue("@OrderID", orderId);
                            cmd.ExecuteNonQuery();
                        }

                        // 2. Increment promo code usage count
                        if (!string.IsNullOrEmpty(promoCode))
                        {
                            string updatePromoQuery = @"
                                UPDATE PromoCodes
                                SET UsedCount = UsedCount + 1
                                WHERE Code = @Code
                            ";

                            using (SqlCommand cmd = new SqlCommand(updatePromoQuery, connection, transaction))
                            {
                                cmd.Parameters.AddWithValue("@Code", promoCode);
                                cmd.ExecuteNonQuery();
                            }
                        }

                        // 3. Update order status
                        string updateOrderQuery = @"
                           UPDATE Orders
                           SET PaymentStatus = 'Paid',
                           Status = 'Processing',
                           UpdatedAt = GETDATE(),
                           PaymentBrand = COALESCE(@PaymentBrand, PaymentBrand),
                           PaymentLast4 = COALESCE(@PaymentLast4, PaymentLast4),
                           PaymentMethodId = COALESCE(@PaymentMethodId, PaymentMethodId)
                           WHERE OrderID = @OrderID
                        ";

                        using (SqlCommand cmd = new SqlCommand(updateOrderQuery, connection, transaction))
                        {
                            cmd.Parameters.AddWithValue("@OrderID", orderId);
                            cmd.Parameters.AddWithValue("@PaymentBrand", (object?)paymentBrand ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@PaymentLast4", (object?)paymentLast4 ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@PaymentMethodId", (object?)paymentMethodId ?? DBNull.Value);

                            cmd.ExecuteNonQuery();
                        }

                        transaction.Commit();
                    }
                    catch
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }
    }
}