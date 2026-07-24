using ApexHire.Server.DTOs;
using ApexHire.Server.Enums;
using ApexHire.Server.Interfaces;
using ApexHire.Server.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;

namespace ApexHire.Server.Services;

public class CandidateProfileService
    : ICandidateProfileService
{
    private readonly ICandidateProfileRepository _profileRepository;
    private readonly IUserRepository _userRepository;
    private readonly IWebHostEnvironment _environment;

    public CandidateProfileService(
        ICandidateProfileRepository profileRepository,
        IUserRepository userRepository,
        IWebHostEnvironment environment)
    {
        _profileRepository = profileRepository;
        _userRepository = userRepository;
        _environment = environment;
    }

    public async Task<ApiResponse<CandidateProfileResponse>>
        GetAsync(int userId)
    {
        User? user =
            await _userRepository.GetByIdAsync(userId);

        if (user is null ||
            user.Role != UserRole.Candidate)
        {
            return ApiResponse<CandidateProfileResponse>.Failed(
                "Candidate account was not found.");
        }

        CandidateProfile? profile =
            await _profileRepository.GetByUserIdAsync(userId);

        CandidateProfileResponse response =
            CreateResponse(user, profile);

        return ApiResponse<CandidateProfileResponse>.Succeeded(
            response,
            "Candidate profile retrieved successfully.");
    }

    public async Task<ApiResponse<CandidateProfileResponse>>
        UpdateAsync(
            int userId,
            UpdateCandidateProfileRequest request)
    {
        User? user =
            await _userRepository.GetByIdAsync(userId);

        if (user is null ||
            user.Role != UserRole.Candidate)
        {
            return ApiResponse<CandidateProfileResponse>.Failed(
                "Candidate account was not found.");
        }

        CandidateProfile? profile =
            await _profileRepository.GetByUserIdAsync(userId);

        user.FullName = request.FullName.Trim();
        user.UpdatedAt = DateTime.UtcNow;

        if (profile is null)
        {
            profile = new CandidateProfile
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _profileRepository.AddAsync(profile);
        }

        profile.Headline =
            request.Headline?.Trim();

        profile.PhoneNumber =
            request.PhoneNumber?.Trim();

        profile.Location =
            request.Location?.Trim();

        profile.ProfessionalSummary =
            request.ProfessionalSummary?.Trim();

        profile.Skills =
            request.Skills?.Trim() ?? string.Empty;

        profile.YearsOfExperience =
            request.YearsOfExperience;

        profile.LinkedInUrl =
            request.LinkedInUrl?.Trim();

        profile.GitHubUrl =
            request.GitHubUrl?.Trim();

        profile.PortfolioUrl =
            request.PortfolioUrl?.Trim();

        profile.UpdatedAt =
            DateTime.UtcNow;

        await _profileRepository.SaveChangesAsync();

        return ApiResponse<CandidateProfileResponse>.Succeeded(
            CreateResponse(user, profile),
            "Candidate profile updated successfully.");
    }

    public async Task<ApiResponse<string>>
        UploadProfilePhotoAsync(
            int userId,
            IFormFile photo)
    {
        User? user =
            await _userRepository.GetByIdAsync(userId);

        if (user is null ||
            user.Role != UserRole.Candidate)
        {
            return ApiResponse<string>.Failed(
                "Candidate account was not found.");
        }

        CandidateProfile profile =
            await GetOrCreateProfileAsync(userId);

        string[] allowedExtensions =
        {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        };

        string extension =
            Path.GetExtension(photo.FileName)
                .ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
        {
            return ApiResponse<string>.Failed(
                "Only JPG, JPEG, PNG and WEBP images are allowed.");
        }

        if (photo.Length > 5 * 1024 * 1024)
        {
            return ApiResponse<string>.Failed(
                "Maximum profile photo size is 5 MB.");
        }
        string webRootPath =
    GetWebRootPath();

        string folder =
            Path.Combine(
                webRootPath,
                "uploads",
                "profile-images");

        Directory.CreateDirectory(folder);

        DeleteExistingFile(
            webRootPath,
            profile.ProfileImageUrl);

        string fileName =
            $"{Guid.NewGuid():N}{extension}";

        string savePath =
            Path.Combine(folder, fileName);

        await using (FileStream stream =
            new(
                savePath,
                FileMode.Create,
                FileAccess.Write,
                FileShare.None))
        {
            await photo.CopyToAsync(stream);
        }

        profile.ProfileImageUrl =
            $"/uploads/profile-images/{fileName}";

        profile.UpdatedAt =
            DateTime.UtcNow;

        await _profileRepository.SaveChangesAsync();

        return ApiResponse<string>.Succeeded(
            profile.ProfileImageUrl,
            "Profile photo uploaded successfully.");
    }

    public async Task<ApiResponse<string>>
        UploadCoverPhotoAsync(
            int userId,
            IFormFile photo)
    {
        User? user =
            await _userRepository.GetByIdAsync(userId);

        if (user is null ||
            user.Role != UserRole.Candidate)
        {
            return ApiResponse<string>.Failed(
                "Candidate account was not found.");
        }

        CandidateProfile profile =
            await GetOrCreateProfileAsync(userId);

        string[] allowedExtensions =
        {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        };

        string extension =
            Path.GetExtension(photo.FileName)
                .ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
        {
            return ApiResponse<string>.Failed(
                "Only JPG, JPEG, PNG and WEBP images are allowed.");
        }

        if (photo.Length > 8 * 1024 * 1024)
        {
            return ApiResponse<string>.Failed(
                "Maximum cover photo size is 8 MB.");
        }

        string webRootPath =
            GetWebRootPath();

        string folder =
            Path.Combine(
                webRootPath,
                "uploads",
                "cover-images");

        Directory.CreateDirectory(folder);

        DeleteExistingFile(
            webRootPath,
            profile.CoverImageUrl);

        string fileName =
            $"{Guid.NewGuid():N}{extension}";

        string savePath =
            Path.Combine(folder, fileName);

        await using (FileStream stream =
            new(
                savePath,
                FileMode.Create,
                FileAccess.Write,
                FileShare.None))
        {
            await photo.CopyToAsync(stream);
        }

        profile.CoverImageUrl =
            $"/uploads/cover-images/{fileName}";

        profile.UpdatedAt =
            DateTime.UtcNow;

        await _profileRepository.SaveChangesAsync();

        return ApiResponse<string>.Succeeded(
            profile.CoverImageUrl,
            "Cover photo uploaded successfully.");
    }
    public async Task<ApiResponse<string>>
    UploadResumeAsync(
        int userId,
        IFormFile resume)
    {
        User? user =
            await _userRepository.GetByIdAsync(userId);

        if (user is null ||
            user.Role != UserRole.Candidate)
        {
            return ApiResponse<string>.Failed(
                "Candidate account was not found.");
        }

        CandidateProfile profile =
            await GetOrCreateProfileAsync(userId);

        string[] allowedExtensions =
        {
            ".pdf",
            ".doc",
            ".docx"
        };

        string extension =
            Path.GetExtension(resume.FileName)
                .ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
        {
            return ApiResponse<string>.Failed(
                "Only PDF, DOC and DOCX files are allowed.");
        }

        if (resume.Length > 10 * 1024 * 1024)
        {
            return ApiResponse<string>.Failed(
                "Maximum resume size is 10 MB.");
        }

        string webRootPath =
            GetWebRootPath();

        string folder =
            Path.Combine(
                webRootPath,
                "uploads",
                "resumes");

        Directory.CreateDirectory(folder);

        DeleteExistingFile(
            webRootPath,
            profile.ResumeUrl);

        string fileName =
            $"{Guid.NewGuid():N}{extension}";

        string savePath =
            Path.Combine(folder, fileName);

        await using (FileStream stream =
            new(
                savePath,
                FileMode.Create,
                FileAccess.Write,
                FileShare.None))
        {
            await resume.CopyToAsync(stream);
        }

        profile.ResumeUrl =
            $"/uploads/resumes/{fileName}";

        profile.ResumeFileName =
            Path.GetFileName(resume.FileName);

        profile.ResumeUploadedAt =
            DateTime.UtcNow;

        profile.UpdatedAt =
            DateTime.UtcNow;

        await _profileRepository.SaveChangesAsync();

        return ApiResponse<string>.Succeeded(
            profile.ResumeUrl,
            "Resume uploaded successfully.");
    }

    public async Task<(
        byte[] FileBytes,
        string ContentType,
        string FileName)?>
        DownloadResumeAsync(int userId)
    {
        CandidateProfile? profile =
            await _profileRepository.GetByUserIdAsync(userId);

        if (profile is null ||
            string.IsNullOrWhiteSpace(profile.ResumeUrl))
        {
            return null;
        }

        string webRootPath =
            GetWebRootPath();

        string relativePath =
            profile.ResumeUrl
                .TrimStart('/')
                .Replace(
                    '/',
                    Path.DirectorySeparatorChar);

        string filePath =
            Path.Combine(
                webRootPath,
                relativePath);

        if (!File.Exists(filePath))
        {
            return null;
        }

        byte[] fileBytes =
            await File.ReadAllBytesAsync(filePath);

        FileExtensionContentTypeProvider provider =
            new();

        if (!provider.TryGetContentType(
            filePath,
            out string? contentType))
        {
            contentType =
                "application/octet-stream";
        }

        string downloadFileName =
            profile.ResumeFileName
            ?? Path.GetFileName(filePath);

        return (
            fileBytes,
            contentType,
            downloadFileName);
    }
    private async Task<CandidateProfile>
    GetOrCreateProfileAsync(int userId)
    {
        CandidateProfile? profile =
            await _profileRepository.GetByUserIdAsync(userId);

        if (profile is not null)
        {
            return profile;
        }

        profile = new CandidateProfile
        {
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _profileRepository.AddAsync(profile);
        await _profileRepository.SaveChangesAsync();

        return profile;
    }

    private string GetWebRootPath()
    {
        string webRootPath =
            _environment.WebRootPath
            ?? Path.Combine(
                _environment.ContentRootPath,
                "wwwroot");

        Directory.CreateDirectory(webRootPath);

        return webRootPath;
    }

    private static void DeleteExistingFile(
        string webRootPath,
        string? fileUrl)
    {
        if (string.IsNullOrWhiteSpace(fileUrl))
        {
            return;
        }

        string relativePath =
            fileUrl
                .TrimStart('/')
                .Replace(
                    '/',
                    Path.DirectorySeparatorChar);

        string existingFilePath =
            Path.Combine(
                webRootPath,
                relativePath);

        if (File.Exists(existingFilePath))
        {
            File.Delete(existingFilePath);
        }
    }

    private static CandidateProfileResponse CreateResponse(
        User user,
        CandidateProfile? profile)
    {
        return new CandidateProfileResponse
        {
            Id = profile?.Id ?? 0,

            UserId = user.Id,

            FullName =
                user.FullName,

            Email =
                user.Email,

            Headline =
                profile?.Headline,

            PhoneNumber =
                profile?.PhoneNumber,

            Location =
                profile?.Location,

            ProfessionalSummary =
                profile?.ProfessionalSummary,

            Skills =
                profile?.Skills ?? string.Empty,

            YearsOfExperience =
                profile?.YearsOfExperience ?? 0,

            ProfileImageUrl =
                profile?.ProfileImageUrl,

            CoverImageUrl =
                profile?.CoverImageUrl,

            ResumeUrl =
                profile?.ResumeUrl,

            ResumeFileName =
                profile?.ResumeFileName,

            ResumeUploadedAt =
                profile?.ResumeUploadedAt,

            LinkedInUrl =
                profile?.LinkedInUrl,

            GitHubUrl =
                profile?.GitHubUrl,

            PortfolioUrl =
                profile?.PortfolioUrl,

            Educations =
                profile?.Educations?.ToList()
                ?? new List<CandidateEducation>(),

            Experiences =
                profile?.Experiences?.ToList()
                ?? new List<CandidateExperience>()
        };
    }
}