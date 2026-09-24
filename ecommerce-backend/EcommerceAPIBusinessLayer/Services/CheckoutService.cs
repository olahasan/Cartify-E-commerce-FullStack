using EcommerceAPIDataAccessLayer;
using Microsoft.SqlServer.Server;

namespace EcommerceAPIBusinessLayer.Services
{
    public class CheckoutService
    {
        public CheckoutInitDTO GetCheckoutInitData(int userId) 
        {
            var user = EcommerceDataAccess.GetUserById(userId);
            var defaultAddress = EcommerceDataAccess.GetDefaultAddress(userId);
            var defaultPayment = EcommerceDataAccess.GetDefaultPaymentMethod(userId);

            return new CheckoutInitDTO 
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Phone = user.Phone,
                DefaultAddress = defaultAddress,
                DefaultPaymentMethod = defaultPayment
            };
        }
    }
}


