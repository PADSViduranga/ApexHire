using System.ComponentModel.DataAnnotations;

namespace ApexHire.Server.Models;

public class CandidateExperience
{
    public int Id { get; set; }

    public int CandidateProfileId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Company { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Position { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? EmploymentType { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool CurrentJob { get; set; }

    [MaxLength(3000)]
    public string? Description { get; set; }

    public CandidateProfile CandidateProfile { get; set; } = null!;
}