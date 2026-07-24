using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ApexHire.Api.Models.Enums;

namespace ApexHire.Api.Models;

public sealed class AuditLog
{
    public long Id { get; set; }

    [MaxLength(100)]
    public string? TraceId { get; set; }

    [MaxLength(100)]
    public string? CorrelationId { get; set; }

    public int? UserId { get; set; }

    [MaxLength(256)]
    public string? UserName { get; set; }

    [MaxLength(320)]
    public string? Email { get; set; }

    public AuditAction Action { get; set; }

    [Required]
    [MaxLength(100)]
    public string Module { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string EntityName { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? EntityId { get; set; }

    [Required]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    public AuditSeverity Severity { get; set; } =
        AuditSeverity.Information;

    public AuditStatus Status { get; set; } =
        AuditStatus.Success;

    [Column(TypeName = "nvarchar(max)")]
    public string? OldValues { get; set; }

    [Column(TypeName = "nvarchar(max)")]
    public string? NewValues { get; set; }

    [MaxLength(64)]
    public string? IpAddress { get; set; }

    [MaxLength(1000)]
    public string? UserAgent { get; set; }

    [MaxLength(500)]
    public string? RequestPath { get; set; }

    [MaxLength(10)]
    public string? HttpMethod { get; set; }

    public int? ResponseStatusCode { get; set; }

    public long? ExecutionTimeMs { get; set; }

    public DateTime CreatedAt { get; set; } =
        DateTime.UtcNow;
}
