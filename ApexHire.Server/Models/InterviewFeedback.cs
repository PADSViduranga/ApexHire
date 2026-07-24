using System.ComponentModel.DataAnnotations;

namespace ApexHire.Server.Models;

public class InterviewFeedback
{
    public int Id { get; set; }

    public int InterviewId { get; set; }

    public int SubmittedByUserId { get; set; }

    [Required]
    [MaxLength(3000)]
    public string Comments { get; set; } = string.Empty;

    [Range(1, 5)]
    public int TechnicalRating { get; set; }

    [Range(1, 5)]
    public int CommunicationRating { get; set; }

    [Range(1, 5)]
    public int OverallRating { get; set; }

    public bool RecommendedForHire { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public Interview Interview { get; set; } = null!;

    public User SubmittedByUser { get; set; } = null!;
}