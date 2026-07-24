using ApexHire.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace ApexHire.Server.DTOs;

public class ScheduleInterviewRequest
{
    [Range(1, int.MaxValue)]
    public int JobApplicationId { get; set; }

    [Required]
    public DateTime ScheduledAt { get; set; }

    [Range(15, 480)]
    public int DurationMinutes { get; set; }

    [MaxLength(150)]
    public string? Location { get; set; }

    [Url]
    [MaxLength(500)]
    public string? MeetingUrl { get; set; }

    [MaxLength(2000)]
    public string? Instructions { get; set; }
}

public class UpdateInterviewStatusRequest
{
    [Required]
    [EnumDataType(typeof(InterviewStatus))]
    public InterviewStatus Status { get; set; }
}

public class InterviewResponse
{
    public int Id { get; set; }

    public int JobApplicationId { get; set; }

    public int JobPostId { get; set; }

    public string JobTitle { get; set; } =
        string.Empty;

    public int CandidateUserId { get; set; }

    public string CandidateName { get; set; } =
        string.Empty;

    public DateTime ScheduledAt { get; set; }

    public int DurationMinutes { get; set; }

    public string? Location { get; set; }

    public string? MeetingUrl { get; set; }

    public string? Instructions { get; set; }

    public string Status { get; set; } =
        string.Empty;

    public int ScheduledByUserId { get; set; }

    public string ScheduledByName { get; set; } =
        string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}