using ApexHire.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace ApexHire.Server.Models;

public class JobPost
{
    public int Id { get; set; }

    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(5000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string Location { get; set; } = string.Empty;

    public EmploymentType EmploymentType { get; set; }

    [MaxLength(1500)]
    public string RequiredSkills { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal SalaryMin { get; set; }

    [Range(0, double.MaxValue)]
    public decimal SalaryMax { get; set; }

    public JobStatus Status { get; set; } = JobStatus.Draft;

    public DateTime? ApplicationDeadline { get; set; }

    public int OrganizationId { get; set; }

    public int? DepartmentId { get; set; }

    public int CreatedByUserId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public Organization Organization { get; set; } = null!;

    public Department? Department { get; set; }

    public User CreatedByUser { get; set; } = null!;

    public ICollection<JobApplication> Applications { get; set; }
    = new List<JobApplication>();
}