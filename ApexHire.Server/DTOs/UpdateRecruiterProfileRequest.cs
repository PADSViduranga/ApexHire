using System.ComponentModel.DataAnnotations;

namespace ApexHire.Server.DTOs;

public class UpdateRecruiterProfileRequest
{
    [Required(
        ErrorMessage =
            "Organization is required.")]
    [Range(
        1,
        int.MaxValue,
        ErrorMessage =
            "A valid organization must be selected.")]
    public int OrganizationId { get; set; }

    [Required(
        ErrorMessage =
            "Department is required.")]
    [Range(
        1,
        int.MaxValue,
        ErrorMessage =
            "A valid department must be selected.")]
    public int DepartmentId { get; set; }

    [MaxLength(
        150,
        ErrorMessage =
            "Job title cannot exceed 150 characters.")]
    public string? JobTitle { get; set; }

    [MaxLength(
        30,
        ErrorMessage =
            "Phone number cannot exceed 30 characters.")]
    public string? PhoneNumber { get; set; }
}