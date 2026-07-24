using ApexHire.Server.DTOs;
using ApexHire.Server.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ApexHire.Server.Controllers;

[ApiController]
[Route("api/candidate-profile")]
[Authorize(Roles = "Candidate")]
public class CandidateProfileController : ControllerBase
{
    private readonly ICandidateProfileService
        _candidateProfileService;

    public CandidateProfileController(
        ICandidateProfileService candidateProfileService)
    {
        _candidateProfileService =
            candidateProfileService;
    }

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        int? userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized(
                ApiResponse<string>.Failed(
                    "Invalid authentication token."));
        }

        ApiResponse<CandidateProfileResponse> result =
            await _candidateProfileService.GetAsync(
                userId.Value);

        return result.Success
            ? Ok(result)
            : NotFound(result);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile(
        [FromBody]
        UpdateCandidateProfileRequest request)
    {
        int? userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized(
                ApiResponse<string>.Failed(
                    "Invalid authentication token."));
        }

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        ApiResponse<CandidateProfileResponse> result =
            await _candidateProfileService.UpdateAsync(
                userId.Value,
                request);

        return result.Success
            ? Ok(result)
            : BadRequest(result);
    }

    [HttpPost("profile-photo")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<IActionResult> UploadProfilePhoto(
        IFormFile file)
    {
        int? userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized(
                ApiResponse<string>.Failed(
                    "Invalid authentication token."));
        }

        if (file is null ||
            file.Length == 0)
        {
            return BadRequest(
                ApiResponse<string>.Failed(
                    "Please select a profile photo."));
        }

        ApiResponse<string> result =
            await _candidateProfileService
                .UploadProfilePhotoAsync(
                    userId.Value,
                    file);

        return result.Success
            ? Ok(result)
            : BadRequest(result);
    }

    [HttpPost("cover-photo")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(8 * 1024 * 1024)]
    public async Task<IActionResult> UploadCoverPhoto(
        IFormFile file)
    {
        int? userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized(
                ApiResponse<string>.Failed(
                    "Invalid authentication token."));
        }

        if (file is null ||
            file.Length == 0)
        {
            return BadRequest(
                ApiResponse<string>.Failed(
                    "Please select a cover photo."));
        }

        ApiResponse<string> result =
            await _candidateProfileService
                .UploadCoverPhotoAsync(
                    userId.Value,
                    file);

        return result.Success
            ? Ok(result)
            : BadRequest(result);
    }

    [HttpPost("resume")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<IActionResult> UploadResume(
        IFormFile file)
    {
        int? userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized(
                ApiResponse<string>.Failed(
                    "Invalid authentication token."));
        }

        if (file is null ||
            file.Length == 0)
        {
            return BadRequest(
                ApiResponse<string>.Failed(
                    "Please select a resume file."));
        }

        ApiResponse<string> result =
            await _candidateProfileService
                .UploadResumeAsync(
                    userId.Value,
                    file);

        return result.Success
            ? Ok(result)
            : BadRequest(result);
    }

    [HttpGet("resume")]
    public async Task<IActionResult> DownloadResume()
    {
        int? userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized(
                ApiResponse<string>.Failed(
                    "Invalid authentication token."));
        }

        var resume =
            await _candidateProfileService
                .DownloadResumeAsync(
                    userId.Value);

        if (resume is null)
        {
            return NotFound(
                ApiResponse<string>.Failed(
                    "Resume was not found."));
        }

        return File(
            resume.Value.FileBytes,
            resume.Value.ContentType,
            resume.Value.FileName);
    }

    private int? GetCurrentUserId()
    {
        string? userIdValue =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier);

        return int.TryParse(
            userIdValue,
            out int userId)
                ? userId
                : null;
    }
}