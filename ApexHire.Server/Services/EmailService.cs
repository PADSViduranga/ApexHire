using ApexHire.Server.Configurations;
using ApexHire.Server.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace ApexHire.Server.Services;

public class EmailService : IEmailService
{
    private readonly EmailSettings _emailSettings;

    public EmailService(
        IOptions<EmailSettings> emailOptions)
    {
        _emailSettings = emailOptions.Value;
    }

    public async Task SendEmailAsync(
        string toEmail,
        string subject,
        string htmlBody)
    {
        if (string.IsNullOrWhiteSpace(toEmail))
        {
            throw new ArgumentException(
                "Recipient email is required.",
                nameof(toEmail));
        }

        var message = new MimeMessage();

        message.From.Add(
            new MailboxAddress(
                _emailSettings.SenderName,
                _emailSettings.SenderEmail));

        message.To.Add(
            MailboxAddress.Parse(toEmail));

        message.Subject = subject;

        message.Body = new BodyBuilder
        {
            HtmlBody = htmlBody
        }.ToMessageBody();

        using var smtpClient = new SmtpClient();

        SecureSocketOptions socketOptions =
            _emailSettings.SmtpPort == 465
                ? SecureSocketOptions.SslOnConnect
                : SecureSocketOptions.StartTls;

        await smtpClient.ConnectAsync(
            _emailSettings.SmtpServer,
            _emailSettings.SmtpPort,
            socketOptions);

        await smtpClient.AuthenticateAsync(
            _emailSettings.Username,
            _emailSettings.Password);

        await smtpClient.SendAsync(message);

        await smtpClient.DisconnectAsync(
            true);
    }
}