using ApexHire.Api.DTOs.AuditLogs;
using ApexHire.Api.Models.Enums;

namespace ApexHire.Api.Services.Interfaces;

public interface IAuditLogService
{
    Task<PagedResultDto<AuditLogDto>> GetAsync(
        AuditLogQueryDto query,
        CancellationToken cancellationToken = default);

    Task<AuditLogDto?> GetByIdAsync(
        long id,
        CancellationToken cancellationToken = default);

    Task LogAsync(
        AuditAction action,
        string module,
        string entityName,
        string? entityId,
        string description,
        AuditSeverity severity = AuditSeverity.Information,
        AuditStatus status = AuditStatus.Success,
        int? userId = null,
        string? userName = null,
        string? email = null,
        string? oldValues = null,
        string? newValues = null,
        string? ipAddress = null,
        string? userAgent = null,
        string? requestPath = null,
        string? httpMethod = null,
        int? responseStatusCode = null,
        long? executionTimeMs = null,
        string? traceId = null,
        string? correlationId = null,
        CancellationToken cancellationToken = default);

    Task DeleteOlderThanAsync(
        DateTime cutoffDate,
        CancellationToken cancellationToken = default);
}
