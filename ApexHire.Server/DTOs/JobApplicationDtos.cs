using ApexHire.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace ApexHire.Server.DTOs;

public class CreateJobApplicationRequest
{
    [Required]
    public int JobPostId { get; set; }

    [MaxLength(3000)]
    public string? CoverLetter { get; set; }
}

public class UpdateApplicationStatusRequest
{
    [Required]
    public ApplicationStatus Status { get; set; }
}

public class JobApplicationResponse
{
    public int Id { get; set; }

    public int JobPostId { get; set; }

    public string JobTitle { get; set; } = string.Empty;

    public string OrganizationName { get; set; } =
        string.Empty;

    public int CandidateUserId { get; set; }

    public string CandidateName { get; set; } =
        string.Empty;

    public string? CoverLetter { get; set; }

    public string Status { get; set; } = string.Empty;

    public decimal MatchScore { get; set; }

    public DateTime AppliedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}