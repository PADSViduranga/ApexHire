using ApexHire.Server.DTOs;
using ApexHire.Server.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ApexHire.Server.Controllers;

[ApiController]
[Route("api/job-applications")]
[Authorize]
public class JobApplicationsController : ControllerBase
{
    private readonly IJobApplicationService
        _applicationService;

    public JobApplicationsController(
        IJobApplicationService applicationService)
    {
        _applicationService = applicationService;
    }

    [Authorize(Roles = "Candidate")]
    [HttpPost]
    public async Task<IActionResult> Apply(
        [FromBody] CreateJobApplicationRequest request)
    {
        int? currentUserId = GetCurrentUserId();

        if (currentUserId is null)
        {
            return InvalidTokenResponse();
        }

        ApiResponse<JobApplicationResponse> result =
            await _applicationService.ApplyAsync(
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
        GetMyApplications()
    {
        int? currentUserId = GetCurrentUserId();

        if (currentUserId is null)
        {
            return InvalidTokenResponse();
        }

        ApiResponse<List<JobApplicationResponse>> result =
            await _applicationService
                .GetCandidateApplicationsAsync(
                    currentUserId.Value);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [Authorize(Roles = "Recruiter,HiringManager")]
    [HttpGet("department")]
    public async Task<IActionResult>
        GetDepartmentApplications()
    {
        int? currentUserId = GetCurrentUserId();

        if (currentUserId is null)
        {
            return InvalidTokenResponse();
        }

        ApiResponse<List<JobApplicationResponse>> result =
            await _applicationService
                .GetStaffApplicationsAsync(
                    currentUserId.Value);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [Authorize(Roles = "Recruiter,HiringManager")]
    [HttpPut("{applicationId:int}/status")]
    public async Task<IActionResult> UpdateStatus(
        int applicationId,
        [FromBody] UpdateApplicationStatusRequest request)
    {
        int? currentUserId = GetCurrentUserId();

        if (currentUserId is null)
        {
            return InvalidTokenResponse();
        }

        ApiResponse<JobApplicationResponse> result =
            await _applicationService.UpdateStatusAsync(
                currentUserId.Value,
                applicationId,
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

        if (int.TryParse(userIdValue, out int userId))
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
    [Authorize(Roles = "Candidate")]
    [HttpPut("{applicationId:int}/withdraw")]
    public async Task<IActionResult> Withdraw(
    int applicationId)
    {
        int? currentUserId = GetCurrentUserId();

        if (currentUserId is null)
        {
            return InvalidTokenResponse();
        }

        ApiResponse<JobApplicationResponse> result =
            await _applicationService.WithdrawAsync(
                currentUserId.Value,
                applicationId);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}