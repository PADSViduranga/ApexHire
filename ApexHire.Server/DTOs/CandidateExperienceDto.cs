using System.ComponentModel.DataAnnotations;

namespace ApexHire.Server.DTOs;

public class CandidateExperienceResponse
{
    public int Id { get; set; }

    public string Company { get; set; } = string.Empty;

    public string Position { get; set; } = string.Empty;

    public string? EmploymentType { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool CurrentJob { get; set; }

    public string? Description { get; set; }
}

public class CandidateExperienceRequest
{
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
}