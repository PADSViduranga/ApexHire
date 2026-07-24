using ApexHire.Api.DTOs.AuditLogs;
using ApexHire.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ApexHire.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/auditlogs")]
public sealed class AuditLogsController : ControllerBase
{
    private readonly IAuditLogService _auditLogService;

    public AuditLogsController(
        IAuditLogService auditLogService)
    {
        _auditLogService = auditLogService;
    }

    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] AuditLogQueryDto query,
        CancellationToken cancellationToken)
    {
        var result =
            await _auditLogService.GetAsync(
                query,
                cancellationToken);

        return Ok(result);
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> GetById(
        long id,
        CancellationToken cancellationToken)
    {
        var auditLog =
            await _auditLogService.GetByIdAsync(
                id,
                cancellationToken);

        if (auditLog is null)
        {
            return NotFound();
        }

        return Ok(auditLog);
    }

    [HttpDelete("cleanup")]
    public async Task<IActionResult> Cleanup(
        [FromQuery] DateTime before,
        CancellationToken cancellationToken)
    {
        await _auditLogService.DeleteOlderThanAsync(
            before,
            cancellationToken);

        return NoContent();
    }
}
