using ApexHire.Server.DTOs;
using Microsoft.AspNetCore.Http;

namespace ApexHire.Server.Interfaces;

public interface ICandidateProfileService
{
    Task<ApiResponse<CandidateProfileResponse>> GetAsync(
        int userId);

    Task<ApiResponse<CandidateProfileResponse>> UpdateAsync(
        int userId,
        UpdateCandidateProfileRequest request);

    Task<ApiResponse<string>> UploadProfilePhotoAsync(
        int userId,
        IFormFile photo);

    Task<ApiResponse<string>> UploadCoverPhotoAsync(
        int userId,
        IFormFile photo);

    Task<ApiResponse<string>> UploadResumeAsync(
        int userId,
        IFormFile resume);

    Task<(byte[] FileBytes, string ContentType, string FileName)?>
        DownloadResumeAsync(int userId);
}