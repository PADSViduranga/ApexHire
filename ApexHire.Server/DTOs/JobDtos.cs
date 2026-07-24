using ApexHire.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace ApexHire.Server.DTOs;

public class CreateJobRequest
{
    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(5000)]
    public string Description { get; set; } =
        string.Empty;

    [Required]
    [MaxLength(150)]
    public string Location { get; set; } =
        string.Empty;

    [Required]
    [EnumDataType(typeof(EmploymentType))]
    public EmploymentType EmploymentType { get; set; }

    [MaxLength(1500)]
    public string RequiredSkills { get; set; } =
        string.Empty;

    [Range(0, double.MaxValue)]
    public decimal SalaryMin { get; set; }

    [Range(0, double.MaxValue)]
    public decimal SalaryMax { get; set; }

    public DateTime? ApplicationDeadline { get; set; }

    public bool PublishImmediately { get; set; }
}

public class UpdateJobStatusRequest
{
    [Required]
    [EnumDataType(typeof(JobStatus))]
    public JobStatus Status { get; set; }
}

public class JobSearchRequest
{
    [MaxLength(150)]
    public string? Title { get; set; }

    [MaxLength(150)]
    public string? Location { get; set; }

    [EnumDataType(typeof(EmploymentType))]
    public EmploymentType? EmploymentType { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? MinimumSalary { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? MaximumSalary { get; set; }

    [Range(1, int.MaxValue)]
    public int? OrganizationId { get; set; }

    [Range(1, int.MaxValue)]
    public int Page { get; set; } = 1;

    [Range(1, 100)]
    public int PageSize { get; set; } = 10;
}

public class JobResponse
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } =
        string.Empty;

    public string Location { get; set; } =
        string.Empty;

    public string EmploymentType { get; set; } =
        string.Empty;

    public string RequiredSkills { get; set; } =
        string.Empty;

    public decimal SalaryMin { get; set; }

    public decimal SalaryMax { get; set; }

    public string Status { get; set; } =
        string.Empty;

    public DateTime? ApplicationDeadline { get; set; }

    public int OrganizationId { get; set; }

    public string OrganizationName { get; set; } =
        string.Empty;

    public int? DepartmentId { get; set; }

    public string? DepartmentName { get; set; }

    public int CreatedByUserId { get; set; }

    public string CreatedByName { get; set; } =
        string.Empty;

    public DateTime CreatedAt { get; set; }
}