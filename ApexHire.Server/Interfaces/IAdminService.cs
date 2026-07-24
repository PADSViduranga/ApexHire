using ApexHire.Server.DTOs;

namespace ApexHire.Server.Interfaces;

public interface IAdminService
{
    /*
     * =====================================================
     * DASHBOARD
     * =====================================================
     */

    Task<ApiResponse<AdminDashboardResponse>>
        GetDashboardAsync();

    /*
     * =====================================================
     * USERS
     * =====================================================
     */

    Task<ApiResponse<PagedResponse<AdminUserResponse>>>
        GetUsersAsync(AdminUserQueryRequest request);

    Task<ApiResponse<AdminUserResponse>>
        GetUserByIdAsync(int userId);

    Task<ApiResponse<AdminUserResponse>>
        CreateUserAsync(CreateAdminUserRequest request);

    Task<ApiResponse<AdminUserResponse>>
        UpdateUserAsync(
            int userId,
            UpdateAdminUserRequest request);

    Task<ApiResponse<AdminUserResponse>>
        UpdateUserRoleAsync(
            int userId,
            UpdateUserRoleRequest request);

    Task<ApiResponse<AdminUserResponse>>
        UpdateUserStatusAsync(
            int userId,
            UpdateUserStatusRequest request);

    Task<ApiResponse<string>>
        ResetUserPasswordAsync(
            int userId,
            ResetUserPasswordRequest request);

    Task<ApiResponse<string>>
        DeleteUserAsync(int userId);

    /*
     * =====================================================
     * ORGANIZATIONS
     * =====================================================
     */

    Task<ApiResponse<List<OrganizationResponse>>>
        GetOrganizationsAsync();

    Task<ApiResponse<OrganizationResponse>>
        GetOrganizationByIdAsync(int organizationId);

    Task<ApiResponse<OrganizationResponse>>
        CreateOrganizationAsync(
            CreateOrganizationRequest request);

    Task<ApiResponse<OrganizationResponse>>
        UpdateOrganizationAsync(
            int organizationId,
            UpdateOrganizationRequest request);

    Task<ApiResponse<string>>
        DeleteOrganizationAsync(int organizationId);

    /*
     * =====================================================
     * DEPARTMENTS
     * =====================================================
     */

    Task<ApiResponse<List<DepartmentResponse>>>
        GetDepartmentsAsync(int? organizationId);

    Task<ApiResponse<DepartmentResponse>>
        GetDepartmentByIdAsync(int departmentId);

    Task<ApiResponse<DepartmentResponse>>
        CreateDepartmentAsync(
            CreateDepartmentRequest request);

    Task<ApiResponse<DepartmentResponse>>
        UpdateDepartmentAsync(
            int departmentId,
            UpdateDepartmentRequest request);

    Task<ApiResponse<string>>
        DeleteDepartmentAsync(int departmentId);

    /*
     * =====================================================
     * STAFF ASSIGNMENT
     * =====================================================
     */

    Task<ApiResponse<string>>
        AssignRecruiterAsync(
            AssignStaffRequest request);

    Task<ApiResponse<string>>
        AssignHiringManagerAsync(
            AssignStaffRequest request);

    /*
     * =====================================================
     * ROLES
     * =====================================================
     */

    Task<ApiResponse<List<RoleResponse>>>
        GetRolesAsync();

    /*
     * =====================================================
     * AUDIT LOGS
     * =====================================================
     */

    Task<ApiResponse<PagedResponse<AuditLogResponse>>>
        GetAuditLogsAsync(AuditLogQueryRequest request);

    /*
     * =====================================================
     * REPORTS
     * =====================================================
     */

    Task<ApiResponse<AdminReportsResponse>>
        GetReportsAsync(
            DateTime? startDate,
            DateTime? endDate);

    /*
     * =====================================================
     * ANALYTICS
     * =====================================================
     */

    Task<ApiResponse<AdminAnalyticsResponse>>
        GetAnalyticsAsync(
            DateTime? startDate,
            DateTime? endDate);

    /*
     * =====================================================
     * SETTINGS
     * =====================================================
     */

    Task<ApiResponse<AdminSettingsResponse>>
        GetSettingsAsync();

    Task<ApiResponse<AdminSettingsResponse>>
        UpdateSettingsAsync(
            UpdateAdminSettingsRequest request);
}
