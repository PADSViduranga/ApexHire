using System.ComponentModel.DataAnnotations;

namespace ApexHire.Server.Models;

public class Organization
{
    public int Id { get; set; }

    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [MaxLength(150)]
    public string? Website { get; set; }

    [MaxLength(150)]
    public string? Location { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public ICollection<Department> Departments { get; set; }
        = new List<Department>();
}