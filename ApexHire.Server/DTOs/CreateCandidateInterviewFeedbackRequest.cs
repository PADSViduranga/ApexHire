using System.ComponentModel.DataAnnotations;

namespace ApexHire.Server.Models.Requests;

public class CreateCandidateInterviewFeedbackRequest
{
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
}