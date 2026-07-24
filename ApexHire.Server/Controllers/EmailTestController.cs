using ApexHire.Server.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ApexHire.Server.Controllers;

[ApiController]
[Route("api/email-test")]
public class EmailTestController : ControllerBase
{
    private readonly IEmailService _emailService;

    public EmailTestController(
        IEmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpPost]
    public async Task<IActionResult> SendTestEmail(
        [FromQuery] string toEmail)
    {
        if (string.IsNullOrWhiteSpace(toEmail))
        {
            return BadRequest(new
            {
                message = "Recipient email is required."
            });
        }

        await _emailService.SendEmailAsync(
            toEmail,
            "ApexHire SMTP Test",
            """
            <h2>ApexHire Email Test</h2>
            <p>Your SMTP email configuration is working correctly.</p>
            """);

        return Ok(new
        {
            message = "Test email sent successfully."
        });
    }
}