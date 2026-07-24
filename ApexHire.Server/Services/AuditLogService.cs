using ApexHire.Server.Data;
using ApexHire.Api.DTOs.AuditLogs;
using ApexHire.Api.Models;
using ApexHire.Api.Models.Enums;
using ApexHire.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApexHire.Api.Services;

public sealed class AuditLogService : IAuditLogService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<AuditLogService> _logger;

    public AuditLogService(
        ApplicationDbContext dbContext,
        ILogger<AuditLogService> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task<PagedResultDto<AuditLogDto>> GetAsync(
        AuditLogQueryDto query,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(query);

        var pageNumber = Math.Max(query.PageNumber, 1);
        var pageSize = Math.Clamp(query.PageSize, 1, 100);

        IQueryable<AuditLog> auditLogs =
            _dbContext.AuditLogs.AsNoTracking();

        auditLogs = ApplyFilters(
            auditLogs,
            query);

        var totalCount = await auditLogs.CountAsync(
            cancellationToken);

        auditLogs = ApplySorting(
            auditLogs,
            query.SortBy,
            query.SortDirection);

        var items = await auditLogs
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(log => new AuditLogDto
            {
                Id = log.Id,
                TraceId = log.TraceId,
                CorrelationId = log.CorrelationId,
                UserId = log.UserId,
                UserName = log.UserName,
                Email = log.Email,
                Action = log.Action,
                Module = log.Module,
                EntityName = log.EntityName,
                EntityId = log.EntityId,
                Description = log.Description,
                Severity = log.Severity,
                Status = log.Status,
                OldValues = log.OldValues,
                NewValues = log.NewValues,
                IpAddress = log.IpAddress,
                UserAgent = log.UserAgent,
                RequestPath = log.RequestPath,
                HttpMethod = log.HttpMethod,
                ResponseStatusCode =
                    log.ResponseStatusCode,
                ExecutionTimeMs =
                    log.ExecutionTimeMs,
                CreatedAt = log.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return new PagedResultDto<AuditLogDto>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<AuditLogDto?> GetByIdAsync(
        long id,
        CancellationToken cancellationToken = default)
    {
        if (id <= 0)
        {
            return null;
        }

        return await _dbContext.AuditLogs
            .AsNoTracking()
            .Where(log => log.Id == id)
            .Select(log => new AuditLogDto
            {
                Id = log.Id,
                TraceId = log.TraceId,
                CorrelationId = log.CorrelationId,
                UserId = log.UserId,
                UserName = log.UserName,
                Email = log.Email,
                Action = log.Action,
                Module = log.Module,
                EntityName = log.EntityName,
                EntityId = log.EntityId,
                Description = log.Description,
                Severity = log.Severity,
                Status = log.Status,
                OldValues = log.OldValues,
                NewValues = log.NewValues,
                IpAddress = log.IpAddress,
                UserAgent = log.UserAgent,
                RequestPath = log.RequestPath,
                HttpMethod = log.HttpMethod,
                ResponseStatusCode =
                    log.ResponseStatusCode,
                ExecutionTimeMs =
                    log.ExecutionTimeMs,
                CreatedAt = log.CreatedAt
            })
            .SingleOrDefaultAsync(cancellationToken);
    }

    public async Task LogAsync(
        AuditAction action,
        string module,
        string entityName,
        string? entityId,
        string description,
        AuditSeverity severity =
            AuditSeverity.Information,
        AuditStatus status =
            AuditStatus.Success,
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
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(module))
        {
            throw new ArgumentException(
                "Audit module is required.",
                nameof(module));
        }

        if (string.IsNullOrWhiteSpace(entityName))
        {
            throw new ArgumentException(
                "Audit entity name is required.",
                nameof(entityName));
        }

        if (string.IsNullOrWhiteSpace(description))
        {
            throw new ArgumentException(
                "Audit description is required.",
                nameof(description));
        }

        var auditLog = new AuditLog
        {
            TraceId = TrimOrNull(
                traceId,
                100),

            CorrelationId = TrimOrNull(
                correlationId,
                100),

            UserId = userId,

            UserName = TrimOrNull(
                userName,
                256),

            Email = TrimOrNull(
                email,
                320),

            Action = action,

            Module = TrimRequired(
                module,
                100),

            EntityName = TrimRequired(
                entityName,
                150),

            EntityId = TrimOrNull(
                entityId,
                100),

            Description = TrimRequired(
                description,
                2000),

            Severity = severity,

            Status = status,

            OldValues = EmptyToNull(
                oldValues),

            NewValues = EmptyToNull(
                newValues),

            IpAddress = TrimOrNull(
                ipAddress,
                64),

            UserAgent = TrimOrNull(
                userAgent,
                1000),

            RequestPath = TrimOrNull(
                requestPath,
                500),

            HttpMethod = TrimOrNull(
                httpMethod?.ToUpperInvariant(),
                10),

            ResponseStatusCode =
                responseStatusCode,

            ExecutionTimeMs =
                executionTimeMs is < 0
                    ? null
                    : executionTimeMs,

            CreatedAt = DateTime.UtcNow
        };

        try
        {
            await _dbContext.AuditLogs.AddAsync(
                auditLog,
                cancellationToken);

            await _dbContext.SaveChangesAsync(
                cancellationToken);
        }
        catch (OperationCanceledException)
        {
            throw;
        }
        catch (Exception exception)
        {
            _logger.LogError(
                exception,
                "Failed to save audit log for {Module} {EntityName} {EntityId}.",
                auditLog.Module,
                auditLog.EntityName,
                auditLog.EntityId);

            throw;
        }
    }

    public async Task DeleteOlderThanAsync(
        DateTime cutoffDate,
        CancellationToken cancellationToken = default)
    {
        var utcCutoffDate = cutoffDate.Kind switch
        {
            DateTimeKind.Utc => cutoffDate,

            DateTimeKind.Local =>
                cutoffDate.ToUniversalTime(),

            _ => DateTime.SpecifyKind(
                cutoffDate,
                DateTimeKind.Utc)
        };

        try
        {
            var deletedCount =
                await _dbContext.AuditLogs
                    .Where(log =>
                        log.CreatedAt < utcCutoffDate)
                    .ExecuteDeleteAsync(
                        cancellationToken);

            _logger.LogInformation(
                "Deleted {DeletedCount} audit logs older than {CutoffDate}.",
                deletedCount,
                utcCutoffDate);
        }
        catch (OperationCanceledException)
        {
            throw;
        }
        catch (Exception exception)
        {
            _logger.LogError(
                exception,
                "Failed to delete audit logs older than {CutoffDate}.",
                utcCutoffDate);

            throw;
        }
    }

    private static IQueryable<AuditLog> ApplyFilters(
        IQueryable<AuditLog> query,
        AuditLogQueryDto filters)
    {
        if (!string.IsNullOrWhiteSpace(filters.Search))
        {
            var search = filters.Search.Trim();

            query = query.Where(log =>
                log.Description.Contains(search) ||
                log.Module.Contains(search) ||
                log.EntityName.Contains(search) ||
                (log.EntityId != null &&
                 log.EntityId.Contains(search)) ||
                (log.UserName != null &&
                 log.UserName.Contains(search)) ||
                (log.Email != null &&
                 log.Email.Contains(search)) ||
                (log.TraceId != null &&
                 log.TraceId.Contains(search)) ||
                (log.CorrelationId != null &&
                 log.CorrelationId.Contains(search)));
        }

        if (filters.UserId.HasValue)
        {
            query = query.Where(log =>
                log.UserId == filters.UserId.Value);
        }

        if (filters.Action.HasValue)
        {
            query = query.Where(log =>
                log.Action == filters.Action.Value);
        }

        if (!string.IsNullOrWhiteSpace(filters.Module))
        {
            var module = filters.Module.Trim();

            query = query.Where(log =>
                log.Module == module);
        }

        if (!string.IsNullOrWhiteSpace(
                filters.EntityName))
        {
            var entityName =
                filters.EntityName.Trim();

            query = query.Where(log =>
                log.EntityName == entityName);
        }

        if (!string.IsNullOrWhiteSpace(
                filters.EntityId))
        {
            var entityId =
                filters.EntityId.Trim();

            query = query.Where(log =>
                log.EntityId == entityId);
        }

        if (filters.Severity.HasValue)
        {
            query = query.Where(log =>
                log.Severity ==
                filters.Severity.Value);
        }

        if (filters.Status.HasValue)
        {
            query = query.Where(log =>
                log.Status ==
                filters.Status.Value);
        }

        if (filters.FromDate.HasValue)
        {
            var fromDate = ToUtc(
                filters.FromDate.Value);

            query = query.Where(log =>
                log.CreatedAt >= fromDate);
        }

        if (filters.ToDate.HasValue)
        {
            var toDate = ToUtc(
                filters.ToDate.Value);

            query = query.Where(log =>
                log.CreatedAt <= toDate);
        }

        return query;
    }

    private static IQueryable<AuditLog> ApplySorting(
        IQueryable<AuditLog> query,
        string? sortBy,
        string? sortDirection)
    {
        var descending = !string.Equals(
            sortDirection,
            "asc",
            StringComparison.OrdinalIgnoreCase);

        return sortBy?.Trim().ToLowerInvariant() switch
        {
            "action" => descending
                ? query
                    .OrderByDescending(log =>
                        log.Action)
                    .ThenByDescending(log =>
                        log.CreatedAt)
                : query
                    .OrderBy(log =>
                        log.Action)
                    .ThenBy(log =>
                        log.CreatedAt),

            "module" => descending
                ? query
                    .OrderByDescending(log =>
                        log.Module)
                    .ThenByDescending(log =>
                        log.CreatedAt)
                : query
                    .OrderBy(log =>
                        log.Module)
                    .ThenBy(log =>
                        log.CreatedAt),

            "entityname" => descending
                ? query
                    .OrderByDescending(log =>
                        log.EntityName)
                    .ThenByDescending(log =>
                        log.CreatedAt)
                : query
                    .OrderBy(log =>
                        log.EntityName)
                    .ThenBy(log =>
                        log.CreatedAt),

            "severity" => descending
                ? query
                    .OrderByDescending(log =>
                        log.Severity)
                    .ThenByDescending(log =>
                        log.CreatedAt)
                : query
                    .OrderBy(log =>
                        log.Severity)
                    .ThenBy(log =>
                        log.CreatedAt),

            "status" => descending
                ? query
                    .OrderByDescending(log =>
                        log.Status)
                    .ThenByDescending(log =>
                        log.CreatedAt)
                : query
                    .OrderBy(log =>
                        log.Status)
                    .ThenBy(log =>
                        log.CreatedAt),

            "username" => descending
                ? query
                    .OrderByDescending(log =>
                        log.UserName)
                    .ThenByDescending(log =>
                        log.CreatedAt)
                : query
                    .OrderBy(log =>
                        log.UserName)
                    .ThenBy(log =>
                        log.CreatedAt),

            _ => descending
                ? query
                    .OrderByDescending(log =>
                        log.CreatedAt)
                    .ThenByDescending(log =>
                        log.Id)
                : query
                    .OrderBy(log =>
                        log.CreatedAt)
                    .ThenBy(log =>
                        log.Id)
        };
    }

    private static DateTime ToUtc(
        DateTime value)
    {
        return value.Kind switch
        {
            DateTimeKind.Utc => value,

            DateTimeKind.Local =>
                value.ToUniversalTime(),

            _ => DateTime.SpecifyKind(
                value,
                DateTimeKind.Utc)
        };
    }

    private static string TrimRequired(
        string value,
        int maximumLength)
    {
        var trimmed = value.Trim();

        return trimmed.Length <= maximumLength
            ? trimmed
            : trimmed[..maximumLength];
    }

    private static string? TrimOrNull(
        string? value,
        int maximumLength)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        var trimmed = value.Trim();

        return trimmed.Length <= maximumLength
            ? trimmed
            : trimmed[..maximumLength];
    }

    private static string? EmptyToNull(
        string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? null
            : value.Trim();
    }
}
