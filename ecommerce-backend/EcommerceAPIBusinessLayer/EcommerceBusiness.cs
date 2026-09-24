
using BCrypt.Net; 
using EcommerceAPIDataAccessLayer;


namespace EcommerceAPIBusinessLayer
{
    using EcommerceAPIBusinessLayer.Services;
    using Microsoft.IdentityModel.Tokens;
    using Stripe;
    using System;
    using System.Diagnostics;
    using System.IdentityModel.Tokens.Jwt;
    using System.Net;
    using System.Security.Claims;
    using System.Text;
    using static System.Net.WebRequestMethods;


    public class JwtTokenGenerator
        {
            // JWT Settings (will pass these from Controller via appsettings.json)
            private readonly string _key;
            private readonly string _issuer;
            private readonly string _audience;
            private readonly int _expireMinutes;

            public JwtTokenGenerator(string key, string issuer, string audience, int expireMinutes)
            {
                _key = key;
                _issuer = issuer;
                _audience = audience;
                _expireMinutes = expireMinutes;
            }

            public string GenerateToken(int userId, string email, string role)
            {
                // claims (user information stored in token)
                var claims = new[]
                {
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _issuer,
                    audience: _audience,
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(_expireMinutes),
                    signingCredentials: credentials
                );

                return new JwtSecurityTokenHandler().WriteToken(token); 
            }
    }
    
    public class EcommerceBusiness
    {
        private static string _frontendBaseUrl;

        public static void ConfigureFrontendBaseUrl(string baseUrl)
        {
            _frontendBaseUrl = baseUrl;
        }

        public static void ConfigureConnectionString(string connectionString)
        {
            EcommerceDataAccess.ConfigureConnectionString(connectionString);
        }


        // JWT settings (will be passed from Controller)
        private static string _jwtKey;
        private static string _jwtIssuer;
        private static string _jwtAudience;
        private static int _jwtExpireMinutes;

        // Method to initialize JWT settings (called from Controller startup)
        public static void ConfigureJwt(string key, string issuer, string audience, int expireMinutes)
        {
            _jwtKey = key;
            _jwtIssuer = issuer;
            _jwtAudience = audience;
            _jwtExpireMinutes = expireMinutes;
        }

        public static List<ProductDTO> GetTopRatedProducts(float minRating, int minReviews, int topCount)
        {
            return EcommerceDataAccess.GetTopRatedProducts(minRating, minReviews, topCount);
        }


        public static ProductImagesDTO GetProductImages(int ProductID)
        {
            return EcommerceDataAccess.GetProductImages(ProductID);
        }


        public static List<string> GetProductThumbnails(int ProductID)
        {
            return EcommerceDataAccess.GetProductThumbnails(ProductID);
        }


        public static List<ImagesDTO> GetHomeFashionImages(string sectionName)
        {
            return EcommerceDataAccess.GetHomeFashionImages(sectionName);
        }

        public static List<ProductWithCategoryDTO> GetProductWithCategory(string slug)
        {
            return EcommerceDataAccess.GetProductWithCategory(slug);
        }


        //pagination
        public static PagedProductsDTO GetPagedProducts(int categoryID, int pageNumber, int pageSize)
        {
            return EcommerceDataAccess.GetPagedProducts(categoryID, pageNumber, pageSize);
        }



        //Search feature
        //phase-1
        public static PagedProductsDTO GetSearchedProducts(string searchTerm, int pageNumber, int pageSize)
        {
            return EcommerceDataAccess.GetSearchedProducts(searchTerm, pageNumber, pageSize);
        }

        //phase-2
        public static List<SearchSuggestionDTO> GetSearchSuggestions(string searchTerm)
        {
            return EcommerceDataAccess.GetSearchSuggestions(searchTerm);
        }


        public static List<HomeSectionDTO> GetHomeSectionsWithSlugs()
        {
            return EcommerceDataAccess.GetHomeSectionsWithSlugs();
        }


        public static List<HomeSectionDTOO> GetHomePageSections()
        {
            return EcommerceDataAccess.GetHomePageSections();
        }


        public static List<CarouselItemDTO> GetHomeSectionCarousel(string sectionSlug)
        {
            return EcommerceDataAccess.GetHomeSectionCarousel(sectionSlug);
        }


        public static CategoryNavigationResultDTO GetCategoryNavigationData(string slugPath, string navigationType = "AUTO")
        {
            return EcommerceDataAccess.GetCategoryNavigationData(slugPath, navigationType);
        }


        public static List<CategorySidebarDTO> GetCategorySidebar()
        {
            return EcommerceDataAccess.GetCategorySidebar();
        }


        public static ProductDTO GetProductById(int ProductID)
        {
            return EcommerceDataAccess.GetProductById(ProductID);
        }


        // wishlist
        public static WishlistCountDTO GetWishlistCount(int UserID)
        {
            return EcommerceDataAccess.GetWishlistCount(UserID);
        }


        public static List<WishlistDTO> GetWishlistByUserID(int UserID)
        {
            return EcommerceDataAccess.GetWishlistByUserID(UserID); 
        }


        public static bool IsProductInWishlist(int UserID, int ProductID)
        {
            return EcommerceDataAccess.IsProductInWishlist(UserID, ProductID);
        }


        public static bool AddToWishlist(int UserID, int ProductID)
        {
            return EcommerceDataAccess.AddToWishlist(UserID, ProductID);
        }


        public static bool RemoveFromWishlist(int UserID, int ProductID)
        {
            return EcommerceDataAccess.RemoveFromWishlist(UserID, ProductID);
        }


        public static bool ClearWishlist(int UserID)
        {
            return EcommerceDataAccess.ClearWishlist(UserID);
        }


        // cart
        public static CartSummaryDTO GetCartSummary(int UserID)
        {
            return EcommerceDataAccess.GetCartSummary(UserID);
        }


        public static List<CartDTO> GetCartItemsByUserID(int UserID)
        {
            return EcommerceDataAccess.GetCartItemsByUserID(UserID);
        }


        public static object InsertUpdateCartItems(int UserID, int ProductID)
        {
            return EcommerceDataAccess.InsertUpdateCartItems(UserID, ProductID);
        }


        public static object RemoveCartItem(int UserID, int ProductID)
        {
            return EcommerceDataAccess.RemoveCartItem(UserID, ProductID);
        }


        public static object IncrementDecrementCartItem(int UserID, int ProductID, string Action)
        {
            return EcommerceDataAccess.IncrementDecrementCartItem (UserID, ProductID, Action);
        }


        public static bool ClearCart(int UserID)
        {
            return EcommerceDataAccess.ClearCart(UserID);
        }
        

        public static bool CheckEmailExists (string email)
        {
            return EcommerceDataAccess.CheckEmailExists(email);
        }


        public static RegisterUserResultDTO RegisterUser(RegisterUserDTO dto)
        {
            return EcommerceDataAccess.RegisterUser(dto);
        }


        public static RegisterResDTO Register(RegisterReqDTO RegisterDTO)
        {
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(RegisterDTO.Password);
            RegisterDTO.Password = hashedPassword;

            return EcommerceDataAccess.Register(RegisterDTO);
        }


        public static LoginResDTO Login(LoginReqDTO LoginDTO)
        {
            // Step 1: Call Data Access Layer to get user data (including PasswordHash)
            LoginInternalDTO internalResult = EcommerceDataAccess.Login(LoginDTO);

            // Step 2: Check if user was found
            if (!internalResult.Success)
            {
                // User not found - return error response (no password hash exposed)
                return new LoginResDTO(
                    0,
                    null,
                    null,
                    null,
                    null,
                    false,
                    null,
                    false,
                    internalResult.Message // "Invalid email or password"
                );
            }

            // Step 3: Verify password using BCrypt
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(LoginDTO.Password, internalResult.PasswordHash);

            if (!isPasswordValid)
            {
                // Password is wrong - return generic error (don't reveal if email was correct)
                return new LoginResDTO(
                    0,
                    null,
                    null,
                    null,
                    null,
                    false,
                    null,
                    false,
                    "Invalid email or password" // Same message as "user not found" (security)
                );
            }

            // Step 4: (Optional) Check if email is verified
           

            // Step 5: Generate JWT Token
            var tokenGenerator = new JwtTokenGenerator(_jwtKey, _jwtIssuer, _jwtAudience, _jwtExpireMinutes);
            string jwtToken = tokenGenerator.GenerateToken(
                internalResult.UserID,
                internalResult.Email,
                internalResult.Role
            );

            // Step 6: Password is correct - return success response (WITHOUT PasswordHash!)
            // Return success response with JWT Token
            return new LoginResDTO(
                internalResult.UserID,
                internalResult.FirstName,
                internalResult.LastName,
                internalResult.Email,
                internalResult.Role,
                internalResult.IsEmailVerified,
                jwtToken, // JWT Token included
                true,
                "Login successful"
            );
        }

        
        // profilr -page
        public static UserDashboardDTO GetUserDashboard(int userId)
        {
            return EcommerceDataAccess.GetUserDashboard(userId);
        }


        public static UserPersonalInfoDTO GetUserPersonalInfo(int userId)
        {
            return EcommerceDataAccess.GetUserPersonalInfo(userId);
        }


        public static UpdatedUserPersonalInfoOutputDTO UpdateUserPersonalInfo(int userId, UpdateUserPersonalInfoInputDTO model)
        {
            return EcommerceDataAccess.UpdateUserPersonalInfo(userId, model);
        }


        public static List<UserAddressDTO> GetUserAddresses(int userId)
        {
            return EcommerceDataAccess.GetUserAddresses(userId);
        }


        public static AddUserAddressOutputDTO AddUserAddress(int userId, AddUserAddressInputDTO model)
        {
            if (model == null)
                throw new ArgumentNullException(nameof(model));


            if (model.IsDefault)
            {
                EcommerceDataAccess.UnsetDefaultAddress(userId);
            }

            return EcommerceDataAccess.AddUserAddress(userId, model);
        }


        public static UpdateUserAddressOutputDTO UpdateUserAddress(int userId, int addressId, UpdateUserAddressInputDTO model)
        {
            return EcommerceDataAccess.UpdateUserAddress(userId, addressId, model);
        }


        public static DeleteAddressResponseDTO DeleteUserAddress(int userId, int addressId)
        {
             return EcommerceDataAccess.DeleteUserAddress(userId, addressId);
        }


        public static List<GetUserOrdersOutputDTO> GetUserOrders(int userId)
        {
            return EcommerceDataAccess.GetUserOrders(userId);
        }


        public static OrderDetailsDTO GetOrderDetails(int orderId, int userId)
        {
            return EcommerceDataAccess.GetOrderDetails(orderId, userId);
        }


        public static bool UpdateUserPassword(int userId, string currentPassword, string newPassword)
        {
            // Get stored password hash
            string storedHash = EcommerceDataAccess.GetPasswordHashByUserId(userId);
            if (string.IsNullOrEmpty(storedHash))
                return false;

            // Verify current password
            bool isValid = BCrypt.Net.BCrypt.Verify(currentPassword, storedHash);

            if (!isValid)
                return false;

            // Hash new password
            string newHash = BCrypt.Net.BCrypt.HashPassword(newPassword);

            // Update password in database
            return EcommerceDataAccess.UpdateUserPassword(userId, newHash);
        }

     
        //forget password
        public static string? ForgotPassword(string email)
        {
            var user = EcommerceDataAccess.GetUserByEmail(email);

            // Security: always return the same message/response to prevent email enumeration
            if (user == null)
                return null;    

            string token = Guid.NewGuid().ToString();

            EcommerceDataAccess.CreatePasswordResetToken(user.UserId, token);

            return $"{_frontendBaseUrl}/reset-password?token={token}";
        }

        public static bool ResetPassword(string token, string newPassword)
        {
            //var tokenData = EcommerceDataAccess.GetPasswordResetToken(token);
            var tokenData = EcommerceDataAccess.GetPasswordResetToken(token);
            

            if (tokenData == null)
                return false;

            if (tokenData.IsUsed)
                return false;

            if (tokenData.ExpiryDate < DateTime.UtcNow)
                return false;

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(newPassword);

            EcommerceDataAccess.UpdateUserPassword(tokenData.UserId, hashedPassword);

            EcommerceDataAccess.MarkPasswordResetTokenAsUsed(tokenData.TokenId);

            return true;
        }
        
        
        //PaymentMethods
        public static List<UserPaymentMethodInternalDTO> GetUserPaymentMethods(int userId)
        {
            return EcommerceDataAccess.GetUserPaymentMethods(userId);
        }


        public static void DeletePaymentMethod(int paymentMethodId, int userId)
        {
            EcommerceDataAccess.DeleteUserPaymentMethod(paymentMethodId, userId);
        }

        public static void SetDefaultPaymentMethod(int paymentMethodId, int userId)
        {
            EcommerceDataAccess.SetDefaultPaymentMethod(paymentMethodId, userId);
        }


        //PaymentMethods
        public static void AddPaymentMethod(UserPaymentMethodInternalDTO dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            // Remove existing default payment method before setting a new one
            if (dto.IsDefault)
            {
                EcommerceDataAccess.UnsetDefaultPaymentMethod(dto.UserID);
            }

            EcommerceDataAccess.AddUserPaymentMethod(dto);
        }


        //PromoCode
        public static PromoValidationResultDto ValidatePromoCode(string code, decimal orderTotal, int? userId)
        {
            //var promo = EcommerceDataAccess.ValidatePromoCode(code);
            var promo = EcommerceDataAccess.GetPromoByCode(code);

            if (promo == null)
                return new PromoValidationResultDto(false, "Invalid promo code", 0);

            if (!promo.IsActive)
                return new PromoValidationResultDto(false, "Promo code is not active", 0);

            if (promo.ExpiryDate.HasValue && promo.ExpiryDate < DateTime.Now)
                return new PromoValidationResultDto(false, "Promo code expired", 0);

            if (promo.UsageLimit.HasValue && promo.UsedCount >= promo.UsageLimit)
                return new PromoValidationResultDto(false, "Promo usage limit reached", 0);

            if (promo.MinimumOrderAmount.HasValue && orderTotal < promo.MinimumOrderAmount)
                return new PromoValidationResultDto(false, $"Your order total must be at least EGP {promo.MinimumOrderAmount.Value:N2} to use this promo code.", 0);

            if (promo.UserId.HasValue && promo.UserId != userId)
                return new PromoValidationResultDto(false, "Promo not valid for this user", 0);

            decimal discount = 0;

            if (promo.DiscountType == 1) // Percentage
            {
                discount = (orderTotal * promo.DiscountValue) / 100;

                if (promo.MaximumDiscountAmount.HasValue && discount > promo.MaximumDiscountAmount)
                    discount = promo.MaximumDiscountAmount.Value;
            }
            else // Fixed
            {
                discount = promo.DiscountValue;
            }

            return new PromoValidationResultDto(true, "Promo applied successfully", discount);
        }



        public static CreateOrderResponseDto CreateOrder(CreateOrderRequestDto request, int userId)
        {

            EcommerceDataAccess.CleanupExpiredPendingOrders();

            var productIds = request.Items.Select(i => i.ProductId).ToList();

            var dbProducts = EcommerceDataAccess.GetProductsByIds(productIds);

            decimal subtotal = 0;

            foreach (var item in request.Items)
            {
                var product = dbProducts.FirstOrDefault(p => p.ProductID == item.ProductId);

                if (product == null)
                    throw new Exception("Product not found");

                if (item.Quantity > product.Quantity)
                    throw new Exception("Insufficient stock"); 

                subtotal += product.Price * item.Quantity;
            }


            decimal shipping = 0;

            if (subtotal < 1000)
                shipping = 50;
            else
                shipping = 0; 


            decimal taxRate = 0.14m;
            decimal tax = Math.Round(subtotal * taxRate, 2);



            //PromoCode
            decimal discount = 0;
            
            if (!string.IsNullOrEmpty(request.PromoCode))
            {
                // Promo validation is handled in Business Layer
                var promoResult = ValidatePromoCode( 
                    request.PromoCode,
                    subtotal,
                    userId
                );

                if (!promoResult.IsValid)
                    throw new Exception(promoResult.Message); 

                discount = promoResult.DiscountAmount;
            }

            decimal totalAmount = subtotal + shipping + tax;

            decimal finalAmount = subtotal + shipping + tax - discount;

            if (finalAmount < 0)
                finalAmount = 0;

            //stripe
            var stripeService = new StripeService();
            var paymentIntent = stripeService.CreatePaymentIntent(finalAmount);

            string paymentIntentId = paymentIntent.Id;

            var orderAddress = new OrderAddressDto
            {
                FirstName = request.Customer.FirstName,
                LastName = request.Customer.LastName,
                Email = request.Customer.Email,
                Phone = request.Customer.Phone,

                StreetAddress = request.Address.StreetAddress,
                City = request.Address.City,
                State = request.Address.State,
                PostalCode = request.Address.PostalCode,
                Country = request.Address.Country
            };


            //Transaction
            int orderId = EcommerceDataAccess.SaveOrderWithTransaction( 
                userId,
                subtotal,
                shipping,
                tax,
                discount,
                totalAmount, 
                finalAmount,
                request.PromoCode ?? "",
                paymentIntentId,
                request.Payment.PaymentBrand,
                request.Payment.PaymentLast4,
                request.Payment.PaymentMethodId,
                orderAddress,
                request.Items
            );

            return new CreateOrderResponseDto
            {
                PaymentIntentId = paymentIntentId,
                FinalAmount = finalAmount,
                ClientSecret = paymentIntent.ClientSecret,
                OrderNumber = orderId.ToString(), 

                Subtotal = subtotal,
                Shipping = shipping,
                Tax = tax,   
                Discount = discount,
            };
        }


        public static void MarkOrderAsPaid(string paymentIntentId, 
                                           string? paymentBrand = null,
                                           string? paymentLast4 = null,
                                           string? paymentMethodId = null)
        {
            EcommerceDataAccess.CompleteOrderAfterPayment(paymentIntentId,
                                                          paymentBrand,
                                                          paymentLast4,
                                                          paymentMethodId);
        }
    }
}


