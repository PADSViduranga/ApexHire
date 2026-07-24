using System.ComponentModel.DataAnnotations;

namespace ApexHire.Server.Models.Requests;

public class CreateInterviewFeedbackRequest
{
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
}