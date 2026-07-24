using ApexHire.Server.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace ApexHire.Server.Models;

public class CandidateInterviewFeedback
{
    public int Id { get; set; }

    public int InterviewId { get; set; }

    public int CandidateUserId { get; set; }

    [Range(1, 5)]
    public int OverallExperienceRating { get; set; }

    [Range(1, 5)]
    public int InterviewerProfessionalismRating
    {
        get;
        set;
    }

    [Range(1, 5)]
    public int ProcessClarityRating { get; set; }

    [Required]
    [MaxLength(3000)]
    public string Comments { get; set; } = string.Empty;

    public CandidateFeedbackStatus Status { get; set; }
        = CandidateFeedbackStatus.Submitted;

    public int? ReviewedByUserId { get; set; }

    [MaxLength(2000)]
    public string? InternalNote { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? ReviewedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public Interview Interview { get; set; } = null!;

    public User CandidateUser { get; set; } = null!;

    public User? ReviewedByUser { get; set; }
}