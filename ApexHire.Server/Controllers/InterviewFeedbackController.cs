using ApexHire.Server.Interfaces;
using ApexHire.Server.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ApexHire.Server.Controllers;

[ApiController]
[Route("api/candidate-interview-feedback")]
[Authorize]
public class CandidateInterviewFeedbackController
    : ControllerBase
{
    private readonly ICandidateInterviewFeedbackService
        _feedbackService;

    public CandidateInterviewFeedbackController(
        ICandidateInterviewFeedbackService feedbackService)
    {
        _feedbackService = feedbackService;
    }

    [HttpPost("{interviewId:int}")]
    [Authorize(Roles = "Candidate")]
    public async Task<IActionResult> Create(
        int interviewId,
        [FromBody]
        CreateCandidateInterviewFeedbackRequest request)
    {
        int? candidateUserId = GetCurrentUserId();

        if (candidateUserId is null)
        {
            return Unauthorized(new
            {
                message = "Invalid or missing user ID."
            });
        }

        try
        {
            var feedback = await _feedbackService
                .CreateAsync(
                    interviewId,
                    candidateUserId.Value,
                    request);

            return CreatedAtAction(
                nameof(GetById),
                new
                {
                    feedbackId = feedback.Id
                },
                feedback);
        }
        catch (KeyNotFoundException exception)
        {
            return NotFound(new
            {
                message = exception.Message
            });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new
            {
                message = exception.Message
            });
        }
    }

    [HttpGet("my-feedback")]
    [Authorize(Roles = "Candidate")]
    public async Task<IActionResult> GetMyFeedback()
    {
        int? candidateUserId = GetCurrentUserId();

        if (candidateUserId is null)
        {
            return Unauthorized();
        }

        var feedbackList =
            await _feedbackService
                .GetByCandidateAsync(
                    candidateUserId.Value);

        return Ok(feedbackList);
    }

    [HttpGet("{feedbackId:int}")]
    public async Task<IActionResult> GetById(
        int feedbackId)
    {
        var feedback =
            await _feedbackService
                .GetByIdAsync(feedbackId);

        if (feedback is null)
        {
            return NotFound(new
            {
                message =
                    "Candidate feedback not found."
            });
        }

        return Ok(feedback);
    }

    [HttpGet]
    [Authorize(
        Roles = "Recruiter,HiringManager,Admin")]
    public async Task<IActionResult> GetAll()
    {
        var feedbackList =
            await _feedbackService
                .GetAllAsync();

        return Ok(feedbackList);
    }

    [HttpDelete("{feedbackId:int}")]
    [Authorize(
        Roles = "HiringManager,Admin")]
    public async Task<IActionResult> Delete(
        int feedbackId)
    {
        int? userId =
            GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        string role =
            User.FindFirstValue(
                ClaimTypes.Role) ?? "";

        try
        {
            await _feedbackService
                .DeleteAsync(
                    feedbackId,
                    userId.Value,
                    role);

            return Ok(new
            {
                message =
                    "Candidate feedback deleted successfully."
            });
        }
        catch (KeyNotFoundException exception)
        {
            return NotFound(new
            {
                message =
                    exception.Message
            });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    private int? GetCurrentUserId()
    {
        string? userIdValue =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier);

        if (int.TryParse(
            userIdValue,
            out int userId))
        {
            return userId;
        }

        return null;
    }
}