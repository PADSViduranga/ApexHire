using ApexHire.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace ApexHire.Server.DTOs;

public class UpdateJobRequest
{
    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(5000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string Location { get; set; } = string.Empty;

    [Required]
    public EmploymentType EmploymentType { get; set; }

    [MaxLength(1500)]
    public string RequiredSkills { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal SalaryMin { get; set; }

    [Range(0, double.MaxValue)]
    public decimal SalaryMax { get; set; }

    public DateTime? ApplicationDeadline { get; set; }

    public int? DepartmentId { get; set; }
}