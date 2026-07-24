using ApexHire.Server.DTOs;
using ApexHire.Server.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ApexHire.Server.Controllers;

[ApiController]
[Route("api/jobs")]
public class JobsController : ControllerBase
{
    private readonly IJobService _jobService;

    public JobsController(IJobService jobService)
    {
        _jobService = jobService;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> Search(
        [FromQuery] JobSearchRequest request)
    {
        ApiResponse<PagedResponse<JobResponse>> result =
            await _jobService.SearchAsync(request);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [Authorize(Roles = "Recruiter")]
    [HttpGet("mine")]
    public async Task<IActionResult> GetMyJobs()
    {
        int? currentUserId = GetCurrentUserId();

        if (currentUserId is null)
        {
            return InvalidTokenResponse();
        }

        ApiResponse<List<JobResponse>> result =
            await _jobService.GetRecruiterJobsAsync(
                currentUserId.Value);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [AllowAnonymous]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(
        int id)
    {
        ApiResponse<JobResponse> result =
            await _jobService.GetByIdAsync(id);

        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [Authorize(Roles = "Recruiter")]
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateJobRequest request)
    {
        int? currentUserId = GetCurrentUserId();

        if (currentUserId is null)
        {
            return InvalidTokenResponse();
        }

        ApiResponse<JobResponse> result =
            await _jobService.CreateAsync(
                currentUserId.Value,
                request);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return CreatedAtAction(
            nameof(GetById),
            new
            {
                id = result.Data!.Id
            },
            result);
    }

    [Authorize(Roles = "Recruiter")]
    [HttpPut("{jobId:int}")]
    public async Task<IActionResult> Update(
        int jobId,
        [FromBody] UpdateJobRequest request)
    {
        int? currentUserId = GetCurrentUserId();

        if (currentUserId is null)
        {
            return InvalidTokenResponse();
        }

        ApiResponse<JobResponse> result =
            await _jobService.UpdateAsync(
                currentUserId.Value,
                jobId,
                request);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [Authorize(Roles = "Recruiter")]
    [HttpPut("{jobId:int}/status")]
    public async Task<IActionResult> UpdateStatus(
        int jobId,
        [FromBody] UpdateJobStatusRequest request)
    {
        int? currentUserId = GetCurrentUserId();

        if (currentUserId is null)
        {
            return InvalidTokenResponse();
        }

        ApiResponse<JobResponse> result =
            await _jobService.UpdateStatusAsync(
                currentUserId.Value,
                jobId,
                request);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [Authorize(Roles = "Recruiter")]
    [HttpDelete("{jobId:int}")]
    public async Task<IActionResult> Delete(
        int jobId)
    {
        int? currentUserId = GetCurrentUserId();

        if (currentUserId is null)
        {
            return InvalidTokenResponse();
        }

        ApiResponse<string> result =
            await _jobService.DeleteAsync(
                currentUserId.Value,
                jobId);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
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

    private IActionResult InvalidTokenResponse()
    {
        return Unauthorized(
            ApiResponse<string>.Failed(
                "Invalid authentication token."));
    }
}