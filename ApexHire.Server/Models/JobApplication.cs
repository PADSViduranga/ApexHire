using ApexHire.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace ApexHire.Server.Models;

public class JobApplication
{
    public int Id { get; set; }

    public int JobPostId { get; set; }

    public int CandidateUserId { get; set; }

    [MaxLength(3000)]
    public string? CoverLetter { get; set; }

    public ApplicationStatus Status { get; set; } =
        ApplicationStatus.Submitted;

    public decimal MatchScore { get; set; }

    public DateTime AppliedAt { get; set; } =
        DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public JobPost JobPost { get; set; } = null!;

    public User CandidateUser { get; set; } = null!;
}