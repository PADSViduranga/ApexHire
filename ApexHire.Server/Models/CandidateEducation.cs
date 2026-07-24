using System.ComponentModel.DataAnnotations;

namespace ApexHire.Server.Models;

public class CandidateEducation
{
    public int Id { get; set; }

    public int CandidateProfileId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Institution { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Degree { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? FieldOfStudy { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    [MaxLength(2000)]
    public string? Description { get; set; }

    public CandidateProfile CandidateProfile { get; set; } = null!;
}