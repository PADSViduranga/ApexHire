using ApexHire.Server.DTOs;
using ApexHire.Server.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApexHire.Server.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(
        IAdminService adminService)
    {
        _adminService = adminService;
    }

    /*
     * =====================================================
     * DASHBOARD
     * =====================================================
     */

    [HttpGet("dashboard")]
    public async Task<IActionResult>
        GetDashboard()
    {
        return Ok(
            await _adminService
                .GetDashboardAsync());
    }

    /*
     * =====================================================
     * USERS
     * =====================================================
     */

    [HttpGet("users")]
    public async Task<IActionResult>
        GetUsers(
            [FromQuery]
            AdminUserQueryRequest request)
    {
        return Ok(
            await _adminService
                .GetUsersAsync(request));
    }

    [HttpGet("users/{id:int}")]
    public async Task<IActionResult>
        GetUser(
            int id)
    {
        return Ok(
            await _adminService
                .GetUserByIdAsync(id));
    }

    [HttpPost("users")]
    public async Task<IActionResult>
        CreateUser(
            CreateAdminUserRequest request)
    {
        return Ok(
            await _adminService
                .CreateUserAsync(request));
    }

    [HttpPut("users/{id:int}")]
    public async Task<IActionResult>
        UpdateUser(
            int id,
            UpdateAdminUserRequest request)
    {
        return Ok(
            await _adminService
                .UpdateUserAsync(
                    id,
                    request));
    }


    [HttpPut("users/{id:int}/role")]
    public async Task<IActionResult>
        UpdateUserRole(
            int id,
            UpdateUserRoleRequest request)
    {
        return Ok(
            await _adminService
                .UpdateUserRoleAsync(
                    id,
                    request));
    }

    [HttpPut("users/{id:int}/status")]
    public async Task<IActionResult>
        UpdateUserStatus(
            int id,
            UpdateUserStatusRequest request)
    {
        return Ok(
            await _adminService
                .UpdateUserStatusAsync(
                    id,
                    request));
    }

    [HttpPut("users/{id:int}/reset-password")]
    public async Task<IActionResult>
        ResetPassword(
            int id,
            ResetUserPasswordRequest request)
    {
        return Ok(
            await _adminService
                .ResetUserPasswordAsync(
                    id,
                    request));
    }

    [HttpDelete("users/{id:int}")]
    public async Task<IActionResult>
        DeleteUser(
            int id)
    {
        return Ok(
            await _adminService
                .DeleteUserAsync(id));
    }

    /*
     * =====================================================
     * ORGANIZATIONS
     * =====================================================
     */

    [HttpGet("organizations")]
    public async Task<IActionResult>
        GetOrganizations()
    {
        return Ok(
            await _adminService
                .GetOrganizationsAsync());
    }

    [HttpPost("organizations")]
    public async Task<IActionResult>
        CreateOrganization(
            CreateOrganizationRequest request)
    {
        return Ok(
            await _adminService
                .CreateOrganizationAsync(
                    request));
    }

    [HttpPut("organizations/{id:int}")]
    public async Task<IActionResult>
        UpdateOrganization(
            int id,
            UpdateOrganizationRequest request)
    {
        return Ok(
            await _adminService
                .UpdateOrganizationAsync(
                    id,
                    request));
    }

    [HttpDelete("organizations/{id:int}")]
    public async Task<IActionResult>
        DeleteOrganization(
            int id)
    {
        return Ok(
            await _adminService
                .DeleteOrganizationAsync(
                    id));
    }


    /*
     * =====================================================
     * DEPARTMENTS
     * =====================================================
     */

    [HttpGet("departments")]
    public async Task<IActionResult>
        GetDepartments(
            [FromQuery]
            int? organizationId)
    {
        return Ok(
            await _adminService
                .GetDepartmentsAsync(
                    organizationId));
    }

    [HttpPost("departments")]
    public async Task<IActionResult>
        CreateDepartment(
            CreateDepartmentRequest request)
    {
        return Ok(
            await _adminService
                .CreateDepartmentAsync(
                    request));
    }

    [HttpPut("departments/{id:int}")]
    public async Task<IActionResult>
        UpdateDepartment(
            int id,
            UpdateDepartmentRequest request)
    {
        return Ok(
            await _adminService
                .UpdateDepartmentAsync(
                    id,
                    request));
    }

    [HttpDelete("departments/{id:int}")]
    public async Task<IActionResult>
        DeleteDepartment(
            int id)
    {
        return Ok(
            await _adminService
                .DeleteDepartmentAsync(
                    id));
    }

    /*
     * =====================================================
     * STAFF ASSIGNMENT
     * =====================================================
     */

    [HttpPost("assign-recruiter")]
    public async Task<IActionResult>
        AssignRecruiter(
            AssignStaffRequest request)
    {
        return Ok(
            await _adminService
                .AssignRecruiterAsync(
                    request));
    }

    [HttpPost("assign-hiring-manager")]
    public async Task<IActionResult>
        AssignHiringManager(
            AssignStaffRequest request)
    {
        return Ok(
            await _adminService
                .AssignHiringManagerAsync(
                    request));
    }


    /*
     * =====================================================
     * REPORTS
     * =====================================================
     */

    [HttpGet("reports")]
    public async Task<IActionResult>
        GetReports(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
    {
        return Ok(
            await _adminService
                .GetReportsAsync(
                    startDate,
                    endDate));
    }

    /*
     * =====================================================
     * ANALYTICS
     * =====================================================
     */

    [HttpGet("analytics")]
    public async Task<IActionResult>
        GetAnalytics(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
    {
        return Ok(
            await _adminService
                .GetAnalyticsAsync(
                    startDate,
                    endDate));
    }

    /*
     * =====================================================
     * AUDIT LOGS
     * =====================================================
     */

    [HttpGet("audit-logs")]
    public async Task<IActionResult>
        GetAuditLogs(
            [FromQuery]
            AuditLogQueryRequest request)
    {
        return Ok(
            await _adminService
                .GetAuditLogsAsync(
                    request));
    }

    /*
     * =====================================================
     * SETTINGS
     * =====================================================
     */

    [HttpGet("settings")]
    public async Task<IActionResult>
        GetSettings()
    {
        return Ok(
            await _adminService
                .GetSettingsAsync());
    }

    [HttpPut("settings")]
    public async Task<IActionResult>
        UpdateSettings(
            UpdateAdminSettingsRequest request)
    {
        return Ok(
            await _adminService
                .UpdateSettingsAsync(
                    request));
    }

}
