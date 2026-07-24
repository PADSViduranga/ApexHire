using System.ComponentModel.DataAnnotations;

namespace ApexHire.Server.DTOs;

public class RescheduleInterviewRequest
{
    [Required(
        ErrorMessage =
            "The interview date and time are required.")]
    public DateTime ScheduledAt { get; set; }

    [Range(
        1,
        480,
        ErrorMessage =
            "Duration must be between 1 and 480 minutes.")]
    public int DurationMinutes { get; set; }

    [MaxLength(
        200,
        ErrorMessage =
            "Location cannot exceed 200 characters.")]
    public string? Location { get; set; }

    [MaxLength(
        500,
        ErrorMessage =
            "Meeting URL cannot exceed 500 characters.")]
    public string? MeetingUrl { get; set; }

    [MaxLength(
        2000,
        ErrorMessage =
            "Instructions cannot exceed 2000 characters.")]
    public string? Instructions { get; set; }
}