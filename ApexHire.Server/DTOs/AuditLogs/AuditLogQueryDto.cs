using System.ComponentModel.DataAnnotations;
using ApexHire.Api.Models.Enums;

namespace ApexHire.Api.DTOs.AuditLogs;

public sealed class AuditLogQueryDto
{
    [Range(1, int.MaxValue)]
    public int PageNumber { get; init; } = 1;

    [Range(1, 100)]
    public int PageSize { get; init; } = 20;

    [MaxLength(200)]
    public string? Search { get; init; }

    public int? UserId { get; init; }

    public AuditAction? Action { get; init; }

    [MaxLength(100)]
    public string? Module { get; init; }

    [MaxLength(150)]
    public string? EntityName { get; init; }

    [MaxLength(100)]
    public string? EntityId { get; init; }

    public AuditSeverity? Severity { get; init; }

    public AuditStatus? Status { get; init; }

    public DateTime? FromDate { get; init; }

    public DateTime? ToDate { get; init; }

    [RegularExpression(
        "^(createdAt|action|module|entityName|severity|status|userName)$",
        ErrorMessage = "Invalid sort field."
    )]
    public string SortBy { get; init; } = "createdAt";

    [RegularExpression(
        "^(asc|desc)$",
        ErrorMessage = "Sort direction must be asc or desc."
    )]
    public string SortDirection { get; init; } = "desc";
}
