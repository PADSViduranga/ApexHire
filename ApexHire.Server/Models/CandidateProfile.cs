using System.ComponentModel.DataAnnotations;

namespace ApexHire.Server.Models;

public class CandidateProfile
{
    public int Id { get; set; }

    public int UserId { get; set; }

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

    // Uploads

    [MaxLength(500)]
    public string? ProfileImageUrl { get; set; }

    [MaxLength(500)]
    public string? CoverImageUrl { get; set; }

    [MaxLength(500)]
    public string? ResumeUrl { get; set; }

    [MaxLength(255)]
    public string? ResumeFileName { get; set; }

    public DateTime? ResumeUploadedAt { get; set; }

    // Links

    [MaxLength(500)]
    public string? LinkedInUrl { get; set; }

    [MaxLength(500)]
    public string? GitHubUrl { get; set; }

    [MaxLength(500)]
    public string? PortfolioUrl { get; set; }

    // Dates

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Navigation

    public User User { get; set; } = null!;

    public ICollection<CandidateEducation> Educations { get; set; }
        = new List<CandidateEducation>();

    public ICollection<CandidateExperience> Experiences { get; set; }
        = new List<CandidateExperience>();
}