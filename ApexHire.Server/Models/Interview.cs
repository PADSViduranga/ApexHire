using ApexHire.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace ApexHire.Server.Models;

public class Interview
{
    public int Id { get; set; }

    public int JobApplicationId { get; set; }

    public int ScheduledByUserId { get; set; }

    public DateTime ScheduledAt { get; set; }

    public int DurationMinutes { get; set; }

    [MaxLength(150)]
    public string? Location { get; set; }

    [MaxLength(500)]
    public string? MeetingUrl { get; set; }

    [MaxLength(2000)]
    public string? Instructions { get; set; }

    public InterviewStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public JobApplication JobApplication { get; set; } =
        null!;

    public User ScheduledByUser { get; set; } = null!;
    public InterviewFeedback? Feedback { get; set; }
}