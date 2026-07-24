using ApexHire.Server.DTOs;
using ApexHire.Server.Models;

namespace ApexHire.Server.Interfaces;

public interface IAdminRepository
{
    /*
     * =====================================================
     * DASHBOARD
     * =====================================================
     */

    Task<AdminDashboardResponse>
        GetDashboardAsync();

    /*
     * =====================================================
     * USERS
     * =====================================================
     */

    Task<(List<User> Items, int TotalCount)>
        GetUsersAsync(AdminUserQueryRequest request);

    Task<User?> GetUserByIdAsync(int userId);

    Task<User?> GetUserByEmailAsync(string email);

    Task<bool> UserEmailExistsAsync(
        string email,
        int? excludedUserId = null);

    Task AddUserAsync(User user);

    void DeleteUser(User user);

    /*
     * =====================================================
     * ORGANIZATIONS
     * =====================================================
     */

    Task<List<Organization>>
        GetOrganizationsAsync();

    Task<Organization?>
        GetOrganizationAsync(int organizationId);

    Task<bool> OrganizationNameExistsAsync(
        string name,
        int? excludedOrganizationId = null);

    Task AddOrganizationAsync(
        Organization organization);

    void DeleteOrganization(
        Organization organization);

    /*
     * =====================================================
     * DEPARTMENTS
     * =====================================================
     */

    Task<List<Department>>
        GetDepartmentsAsync(int? organizationId);

    Task<Department?>
        GetDepartmentAsync(int departmentId);

    Task<bool> DepartmentNameExistsAsync(
        int organizationId,
        string name,
        int? excludedDepartmentId = null);

    Task<bool> OrganizationHasDepartmentsAsync(
        int organizationId);

    Task<bool> DepartmentHasRelatedRecordsAsync(
        int departmentId);

    Task AddDepartmentAsync(
        Department department);

    void DeleteDepartment(
        Department department);

    /*
     * =====================================================
     * STAFF PROFILES
     * =====================================================
     */

    Task<RecruiterProfile?>
        GetRecruiterProfileAsync(int userId);

    Task<HiringManagerProfile?>
        GetHiringManagerProfileAsync(int userId);

    Task AddRecruiterProfileAsync(
        RecruiterProfile profile);

    Task AddHiringManagerProfileAsync(
        HiringManagerProfile profile);

    void DeleteRecruiterProfile(
        RecruiterProfile profile);

    void DeleteHiringManagerProfile(
        HiringManagerProfile profile);

    /*
     * =====================================================
     * AUDIT LOGS
     * =====================================================
     */

    Task<PagedResponse<AuditLogResponse>>
        GetAuditLogsAsync(
            AuditLogQueryRequest request);

    /*
     * =====================================================
     * REPORTS AND ANALYTICS
     * =====================================================
     */

    Task<AdminReportsResponse>
        GetReportsAsync(
            DateTime startDate,
            DateTime endDate);

    Task<AdminAnalyticsResponse>
        GetAnalyticsAsync(
            DateTime startDate,
            DateTime endDate);

    /*
     * =====================================================
     * SETTINGS
     * =====================================================
     */

    Task<AdminSettingsResponse?>
        GetSettingsAsync();

    Task<AdminSettingsResponse>
        UpdateSettingsAsync(
            UpdateAdminSettingsRequest request);

    /*
     * =====================================================
     * DATABASE
     * =====================================================
     */

    Task SaveChangesAsync();
}
