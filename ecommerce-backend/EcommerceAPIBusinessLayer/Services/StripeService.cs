using EcommerceAPIDataAccessLayer;
using Stripe; 

namespace EcommerceAPIBusinessLayer.Services
{
    public class StripeService
    {

        public StripeService()
        {
            // ApiKey already configured in Program.cs
        }

        public PaymentMethod GetPaymentMethod(string stripePaymentMethodId) 
        {
            if (string.IsNullOrWhiteSpace(stripePaymentMethodId))
                throw new ArgumentException("StripePaymentMethodId is required");

            var service = new PaymentMethodService(); 

            return service.Get(stripePaymentMethodId);
        }

        public UserPaymentMethodInternalDTO ConvertToInternalDto(PaymentMethod paymentMethod, int userId, bool isDefault)
        {
            if (paymentMethod?.Card == null)
                throw new InvalidOperationException("PaymentMethod does not contain card data");

            return new UserPaymentMethodInternalDTO
            {
                UserID = userId,
                StripePaymentMethodId = paymentMethod.Id,
                Brand = paymentMethod.Card.Brand,
                CardLast4 = paymentMethod.Card.Last4,
                ExpiryMonth = (int)paymentMethod.Card.ExpMonth, 
                ExpiryYear = (int)paymentMethod.Card.ExpYear,
                CardHolderName = paymentMethod.BillingDetails.Name,
                IsDefault = isDefault
            };
        }

        public PaymentIntent CreatePaymentIntent(decimal amount, string currency = "usd")
        {
            if (amount <= 0)
                throw new ArgumentException("Amount must be greater than zero.");

            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(amount * 100), // Stripe uses cents
                Currency = currency,
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = true
                }
            };

            var service = new PaymentIntentService();
            return service.Create(options);
        }


    }
}

