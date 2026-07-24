using System.ComponentModel.DataAnnotations;

namespace ApexHire.Server.Models;

public class HiringManagerProfile
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int OrganizationId { get; set; }

    public int DepartmentId { get; set; }

    [MaxLength(100)]
    public string? JobTitle { get; set; }

    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    public DateTime CreatedAt { get; set; } =
        DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public User User { get; set; } = null!;

    public Organization Organization { get; set; } = null!;

    public Department Department { get; set; } = null!;
}