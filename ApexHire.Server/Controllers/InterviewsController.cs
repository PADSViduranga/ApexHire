using ApexHire.Server.DTOs;
using ApexHire.Server.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ApexHire.Server.Controllers;

[ApiController]
[Route("api/interviews")]
[Authorize]
public class InterviewsController : ControllerBase
{
    private readonly IInterviewService
        _interviewService;

    public InterviewsController(
        IInterviewService interviewService)
    {
        _interviewService = interviewService;
    }

    [Authorize(Roles = "HiringManager")]
    [HttpPost]
    public async Task<IActionResult> Schedule(
        [FromBody] ScheduleInterviewRequest request)
    {
        int? currentUserId = GetCurrentUserId();

        if (currentUserId is null)
        {
            return InvalidTokenResponse();
        }

        ApiResponse<InterviewResponse> result =
            await _interviewService.ScheduleAsync(
                currentUserId.Value,
                request);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [Authorize(Roles = "Candidate")]
    [HttpGet("mine")]
    public async Task<IActionResult>
        GetMyInterviews()
    {
        int? currentUserId = GetCurrentUserId();

        if (currentUserId is null)
        {
            return InvalidTokenResponse();
        }

        ApiResponse<List<InterviewResponse>> result =
            await _interviewService
                .GetCandidateInterviewsAsync(
                    currentUserId.Value);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [Authorize(Roles = "HiringManager")]
    [HttpGet("department")]
    public async Task<IActionResult>
        GetDepartmentInterviews()
    {
        int? currentUserId = GetCurrentUserId();

        if (currentUserId is null)
        {
            return InvalidTokenResponse();
        }

        ApiResponse<List<InterviewResponse>> result =
            await _interviewService
                .GetDepartmentInterviewsAsync(
                    currentUserId.Value);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [Authorize(Roles = "HiringManager")]
    [HttpPut("{interviewId:int}/status")]
    public async Task<IActionResult> UpdateStatus(
        int interviewId,
        [FromBody]
        UpdateInterviewStatusRequest request)
    {
        int? currentUserId = GetCurrentUserId();

        if (currentUserId is null)
        {
            return InvalidTokenResponse();
        }

        ApiResponse<InterviewResponse> result =
            await _interviewService
                .UpdateStatusAsync(
                    currentUserId.Value,
                    interviewId,
                    request);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [Authorize(Roles = "HiringManager")]
    [HttpPut("{interviewId:int}/reschedule")]
    public async Task<IActionResult> Reschedule(
        int interviewId,
        [FromBody]
        RescheduleInterviewRequest request)
    {
        int? currentUserId = GetCurrentUserId();

        if (currentUserId is null)
        {
            return InvalidTokenResponse();
        }

        ApiResponse<InterviewResponse> result =
            await _interviewService
                .RescheduleAsync(
                    currentUserId.Value,
                    interviewId,
                    request);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    private int? GetCurrentUserId()
    {
        string? userIdValue = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (int.TryParse(
                userIdValue,
                out int userId))
        {
            return userId;
        }

        return null;
    }

    private IActionResult InvalidTokenResponse()
    {
        return Unauthorized(
            ApiResponse<string>.Failed(
                "Invalid authentication token."));
    }
}