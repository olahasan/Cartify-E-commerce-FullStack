using Azure;
using EcommerceAPIBusinessLayer;
using EcommerceAPIBusinessLayer.Services;
using EcommerceAPIDataAccessLayer;
using Microsoft.AspNetCore.Authorization;
using EcommerceAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Diagnostics.Metrics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using static System.Runtime.InteropServices.JavaScript.JSType;



namespace EcommerceAPI.Controllers
{
    //[Route("api/EcommerceAPI")]
    //[ApiController]

    public class ChangePasswordReqDTO
    {
        [Required(ErrorMessage = "Current password is required")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be between 8 and 100 characters")]
        public string CurrentPassword { get; set; }


        [Required(ErrorMessage = "New password is required")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be between 8 and 100 characters")]
        public string NewPassword { get; set; }
    }

    public class ForgotPasswordReqDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }

    public class ResetPasswordReqDTO
    {
        [Required]
        public string Token { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be between 8 and 100 characters")]
        public string NewPassword { get; set; }
    }

    /// //////////////////// 

    [Route("api/EcommerceAPI")]
    [ApiController]
    public class EcommerceAPIController : ControllerBase
    {
        private readonly ILogger<EcommerceAPIController> _logger;
        private readonly EmailService _emailService;


        public EcommerceAPIController(ILogger<EcommerceAPIController> logger, EmailService emailService)
        {
            _logger = logger;   
            _emailService = emailService;
        }

        [HttpGet("AllTopRatedProducts", Name = "GetAllTopRatedProducts")] 
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<ProductDTO>> GetTopRatedProducts(float minRating, int minReviews, int topCount) 
        {
            List<ProductDTO> ProductList = EcommerceBusiness.GetTopRatedProducts(minRating, minReviews, topCount);
            if (ProductList.Count == 0)
            {
                return NotFound(new
                {
                    message = "No products matched the criteria.",
                    code = 404
                }); 
            }
            return Ok(ProductList);

        }


        [HttpGet("ProductImages", Name = "GetProductImages")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ProductImagesDTO> GetProductImages(int ProductID)
        {
            var result = EcommerceBusiness.GetProductImages(ProductID);

            if (result.Thumbs.Count == 0 && result.Fulls.Count == 0)
            {
                return NotFound(new
                {
                    message = "No images found for this product.",
                    code = 404
                });
            }

            return Ok(result);
        }



        [HttpGet("AllProductThumbnails", Name = "GetProductThumbnails")] 
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<string>> GetProductThumbnails(int ProductID)
        {
            List<string> ProductThumbnailsList = EcommerceBusiness.GetProductThumbnails(ProductID);
            if (ProductThumbnailsList.Count == 0)
            {
                return NotFound(new
                {
                    message = "No ProductThumbnails matched the criteria.",
                    code = 404
                });
            }
            return Ok(ProductThumbnailsList);

        }


        [HttpGet("AllHomeFashionImages", Name = "GetHomeFashionImages")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<ImagesDTO>> GetHomeFashionImages([FromQuery]  string sectionName)
        {
            List<ImagesDTO> ImagesList = EcommerceBusiness.GetHomeFashionImages(sectionName);
            if (ImagesList.Count == 0)
            {
                return NotFound(new
                {
                    message = "No items matched the criteria.",
                    code = 404
                });
            }
            return Ok(ImagesList); 
        }



        [HttpGet("categories/{slug}" , Name = "GetProductWithCategory")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<ProductWithCategoryDTO>> GetProductWithCategory(string slug) 
        {
            List<ProductWithCategoryDTO> ProductWithCategoryList = EcommerceBusiness.GetProductWithCategory(slug);  
            if (ProductWithCategoryList.Count == 0)
            {
                return NotFound(new
                {
                    message = "No products matched the criteria.",
                    code = 404
                });
            }
            return Ok(ProductWithCategoryList);

        }

        /// pagination
        [HttpGet("PagedProducts", Name = "GetPagedProducts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<PagedProductsDTO> GetPagedProducts( int categoryId,int pageNumber = 1, int pageSize = 6)
        {
            if (categoryId <= 0)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid categoryId",
                    data = (object?)null,
                    errors = new { code = 400 }
                });
            }

            if (pageNumber < 1) pageNumber = 1;
            if (pageSize > 50) pageSize = 6;

            var result = EcommerceBusiness.GetPagedProducts(categoryId, pageNumber, pageSize);

            if (result == null || result.Products.Count == 0)
            {
                return NotFound(new
                {
                    success = false,
                    message = "No products found for this category",
                    data = result,
                    errors = (object?)null
                });
            }

            return Ok(new
            {
                success = true,
                message = "Products retrieved successfully",
                data = result,
                errors = (object?)null
            });
        }


        // Search feature        
        // phase-1
        [HttpGet("SearchProducts", Name = "SearchProducts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<PagedProductsDTO> GetSearchedProducts(string searchTerm, int pageNumber = 1, int pageSize = 20)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Search term is required",
                    data = (object?)null,
                    errors = new { code = 400 }
                });
            }

            if (pageNumber < 1) pageNumber = 1;
            if (pageSize > 50) pageSize = 20;

            var result = EcommerceBusiness.GetSearchedProducts(searchTerm, pageNumber, pageSize);

            if (result == null || result.Products.Count == 0)
            {
                return Ok(new
                {
                    success = true,
                    message = $"No products found for '{searchTerm}'",
                    data = result,
                    errors = (object?)null
                });
            }
            
            return Ok(new
            {
                success = true,
                message = "Products retrieved successfully",
                data = result,
                errors = (object?)null
            });
        }

        //phase-2
        [HttpGet("SearchSuggestions", Name = "SearchSuggestions")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult GetSearchSuggestions(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Search term is required",
                    data = (object?)null,
                    errors = new { code = 400 }
                });
            }

            var result = EcommerceBusiness.GetSearchSuggestions(searchTerm);

            if (result == null || result.Count == 0)
            {
                return Ok(new
                {
                    success = true,
                    message = "No suggestions found",
                    data = result,
                    errors = (object?)null
                });
            }

            return Ok(new
            {
                success = true,
                message = "Suggestions retrieved successfully",
                data = result,
                errors = (object?)null
            });
        }



        [HttpGet("AllHomeSectionsWithSlugs", Name = "GetHomeSectionsWithSlugs")] 
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<HomeSectionDTO>> GetHomeSectionsWithSlugs()
        {
            List<HomeSectionDTO> HomeSectionList = EcommerceBusiness.GetHomeSectionsWithSlugs();
            if (HomeSectionList.Count == 0)
            {
                return NotFound(new
                {
                    message = "No products matched the criteria.",
                    code = 404
                });
            }
            return Ok(HomeSectionList); 

        }



        [HttpGet("AllHomePageSections", Name = "GetHomePageSections")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<HomeSectionDTOO>> GetHomePageSections()
        {
            List<HomeSectionDTOO> HomeSectionList = EcommerceBusiness.GetHomePageSections();
            if (HomeSectionList.Count == 0)
            {
                return NotFound(new
                {
                    message = "No home sections found.",
                    code = 404
                });
            }
            return Ok(HomeSectionList);
        }



        [HttpGet("AllHomeSectionCarousel", Name = "GetHomeSectionCarousel")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<CarouselItemDTO>> GetHomeSectionCarousel([FromQuery] string sectionSlug)
        {
            List<CarouselItemDTO> CarouselItemList = EcommerceBusiness.GetHomeSectionCarousel(sectionSlug);
            if (CarouselItemList.Count == 0)
            {
                return NotFound(new
                {
                    message = $"No carousel items found for section: {sectionSlug}",
                    code = 404
                });
            }
            return Ok(CarouselItemList);
        }


        [HttpGet("CategoryNavigation", Name = "GetCategoryNavigationData")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<CategoryNavigationResultDTO> GetCategoryNavigationData([FromQuery] string slugPath, [FromQuery] string navigationType = "AUTO")
        {
            CategoryNavigationResultDTO result = EcommerceBusiness.GetCategoryNavigationData(slugPath, navigationType);

            if (result.CategoryInfo == null)
            {
                return NotFound(new
                {
                    message = $"No navigation data found for: {slugPath}",
                    code = 404
                });
            }

            return Ok(result);
        }


        [HttpGet("AllCategorySidebar", Name = "GetCategorySidebar")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<CategorySidebarDTO>> GetCategorySidebar()
        {
            List<CategorySidebarDTO> CategorySidebarList = EcommerceBusiness.GetCategorySidebar();
            if (CategorySidebarList.Count == 0)
            {
                return NotFound(new
                {
                    message = "No CategoriesSidebar matched the criteria.",
                    code = 404
                });
            }
            return Ok(CategorySidebarList);

        }


        [HttpGet("GetProductById/{ProductID:int}", Name = "GetProductById")] 
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<ProductDTO> GetProductById(int ProductID) 
        {
            if (ProductID <= 0)
            {
                return BadRequest("Invalid userId or productId.");
            }

            var ProducItems = EcommerceBusiness.GetProductById(ProductID);

            if (ProducItems == null)
            {
                return NotFound(new
                {
                    message = "No ProductThumbnails matched the criteria.",
                    code = 404
                });
            }
            return Ok(ProducItems);

        }

        // wishlist
        [Authorize]
        [HttpGet("GetWishlistCount", Name = "GetWishlistCount")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]

        public ActionResult<WishlistCountDTO> GetWishlistCount()
        {
            // Extract user ID from JWT token
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid or missing JWT token.",
                    data = new WishlistCountDTO { WishlistCount = 0 },
                    errors = new { code = 401 }
                });
            }


            int UserID = int.Parse(userIdClaim);

            WishlistCountDTO WishListCount = EcommerceBusiness.GetWishlistCount(UserID);


            return Ok(new
            {
                success = true,
                message = "WishList Count retrieved successfully",
                data = WishListCount,
                errors = (object)null
            });
        }


        [Authorize]
        [HttpGet("AllWishlistByUserID", Name = "GetWishlistByUserID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]

        public ActionResult<IEnumerable<WishlistDTO>> GetWishlistByUserID()
        {
            // Extract user ID from JWT token
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new
                {
                    message = $"Invalid or missing JWT token.",
                    code = 401
                });
            }


            int UserID = int.Parse(userIdClaim);

            List<WishlistDTO> Wishlist = EcommerceBusiness.GetWishlistByUserID(UserID);
            if (Wishlist.Count == null || Wishlist.Count == 0)
            {
                return Ok(new List<WishlistDTO>());
            }
            return Ok(Wishlist);
        }


        [Authorize]
        [HttpGet("IsProductInWishlist", Name = "IsProductInWishlist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<bool> IsProductInWishlist(int ProductID)
        {
                if (ProductID <= 0)
                {
                    return Unauthorized(new
                    {
                        message = $"Invalid or missing JWT token.",
                        code = 401
                    });
                }

            // Extract user ID from JWT token
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            int UserID = int.Parse(userIdClaim);

            bool IsFound = EcommerceBusiness.IsProductInWishlist(UserID, ProductID);
           
            return Ok(IsFound);
            
        }


        [Authorize]
        [HttpPost("AddToWishlist", Name = "AddToWishlist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<bool> AddToWishlist(int ProductID)
        {
            if (ProductID <= 0)
            {
                return Unauthorized(new
                {
                    message = $"Invalid or missing JWT token.",
                    code = 401
                });
            }

            // Extract user ID from JWT token
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            int UserID = int.Parse(userIdClaim);

            bool IsAdded = EcommerceBusiness.AddToWishlist(UserID, ProductID);

            if (!IsAdded)
            {
                return BadRequest(new
                {
                    message = $"Product {ProductID} is already in wishlist for User {UserID}",
                    code = 400
                });
            }
            return Ok(true);

        }



        [Authorize]
        [HttpDelete("RemoveFromWishlist", Name = "RemoveFromWishlist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<bool> RemoveFromWishlist(int ProductID)
        {
            if (ProductID <= 0)
            {
                return Unauthorized(new
                {
                    message = $"Invalid or missing JWT token.",
                    code = 401
                });
            }

            // Extract user ID from JWT token
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            int UserID = int.Parse(userIdClaim);

            bool IsDeleted = EcommerceBusiness.RemoveFromWishlist(UserID, ProductID);

            return IsDeleted;
        }



        [Authorize]
        [HttpDelete("ClearWishlist", Name = "ClearWishlist")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<bool> ClearWishlist()
        {
            // Extract user ID from JWT token
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new
                {

                    success = false,
                    message = "Invalid or missing JWT token.",
                    data = (object)null,
                    errors = new { code = 401 }
                });
            }


            int UserID = int.Parse(userIdClaim);


            bool IsDeleted = EcommerceBusiness.ClearWishlist(UserID);

            return IsDeleted;

        }

        // cart
        [Authorize]
        [HttpGet("GetCartSummary", Name = "GetCartSummary")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]

        public ActionResult<CartSummaryDTO> GetCartSummary()
        {
            // Extract user ID from JWT token
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid or missing JWT token.",
                    data = new CartSummaryDTO { TotalQuantity = 0, TotalPrice = 0m},
                    errors = new { code = 401 }
                });
            }

            int UserID = int.Parse(userIdClaim);

            CartSummaryDTO CartSummary = EcommerceBusiness.GetCartSummary(UserID);

            return Ok(new 
            {
                success = true,
                message = "Cart summary retrieved successfully",
                data = CartSummary,
                errors = (object)null
            });

        }


        [Authorize]
        [HttpGet("GetCartItemsByUserID", Name = "GetCartItemsByUserID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<IEnumerable<CartDTO>> GetCartItemsByUserID()
        {
            // Extract user ID from JWT token
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new
                {
                    message = $"Invalid or missing JWT token.",
                    code = 401
                });   
            }

            int UserID = int.Parse(userIdClaim);

            List<CartDTO> CartList = EcommerceBusiness.GetCartItemsByUserID(UserID);
            if (CartList.Count == null || CartList.Count == 0)
            {
                return Ok(new List<CartDTO>());
            }
            return Ok(CartList);
        }


        [Authorize]
        [HttpPost("InsertUpdateCartItems", Name = "InsertUpdateCartItems")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<object> InsertUpdateCartItems(int ProductID)
        {
            try
            {
                if (ProductID <= 0)
                {
                     return Ok(new
                     {
                         success = false,
                         message = "Invalid ProductID",
                         data = (object)null,
                         errors = new { code = 400 }
                     });
                }

                // Extract user ID from JWT token
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Invalid or missing JWT token.",
                        data = (object)null,
                        errors = new { code = 401 }
                    });
                }

                int UserID = int.Parse(userIdClaim);

                object result = EcommerceBusiness.InsertUpdateCartItems(UserID, ProductID);
               
                return Ok(new
                {
                   success = true,
                   message = "Cart updated successfully",
                   data = result,
                   errors = (object)null
                });
            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    success = false,
                    message = "An unexpected error occurred",
                    data = (object)null,
                    errors = new { details = ex.Message }
                });
            }
        }


        [Authorize]
        [HttpDelete("RemoveCartItem", Name = "RemoveCartItem")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<object> RemoveCartItem(int ProductID)
        {
            try
            {
                if (ProductID <= 0)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Invalid ProductID",
                        data = (object)null,
                        errors = new { code = 400 }
                    });
                }


                // Extract user ID from JWT token
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Invalid or missing JWT token.",
                        data = (object)null,
                        errors = new { code = 401 }
                    });
                }


                int UserID = int.Parse(userIdClaim);

                object result = EcommerceBusiness.RemoveCartItem(UserID, ProductID);

                return Ok(new
                {
                    success = true,
                    message = "Item removed from cart successfully",
                    data = result,
                    errors = (object)null
                });
            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    success = false,
                    message = "An unexpected error occurred",
                    data = (object)null,
                    errors = new { details = ex.Message }
                });
            }
        }


        [Authorize]
        [HttpPost("IncrementDecrementCartItem", Name = "IncrementDecrementCartItem")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<object> IncrementDecrementCartItem(int ProductID, [FromQuery] string action) 
        {
            try
            {
                if (ProductID <= 0 || action == null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Invalid ProductID or Action",
                        data = (object)null,
                        errors = new { code = 400 }
                    });
                }

                if (!action.Equals("Increment", StringComparison.OrdinalIgnoreCase) &&
                    !action.Equals("Decrement", StringComparison.OrdinalIgnoreCase))
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Invalid Action type. Must be 'Increment' or 'Decrement'.",
                        data = (object)null,
                        errors = new { code = 400 }
                    });
                }


                // Extract user ID from JWT token
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Invalid or missing JWT token.",
                        data = (object)null,
                        errors = new { code = 401 }
                    });
                }


                int UserID = int.Parse(userIdClaim);

                object result = EcommerceBusiness.IncrementDecrementCartItem(UserID, ProductID, action);

                return Ok(new
                {
                        success = true,
                        message = $"Item's Quantity {action}ed successfully",
                        data = result,
                        errors = (object)null
                });
            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    success = false,
                    message = "An unexpected error occurred",
                    data = (object)null,
                    errors = new { details = ex.Message }
                });
            }
        }


        [Authorize]
        [HttpDelete("ClearCart", Name = "ClearCart")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<object> ClearCart()
        {
            // Extract user ID from JWT token
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid or missing JWT token.",
                    data = (object)null,
                    errors = new { code = 401 }
                });
            }


            int UserID = int.Parse(userIdClaim);

            bool IsDeleted = EcommerceBusiness.ClearCart(UserID);

            return Ok(new
            {
                success = IsDeleted,
                message = IsDeleted ? "Cart cleared successfully" : "Failed to clear cart",
                data = IsDeleted,
                errors = (object)null
            });
        }


        [HttpGet("CheckEmailExists", Name = "CheckEmailExists")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<bool> CheckEmailExists(string email)
        {
            if (email == null)
            {
                return BadRequest(new
                {
                    message = $"your email : {email} is NULL",
                    code = 404
                });
            }
            bool IsFound = EcommerceBusiness.CheckEmailExists(email);

              return Ok(IsFound);

        }

        
        [HttpPost("RegisterUser", Name = "RegisterUser")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<object> RegisterUser([FromBody] RegisterUserDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new
                {
                    message = "Invalid request data",
                    code = 400
                });
            }

            var result = EcommerceBusiness.RegisterUser(dto);

            dynamic res = result;
            if (res.Success == 0)
            {
                return BadRequest(new
                {
                    message = res.Message,
                    code = 400
                });
            }

            return Ok(new
            {
                success = res.Success,
                message = res.Message,
                newUserID = res.NewUserID
            });
        }


        [HttpPost("Register", Name = "Register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<RegisterResDTO> Register([FromBody] RegisterReqDTO RegisterDTO)
        {
            // ModelState automatically validates based on Data Annotations
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            RegisterResDTO Results = EcommerceBusiness.Register(RegisterDTO);

            if (!Results.Success)
            {
                return BadRequest(Results); 
            }

            return Ok(Results); 
        }



        // LOGIN ENDPOINT
        [HttpPost("Login", Name = "Login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult<LoginResDTO> Login([FromBody] LoginReqDTO LoginDTO)
        {
            // Validate input using ModelState (Data Annotations)
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            LoginResDTO result = EcommerceBusiness.Login(LoginDTO);

            if (!result.Success)
            {
                return Unauthorized(result);
            }

            return Ok(result);
        }


        // profile-page
        [Authorize]
        [HttpGet("UserDashboard", Name = "GetUserDashboard")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult<object> GetUserDashboard()
        {
            try
            {
                // Extract user ID from JWT token
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Invalid or missing JWT token.",
                        data = (object?)null, 
                        errors = new { code = 401 }
                    });
                }

                int userId = int.Parse(userIdClaim);

                UserDashboardDTO result = EcommerceBusiness.GetUserDashboard(userId);

                if (result == null || result.UserInfo == null) 
                {
                    return Ok(new
                    {
                        success = false,
                        message = "User dashboard data not found.",
                        data = (object?)null, 
                        errors = new { code = 404 }
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "User dashboard retrieved successfully",
                    data = result,
                    errors = (object?)null
                });
            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    success = false,
                    message = "An unexpected error occurred",
                    data = (object?)null, 
                    errors = new { details = ex.Message }
                });
            }
        }


        [Authorize]
        [HttpGet("UserPersonalInfo", Name = "GetUserPersonalInfo")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult<object> GetUserPersonalInfo()
        {
            try
            {
                // Extract user ID from JWT token
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Invalid or missing JWT token.",
                        data = (object?)null,
                        errors = new { code = 401 }
                    });
                }

                int userId = int.Parse(userIdClaim);

                var result = EcommerceBusiness.GetUserPersonalInfo(userId);

                if (result == null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "User personal info not found.",
                        data = (object?)null,
                        errors = new { code = 404 }
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "User personal info retrieved successfully",
                    data = result,
                    errors = (object?)null
                });
            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    success = false,
                    message = "An unexpected error occurred",
                    data = (object?)null,
                    errors = new { details = ex.Message }
                });
            }
        }



        [Authorize]
        [HttpPut("UpdateUserPersonalInfo", Name = "UpdateUserPersonalInfo")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<UpdatedUserPersonalInfoOutputDTO> UpdateUserPersonalInfo([FromBody] UpdateUserPersonalInfoInputDTO model)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Invalid or missing JWT token.",
                        data = (object?)null,
                        errors = new { code = 401 }
                    });
                }

                int userId = int.Parse(userIdClaim);

                UpdatedUserPersonalInfoOutputDTO result = EcommerceBusiness.UpdateUserPersonalInfo(userId, model);

                if (result == null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "User not found or update failed.",
                        data = (object?)null,
                        errors = new { code = 404 }
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "User personal info updated successfully",
                    data = result,
                    errors = (object?)null
                });
            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    success = false,
                    message = "An unexpected error occurred",
                    data = (object?)null,
                    errors = new { details = ex.Message }
                });
            }
        }


        [Authorize]
        [HttpGet("GetUserAddresses", Name = "GetUserAddresses")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult<object> GetUserAddresses()
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Invalid or missing JWT token.",
                        data = (object?)null,
                        errors = new { code = 401 }
                    });
                }

                int userId = int.Parse(userIdClaim);
                var result = EcommerceBusiness.GetUserAddresses(userId);

                return Ok(new
                {
                    success = true,
                    message = "User addresses retrieved successfully",
                    data = result,
                    errors = (object?)null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An unexpected error occurred",
                    data = (object?)null,
                    errors = new { code = 500, details = ex.Message }
                });
            }
        }


        [Authorize]
        [HttpPost("AddUserAddress", Name = "AddUserAddress")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<AddUserAddressOutputDTO> AddUserAddress([FromBody] AddUserAddressInputDTO model)
        {
            try
            {
                // Extract user ID from JWT token
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Invalid or missing JWT token.",
                        data = (object?)null,
                        errors = new { code = 401 }
                    });
                }

                int userId = int.Parse(userIdClaim);

                AddUserAddressOutputDTO result = EcommerceBusiness.AddUserAddress(userId, model);

                if (result == null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Address could not be added.",
                        data = (object?)null,
                        errors = new { code = 400 }
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Address added successfully",
                    data = result,
                    errors = (object?)null
                });
            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    success = false,
                    message = "An unexpected error occurred",
                    data = (object?)null,
                    errors = new { details = ex.Message }
                });
            }
        }


        [Authorize]
        [HttpPut("UpdateUserAddress/{addressId}", Name = "UpdateUserAddress")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<object> UpdateUserAddress(int addressId, [FromBody] UpdateUserAddressInputDTO model)
        {
            try
            {
                // Extract user ID from JWT token
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Invalid or missing JWT token.",
                        data = (object?)null,
                        errors = new { code = 401 }
                    });
                }

                int userId = int.Parse(userIdClaim);

                // Validate input using ModelState (Data Annotations)
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Validation failed",
                        data = (object?)null,
                        errors = ModelState
                    });
                }

                var updatedAddress = EcommerceBusiness.UpdateUserAddress(userId, addressId, model);

                if (updatedAddress == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Address not found or unauthorized.",
                        data = (object?)null,
                        errors = new { code = 404 }
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Address updated successfully",
                    data = updatedAddress,
                    errors = (object?)null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An unexpected error occurred",
                    data = (object?)null,
                    errors = new { code = 500, details = ex.Message }
                });
            }
        }



        [Authorize]
        [HttpDelete("DeleteUserAddress/{addressId}", Name = "DeleteUserAddress")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<object> DeleteUserAddress(int addressId)
        {
            try
            {
                // Extract user ID from JWT token
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Invalid or missing JWT token.",
                        data = (object?)null,
                        errors = new { code = 401 }
                    });
                }

                int userId = int.Parse(userIdClaim);

                var result = EcommerceBusiness.DeleteUserAddress(userId, addressId);

                return Ok(new
                {
                    success = true,
                    message = result.Message,
                    data = new {
                        addressId = addressId,
                        status = result.Status,
                        Message = result.Message
                    },
                    errors = (object?)null
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return NotFound(new
                {
                    success = false,
                    message = ex.Message,
                    data = (object?)null,
                    errors = new { code = 404 }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An unexpected error occurred",
                    data = (object?)null,
                    errors = new { code = 500, details = ex.Message }
                });
            }
        }



        [Authorize]
        [HttpGet("GetUserOrders", Name = "GetUserOrders")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult<List<GetUserOrdersOutputDTO>> GetUserOrders()
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Invalid or missing JWT token.",
                        data = (object?)null,
                        errors = new { code = 401 }
                    });
                }

                int userId = int.Parse(userIdClaim);

                var orders = EcommerceDataAccess.GetUserOrders(userId);

                return Ok(new
                {
                    success = true,
                    message = orders.Count == 0
                                ? "No orders found for this user"
                                : "User orders retrieved successfully",
                    data = orders,
                    errors = (object?)null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An unexpected error occurred",
                    data = (object?)null,
                    errors = new { code = 500, details = ex.Message }
                });
            }
        }


        [Authorize]
        [HttpGet("GetOrderDetails/{orderId}", Name = "GetOrderDetails")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult GetOrderDetails(int orderId)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Invalid or missing JWT token.",
                        data = (object?)null,
                        errors = new { code = 401 }
                    });
                }

                int userId = int.Parse(userIdClaim);

                var orderDetails = EcommerceBusiness.GetOrderDetails(orderId, userId);

                return Ok(new
                {
                    success = true,
                    message = "Order details retrieved successfully",
                    data = orderDetails,
                    errors = (object?)null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An unexpected error occurred",
                    data = (object?)null,
                    errors = new { code = 500, details = ex.Message }
                });
            }
        }

        //change password         
        [Authorize]
        [HttpPost("UpdateUserPassword", Name = "UpdateUserPassword")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult UpdateUserPassword([FromBody] ChangePasswordReqDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Validation failed",
                    errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                });
            }

            try
            {
                if (dto == null ||
                    string.IsNullOrWhiteSpace(dto.CurrentPassword) ||
                    string.IsNullOrWhiteSpace(dto.NewPassword))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Current password and new password are required",
                        errors = new { code = 400 }
                    });
                }

                // Extract user ID from JWT token
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {

                    return Unauthorized(new
                    {
                        success = false,
                        message = "Invalid or missing JWT token.",
                        errors = new { code = 401, debug = "User ID claim not found" }
                    });
                }
                var IsUserPasswordUpdated = EcommerceBusiness.UpdateUserPassword(userId, dto.CurrentPassword, dto.NewPassword);

                if (!IsUserPasswordUpdated)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Current password is incorrect",
                        errors = new { code = 400 }
                    });
                }


                return Ok(new
                {
                    success = true,
                    message = "User Password Updated successfully",
                    errors = (object?)null
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating password for user");
                return StatusCode(500, new
                {
                    success = false,
                    message = "An unexpected error occurred",
                    errors = new { code = 500, details = ex.Message }
                });
            }
        }
                

        // BONUS: TEST JWT TOKEN WORKS
        // Create a Protected Endpoint(Optional Test):
        [Authorize] 
        [HttpGet("Protected", Name = "Protected")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult<object> Protected()
        {
            // Get user info from JWT token
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            return Ok(new
            {
                message = "You are authenticated!",
                userId = userId,
                email = email,
                role = role
            });
        }

                
        [AllowAnonymous]
        [HttpPost("ForgotPassword")]
        public async  Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordReqDTO dto)
        {
            var link = EcommerceBusiness.ForgotPassword(dto.Email);

            if (link != null)
            {
                await _emailService.SendEmailAsync(
                    dto.Email,
                    "Reset Password",
                    $@"
                       <h2>Password Reset</h2>
                       <p>Click the link below to reset your password:</p>
                       
                       <a href='{link}'> Reset Password </a>
                    "
                );
            }

            return Ok(new
            {
                success = true,
                message = "If the email exists, a reset link has been sent. Check your E-mail",
                resetLink = link 
            });
        }


       
        [AllowAnonymous]
        [HttpPost("ResetPassword")]
        public IActionResult ResetPassword([FromBody] ResetPasswordReqDTO dto)
        {
            bool result = EcommerceBusiness.ResetPassword(dto.Token, dto.NewPassword);

            if (!result)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid or expired token"
                });
            }

            return Ok(new
            {
                success = true,
                message = "Password has been reset successfully"
            });
        }



        [Authorize]
        [HttpGet("PaymentMethods")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult GetPaymentMethods()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Invalid or missing JWT token.",
                        data = (object?)null,
                        errors = new { code = 401 }
                    });
                }

                int userId = int.Parse(userIdClaim);

                var result = EcommerceBusiness.GetUserPaymentMethods(userId);

                var response = result.Select(x => new UserPaymentMethodDTO
                {
                    PaymentMethodID = x.PaymentMethodID,
                    Brand = x.Brand,
                    Last4 = x.CardLast4,
                    CardHolderName = x.CardHolderName,
                    ExpMonth = x.ExpiryMonth,
                    ExpYear = x.ExpiryYear,
                    IsDefault = x.IsDefault,
                });

                return Ok(new
                {
                    success = true,
                    message = "Payment methods retrieved successfully",
                    data = response,
                    errors = (object?)null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An unexpected error occurred",
                    data = (object?)null,
                    errors = new { code = 500, details = ex.Message }
                });
            }
        }


        [Authorize]
        [HttpPost("AddPaymentMethods")]
        public IActionResult AddPaymentMethod([FromBody] AddUserPaymentMethodInputDTO dto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new { success = false, message = "Unauthorized" });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(new { success = false, errors = ModelState });
                }

                int userId = int.Parse(userIdClaim);
               
                // Create internal DTO without calling Stripe API
                var internalDto = new UserPaymentMethodInternalDTO
                {
                    UserID = userId,
                    StripePaymentMethodId = dto.StripePaymentMethodId,
                    Brand = dto.Brand,
                    CardLast4 = dto.CardLast4,
                    CardHolderName = dto.CardHolderName,
                    ExpiryMonth = dto.ExpiryMonth,
                    ExpiryYear = dto.ExpiryYear,
                    IsDefault = dto.IsDefault
                };

                EcommerceBusiness.AddPaymentMethod(internalDto);

                return Ok(new
                {
                    success = true,
                    message = "Payment method added successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding payment method");
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

   

        [Authorize]
        [HttpDelete("DeletePaymentMethods/{paymentMethodId}")]
        public IActionResult DeletePaymentMethod(int paymentMethodId)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Invalid or missing JWT token.",
                        data = (object?)null,
                        errors = new { code = 401 }
                    });
                }

                int userId = int.Parse(userIdClaim);

                EcommerceBusiness.DeletePaymentMethod(paymentMethodId, userId);

                return Ok(new
                {
                    success = true,
                    message = "Payment method deleted successfully",
                    data = new { paymentMethodId },
                    errors = (object?)null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An unexpected error occurred",
                    data = (object?)null,
                    errors = new { code = 500, details = ex.Message }
                });
            }
        }



        [Authorize]
        [HttpPut("payment-methods/{paymentMethodId}/default")]
        public IActionResult SetDefaultPaymentMethod(int paymentMethodId)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Invalid or missing JWT token.",
                        data = (object?)null,
                        errors = new { code = 401 }
                    });
                }

                int userId = int.Parse(userIdClaim);

                EcommerceBusiness.SetDefaultPaymentMethod(paymentMethodId, userId);

                return Ok(new
                {
                    success = true,
                    message = "Default payment method updated successfully",
                    data = new { paymentMethodId },
                    errors = (object?)null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An unexpected error occurred",
                    data = (object?)null,
                    errors = new { code = 500, details = ex.Message }
                });
            }
        }

        

        [HttpPost("ValidatePromoCode", Name = "ValidatePromoCode")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]

        public ActionResult<PromoValidationResultDto> ValidatePromoCode([FromBody] ValidatePromoDto dto)
        {
            try {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new
                    {
                        isValid = false,
                        message = "Invalid or missing JWT token.",
                        discountAmount = 0
                    });
                }

                int UserId = int.Parse(userIdClaim);
                if (dto == null ||
                       string.IsNullOrWhiteSpace(dto.Code) ||
                       dto.OrderTotal <= 0 
                )
                {
                   return BadRequest(new
                   {
                       isValid = false,
                       message = "All Inputs are required",
                       discountAmount = 0
                   });
                } 
               
               var result = EcommerceBusiness.ValidatePromoCode(dto.Code, dto.OrderTotal, UserId);


                if (!result.IsValid)
                   return BadRequest(result);
               
               return Ok(result);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    isValid = false,
                    message = "Something went wrong",
                    discountAmount = 0
                });
            }
        }



        [Authorize]
        [HttpPost("CreateOrder", Name = "CreateOrder")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult<CreateOrderResponseDto> CreateOrder([FromBody] CreateOrderRequestDto request)
            {
            try
            {
                // Extract user ID from JWT token
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid or missing JWT token.",
                    data = new CreateOrderResponseDto { PaymentIntentId = "", FinalAmount =0, ClientSecret =""},
                    errors = new { code = 401 }
                });
            }

                int userId = int.Parse(userIdClaim);

                var result = EcommerceBusiness.CreateOrder(request, userId);

            return Ok(new
            {
                success = true,
                message = "Order Created successfully",
                data = result,
                errors = (object)null
            });

            }
            catch (Exception ex) 
            {
                return BadRequest(new 
                {
                    success = false,
                    message = ex.Message, 
                    data = (object)null,
                    errors = new { code = 400 }
                });
            }
        }


        //Checkout
        [Authorize]
        [HttpGet("CheckoutInit")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult GetCheckoutInit()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Invalid or missing JWT token.",
                        data = (object?)null,
                        errors = new { code = 401 }
                    });
                }

                int userId = int.Parse(userIdClaim);
                var service = new CheckoutService();
                var result = service.GetCheckoutInitData(userId);

                return Ok(new
                {
                    success = true,
                    message = "Checkout data loaded successfully",
                    data = result,
                    errors = (object?)null
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "An error occurred",
                    data = (object?)null,
                    errors = ex.Message
                });
            }
        }
    }
}














