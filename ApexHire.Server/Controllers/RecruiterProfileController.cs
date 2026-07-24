using ApexHire.Server.DTOs;
using ApexHire.Server.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ApexHire.Server.Controllers;

[ApiController]
[Route("api/recruiter-profile")]
[Authorize]
public class RecruiterProfileController
    : ControllerBase
{
    private readonly IRecruiterProfileService
        _service;

    public RecruiterProfileController(
        IRecruiterProfileService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<
        RecruiterProfileResponse>> GetProfile()
    {
        try
        {
            var userId = GetCurrentUserId();

            var profile =
                await _service.GetProfileAsync(userId);

            return Ok(profile);
        }
        catch (UnauthorizedAccessException exception)
        {
            return Unauthorized(new
            {
                message = exception.Message
            });
        }
        catch (KeyNotFoundException exception)
        {
            return NotFound(new
            {
                message = exception.Message
            });
        }
        catch (Exception exception)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    message =
                        "Unable to load recruiter profile.",
                    detail = exception.Message
                });
        }
    }

    [HttpPut]
    public async Task<ActionResult<
        RecruiterProfileResponse>> UpdateProfile(
        [FromBody]
        UpdateRecruiterProfileRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();

            var profile =
                await _service.UpdateProfileAsync(
                    userId,
                    request);

            return Ok(profile);
        }
        catch (UnauthorizedAccessException exception)
        {
            return Unauthorized(new
            {
                message = exception.Message
            });
        }
        catch (KeyNotFoundException exception)
        {
            return NotFound(new
            {
                message = exception.Message
            });
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
        catch (Exception exception)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    message =
                        "Unable to update recruiter profile.",
                    detail = exception.Message
                });
        }
    }

    private int GetCurrentUserId()
    {
        var userIdValue =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub");

        if (!int.TryParse(
                userIdValue,
                out var userId))
        {
            throw new UnauthorizedAccessException(
                "Invalid or missing user identity.");
        }

        return userId;
    }
}