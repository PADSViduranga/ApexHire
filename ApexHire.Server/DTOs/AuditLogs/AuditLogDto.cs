using ApexHire.Api.Models.Enums;

namespace ApexHire.Api.DTOs.AuditLogs;

public sealed class AuditLogDto
{
    public long Id { get; init; }

    public string? TraceId { get; init; }

    public string? CorrelationId { get; init; }

    public int? UserId { get; init; }

    public string? UserName { get; init; }

    public string? Email { get; init; }

    public AuditAction Action { get; init; }

    public string Module { get; init; } = string.Empty;

    public string EntityName { get; init; } = string.Empty;

    public string? EntityId { get; init; }

    public string Description { get; init; } = string.Empty;

    public AuditSeverity Severity { get; init; }

    public AuditStatus Status { get; init; }

    public string? OldValues { get; init; }

    public string? NewValues { get; init; }

    public string? IpAddress { get; init; }

    public string? UserAgent { get; init; }

    public string? RequestPath { get; init; }

    public string? HttpMethod { get; init; }

    public int? ResponseStatusCode { get; init; }

    public long? ExecutionTimeMs { get; init; }

    public DateTime CreatedAt { get; init; }
}
