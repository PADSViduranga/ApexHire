using System.Security.Claims;
using ApexHire.Server.DTOs.Dashboard;
using ApexHire.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApexHire.Server.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(
        IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    private int GetCurrentUserId()
    {
        string? userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out int id))
        {
            throw new UnauthorizedAccessException(
                "Invalid user.");
        }

        return id;
    }

    [HttpGet("recruiter")]
    [Authorize(Roles = "Recruiter")]
    [ProducesResponseType(
        typeof(DashboardResponse),
        StatusCodes.Status200OK)]
    public async Task<ActionResult<DashboardResponse>>
        GetRecruiterDashboard()
    {
        DashboardResponse dashboard =
            await _dashboardService
                .GetRecruiterDashboardAsync(
                    GetCurrentUserId());

        return Ok(dashboard);
    }

    [HttpGet("hiring-manager")]
    [Authorize(Roles = "HiringManager")]
    [ProducesResponseType(
        typeof(DashboardResponse),
        StatusCodes.Status200OK)]
    public async Task<ActionResult<DashboardResponse>>
        GetHiringManagerDashboard()
    {
        DashboardResponse dashboard =
            await _dashboardService
                .GetHiringManagerDashboardAsync(
                    GetCurrentUserId());

        return Ok(dashboard);
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(
        typeof(DashboardResponse),
        StatusCodes.Status200OK)]
    public async Task<ActionResult<DashboardResponse>>
        GetAdminDashboard()
    {
        DashboardResponse dashboard =
            await _dashboardService
                .GetAdminDashboardAsync();

        return Ok(dashboard);
    }
}