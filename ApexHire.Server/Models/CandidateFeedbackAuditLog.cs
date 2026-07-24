using System.ComponentModel.DataAnnotations;

namespace ApexHire.Server.Models;

public class CandidateFeedbackAuditLog
{
    public int Id { get; set; }

    public int CandidateInterviewFeedbackId { get; set; }

    public int PerformedByUserId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Action { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Details { get; set; }

    public DateTime PerformedAt { get; set; }

    public CandidateInterviewFeedback Feedback
    {
        get;
        set;
    } = null!;

    public User PerformedByUser { get; set; } = null!;
}