using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace EcommerceAPI.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        public async Task SendEmailAsync(
            string toEmail,
            string subject,
            string body)
        {
            var email = new MimeMessage();

            email.From.Add(
                new MailboxAddress(
                    _configuration["Brevo:SenderName"],
                    _configuration["Brevo:SenderEmail"]
                )
            );

            email.To.Add(
                MailboxAddress.Parse(toEmail)
            );

            email.Subject = subject;


            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = body
            };

            email.Body = bodyBuilder.ToMessageBody();


            using var smtp = new SmtpClient();


            await smtp.ConnectAsync(
                _configuration["Brevo:SmtpServer"],
                int.Parse(_configuration["Brevo:Port"]),
                SecureSocketOptions.StartTls
            );


            await smtp.AuthenticateAsync(
                _configuration["Brevo:Username"],
                _configuration["Brevo:Password"]
            );


            await smtp.SendAsync(email);


            await smtp.DisconnectAsync(true);
        }
    }
}
