using ApexHire.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace ApexHire.Server.DTOs;

public class CandidateProfileResponse
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    // Header
    public string? Headline { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Location { get; set; }

    // About
    public string? ProfessionalSummary { get; set; }

    // Skills
    public string Skills { get; set; } = string.Empty;

    public int YearsOfExperience { get; set; }

    // Uploads
    public string? ProfileImageUrl { get; set; }

    public string? CoverImageUrl { get; set; }

    public string? ResumeUrl { get; set; }

    public string? ResumeFileName { get; set; }

    public DateTime? ResumeUploadedAt { get; set; }

    // Links
    public string? LinkedInUrl { get; set; }

    public string? GitHubUrl { get; set; }

    public string? PortfolioUrl { get; set; }

    // Navigation
    public List<CandidateEducation> Educations { get; set; }
        = new();

    public List<CandidateExperience> Experiences { get; set; }
        = new();
}

public class UpdateCandidateProfileRequest
{
    [Required]
    [MinLength(3)]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    // Header

    [MaxLength(120)]
    public string? Headline { get; set; }

    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    [MaxLength(150)]
    public string? Location { get; set; }

    // About

    [MaxLength(3000)]
    public string? ProfessionalSummary { get; set; }

    // Skills

    [MaxLength(2000)]
    public string Skills { get; set; } = string.Empty;

    [Range(0, 60)]
    public int YearsOfExperience { get; set; }

    // Links

    [Url]
    [MaxLength(500)]
    public string? LinkedInUrl { get; set; }

    [Url]
    [MaxLength(500)]
    public string? GitHubUrl { get; set; }

    [Url]
    [MaxLength(500)]
    public string? PortfolioUrl { get; set; }
}