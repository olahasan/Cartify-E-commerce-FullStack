using EcommerceAPIBusinessLayer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace EcommerceAPI.Controllers
{
    [Route("api/webhook/stripe")]
    [DisableRequestSizeLimit]
    public class StripeWebhookController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public StripeWebhookController(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        [HttpPost("StripeWebhook")]
        [AllowAnonymous]  // Stripe webhooks are sent by Stripe, so JWT authentication is not required.
        public async Task<IActionResult> StripeWebhook()
        {

            // Read the raw request body for Stripe signature verification.
            Request.EnableBuffering();

            string json;
            using (var reader = new StreamReader(
            Request.Body,
            encoding: System.Text.Encoding.UTF8,
            detectEncodingFromByteOrderMarks: false,
            leaveOpen: true))
            {
                json = await reader.ReadToEndAsync();
                Request.Body.Position = 0; // Reset stream position after reading.
            }

            var stripeSignature = Request.Headers["Stripe-Signature"];
            var webhookSecret = _configuration["Stripe:WebhookSecret"];

            Event stripeEvent;

            try
            {
                stripeEvent = EventUtility.ConstructEvent(
                    json,
                    stripeSignature,
                    webhookSecret,
                    300L, // Signature tolerance (5 minutes)
                    false // Ignore API version mismatch
                ); 
            }
            catch (StripeException ex)
            {
                return BadRequest($"Webhook Error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return BadRequest($"Webhook Error: {ex.Message}");
            }

            if (stripeEvent.Type == "payment_intent.succeeded")
            {
                var paymentIntent = stripeEvent.Data.Object as PaymentIntent;

                if (paymentIntent != null)
                    EcommerceBusiness.MarkOrderAsPaid(paymentIntent.Id);
            }

            if (stripeEvent.Type == "charge.succeeded")
            {
                var charge = stripeEvent.Data.Object as Charge;
                if (charge != null)
                {
                    var brand = charge.PaymentMethodDetails?.Card?.Brand;
                    var last4 = charge.PaymentMethodDetails?.Card?.Last4;
                    var pmId = charge.PaymentMethod as string; 
                    var piId = charge.PaymentIntentId;

                    try
                    {
                        EcommerceBusiness.MarkOrderAsPaid(piId, brand, last4, pmId);
                    }
                    catch (Exception ex)
                    {
                        // Ignore payment detail update failure without affecting the webhook response.
                    }
                }
            }

            return Ok();
        }
    }
}