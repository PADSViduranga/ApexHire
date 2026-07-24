using ApexHire.Server.Data;
using ApexHire.Server.DTOs;
using ApexHire.Server.Enums;
using ApexHire.Server.Interfaces;
using ApexHire.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ApexHire.Server.Repositories;

public class AdminRepository : IAdminRepository
{
    private readonly ApplicationDbContext _context;

    public AdminRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    /*
     * =====================================================
     * DASHBOARD
     * =====================================================
     */

    public async Task<AdminDashboardResponse>
        GetDashboardAsync()
    {
        DateTime recentDate =
            DateTime.UtcNow.AddDays(-30);

        List<User> recentUsers =
            await _context.Users
                .AsNoTracking()
                .Include(user =>
                    user.CandidateProfile)
                .Include(user =>
                    user.RecruiterProfile)
                .Include(user =>
                    user.HiringManagerProfile)
                .OrderByDescending(user =>
                    user.CreatedAt)
                .Take(5)
                .ToListAsync();

        return new AdminDashboardResponse
        {
            TotalUsers =
                await _context.Users.CountAsync(),

            ActiveUsers =
                await _context.Users.CountAsync(
                    user => user.IsActive),

            InactiveUsers =
                await _context.Users.CountAsync(
                    user => !user.IsActive),

            CandidateCount =
                await _context.Users.CountAsync(
                    user =>
                        user.Role ==
                        UserRole.Candidate),

            RecruiterCount =
                await _context.Users.CountAsync(
                    user =>
                        user.Role ==
                        UserRole.Recruiter),

            HiringManagerCount =
                await _context.Users.CountAsync(
                    user =>
                        user.Role ==
                        UserRole.HiringManager),

            AdminCount =
                await _context.Users.CountAsync(
                    user =>
                        user.Role ==
                        UserRole.Admin),

            OrganizationCount =
                await _context.Organizations
                    .CountAsync(),

            DepartmentCount =
                await _context.Departments
                    .CountAsync(),

            JobPostCount =
                await _context.JobPosts
                    .CountAsync(),

            ActiveJobPostCount =
                await _context.JobPosts.CountAsync(
                    job =>
                        job.Status ==
                        JobStatus.Published),

            ApplicationCount =
                await _context.JobApplications
                    .CountAsync(),

            InterviewCount =
                await _context.Interviews
                    .CountAsync(),

            RecentUserCount =
                await _context.Users.CountAsync(
                    user =>
                        user.CreatedAt >=
                        recentDate),

            RecentUsers =
                recentUsers
                    .Select(MapAdminUser)
                    .ToList()
        };
    }

    /*
     * =====================================================
     * USERS
     * =====================================================
     */

    public async Task<(
        List<User> Items,
        int TotalCount)>
        GetUsersAsync(
            AdminUserQueryRequest request)
    {
        IQueryable<User> query =
            _context.Users
                .AsNoTracking()
                .Include(user =>
                    user.CandidateProfile)
                .Include(user =>
                    user.RecruiterProfile)
                .Include(user =>
                    user.HiringManagerProfile);

        if (!string.IsNullOrWhiteSpace(
                request.Search))
        {
            string search =
                request.Search
                    .Trim()
                    .ToLower();

            query = query.Where(user =>
                user.FullName
                    .ToLower()
                    .Contains(search) ||
                user.Email
                    .ToLower()
                    .Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(
                request.Role) &&
            Enum.TryParse(
                request.Role,
                true,
                out UserRole parsedRole))
        {
            query = query.Where(user =>
                user.Role == parsedRole);
        }

        if (request.IsActive.HasValue)
        {
            query = query.Where(user =>
                user.IsActive ==
                request.IsActive.Value);
        }

        int totalCount =
            await query.CountAsync();

        query = ApplyUserSorting(
            query,
            request.SortBy,
            request.Descending);

        int page =
            Math.Max(request.Page, 1);

        int pageSize =
            Math.Clamp(
                request.PageSize,
                1,
                100);

        List<User> users =
            await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

        return (users, totalCount);
    }

    public async Task<User?>
        GetUserByIdAsync(int userId)
    {
        return await _context.Users
            .Include(user =>
                user.CandidateProfile)
            .Include(user =>
                user.RecruiterProfile)
            .Include(user =>
                user.HiringManagerProfile)
            .FirstOrDefaultAsync(user =>
                user.Id == userId);
    }

    public async Task<User?>
        GetUserByEmailAsync(string email)
    {
        string normalizedEmail =
            email.Trim().ToLowerInvariant();

        return await _context.Users
            .Include(user =>
                user.CandidateProfile)
            .Include(user =>
                user.RecruiterProfile)
            .Include(user =>
                user.HiringManagerProfile)
            .FirstOrDefaultAsync(user =>
                user.Email ==
                normalizedEmail);
    }

    public async Task<bool>
        UserEmailExistsAsync(
            string email,
            int? excludedUserId = null)
    {
        string normalizedEmail =
            email.Trim().ToLowerInvariant();

        IQueryable<User> query =
            _context.Users.Where(user =>
                user.Email ==
                normalizedEmail);

        if (excludedUserId.HasValue)
        {
            query = query.Where(user =>
                user.Id !=
                excludedUserId.Value);
        }

        return await query.AnyAsync();
    }

    public async Task AddUserAsync(User user)
    {
        await _context.Users.AddAsync(user);
    }

    public void DeleteUser(User user)
    {
        _context.Users.Remove(user);
    }

    private static IQueryable<User>
        ApplyUserSorting(
            IQueryable<User> query,
            string? sortBy,
            bool descending)
    {
        string normalizedSort =
            sortBy?
                .Trim()
                .ToLowerInvariant()
            ?? "fullname";

        return normalizedSort switch
        {
            "email" => descending
                ? query.OrderByDescending(
                    user => user.Email)
                : query.OrderBy(
                    user => user.Email),

            "role" => descending
                ? query.OrderByDescending(
                    user => user.Role)
                : query.OrderBy(
                    user => user.Role),

            "isactive" or "status" =>
                descending
                    ? query.OrderByDescending(
                        user => user.IsActive)
                    : query.OrderBy(
                        user => user.IsActive),

            "createdat" => descending
                ? query.OrderByDescending(
                    user => user.CreatedAt)
                : query.OrderBy(
                    user => user.CreatedAt),

            "updatedat" => descending
                ? query.OrderByDescending(
                    user => user.UpdatedAt)
                : query.OrderBy(
                    user => user.UpdatedAt),

            _ => descending
                ? query.OrderByDescending(
                    user => user.FullName)
                : query.OrderBy(
                    user => user.FullName)
        };
    }

    private static AdminUserResponse
        MapAdminUser(User user)
    {
        return new AdminUserResponse
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString(),
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,

            HasCandidateProfile =
                user.CandidateProfile is not null,

            HasRecruiterProfile =
                user.RecruiterProfile is not null,

            HasHiringManagerProfile =
                user.HiringManagerProfile is not null
        };
    }

    /*
     * =====================================================
     * ORGANIZATIONS
     * =====================================================
     */

    public async Task<List<Organization>>
        GetOrganizationsAsync()
    {
        return await _context.Organizations
            .AsNoTracking()
            .OrderBy(o => o.Name)
            .ToListAsync();
    }

    public async Task<Organization?>
        GetOrganizationAsync(
            int organizationId)
    {
        return await _context.Organizations
            .FirstOrDefaultAsync(o =>
                o.Id == organizationId);
    }

    public async Task<bool>
        OrganizationNameExistsAsync(
            string name,
            int? excludedOrganizationId = null)
    {
        string normalized =
            name.Trim().ToLower();

        IQueryable<Organization> query =
            _context.Organizations.Where(o =>
                o.Name.ToLower() == normalized);

        if (excludedOrganizationId.HasValue)
        {
            query = query.Where(o =>
                o.Id !=
                excludedOrganizationId.Value);
        }

        return await query.AnyAsync();
    }

    public async Task AddOrganizationAsync(
        Organization organization)
    {
        await _context.Organizations
            .AddAsync(organization);
    }

    public void DeleteOrganization(
        Organization organization)
    {
        _context.Organizations.Remove(
            organization);
    }

    public async Task<bool>
        OrganizationHasDepartmentsAsync(
            int organizationId)
    {
        return await _context.Departments
            .AnyAsync(d =>
                d.OrganizationId ==
                organizationId);
    }

    /*
     * =====================================================
     * DEPARTMENTS
     * =====================================================
     */

    public async Task<List<Department>>
        GetDepartmentsAsync(
            int? organizationId)
    {
        IQueryable<Department> query =
            _context.Departments
                .AsNoTracking()
                .Include(d =>
                    d.Organization);

        if (organizationId.HasValue)
        {
            query = query.Where(d =>
                d.OrganizationId ==
                organizationId.Value);
        }

        return await query
            .OrderBy(d => d.Name)
            .ToListAsync();
    }

    public async Task<Department?>
        GetDepartmentAsync(
            int departmentId)
    {
        return await _context.Departments
            .Include(d =>
                d.Organization)
            .FirstOrDefaultAsync(d =>
                d.Id == departmentId);
    }

    public async Task<bool>
        DepartmentNameExistsAsync(
            int organizationId,
            string name,
            int? excludedDepartmentId = null)
    {
        string normalized =
            name.Trim().ToLower();

        IQueryable<Department> query =
            _context.Departments.Where(d =>
                d.OrganizationId ==
                organizationId &&
                d.Name.ToLower() ==
                normalized);

        if (excludedDepartmentId.HasValue)
        {
            query = query.Where(d =>
                d.Id !=
                excludedDepartmentId.Value);
        }

        return await query.AnyAsync();
    }

    public async Task<bool>
        DepartmentHasRelatedRecordsAsync(
            int departmentId)
    {
        bool recruiterExists =
            await _context.RecruiterProfiles
                .AnyAsync(r =>
                    r.DepartmentId ==
                    departmentId);

        if (recruiterExists)
        {
            return true;
        }

        bool managerExists =
            await _context.HiringManagerProfiles
                .AnyAsync(h =>
                    h.DepartmentId ==
                    departmentId);

        if (managerExists)
        {
            return true;
        }

        return await _context.JobPosts
            .AnyAsync(job =>
                job.DepartmentId ==
                departmentId);
    }

    public async Task AddDepartmentAsync(
        Department department)
    {
        await _context.Departments
            .AddAsync(department);
    }

    public void DeleteDepartment(
        Department department)
    {
        _context.Departments.Remove(
            department);
    }


    /*
     * =====================================================
     * STAFF PROFILES
     * =====================================================
     */

    public async Task<RecruiterProfile?>
        GetRecruiterProfileAsync(int userId)
    {
        return await _context.RecruiterProfiles
            .Include(profile =>
                profile.Organization)
            .Include(profile =>
                profile.Department)
            .FirstOrDefaultAsync(profile =>
                profile.UserId == userId);
    }

    public async Task<HiringManagerProfile?>
        GetHiringManagerProfileAsync(int userId)
    {
        return await _context.HiringManagerProfiles
            .Include(profile =>
                profile.Organization)
            .Include(profile =>
                profile.Department)
            .FirstOrDefaultAsync(profile =>
                profile.UserId == userId);
    }

    public async Task AddRecruiterProfileAsync(
        RecruiterProfile profile)
    {
        await _context.RecruiterProfiles
            .AddAsync(profile);
    }

    public async Task AddHiringManagerProfileAsync(
        HiringManagerProfile profile)
    {
        await _context.HiringManagerProfiles
            .AddAsync(profile);
    }

    public void DeleteRecruiterProfile(
        RecruiterProfile profile)
    {
        _context.RecruiterProfiles
            .Remove(profile);
    }

    public void DeleteHiringManagerProfile(
        HiringManagerProfile profile)
    {
        _context.HiringManagerProfiles
            .Remove(profile);
    }

    /*
     * =====================================================
     * REPORTS
     * =====================================================
     */

    public async Task<AdminReportsResponse>
        GetReportsAsync(
            DateTime startDate,
            DateTime endDate)
    {
        int newUsers =
            await _context.Users.CountAsync(user =>
                user.CreatedAt >= startDate &&
                user.CreatedAt <= endDate);

        int newCandidates =
            await _context.Users.CountAsync(user =>
                user.Role == UserRole.Candidate &&
                user.CreatedAt >= startDate &&
                user.CreatedAt <= endDate);

        int newRecruiters =
            await _context.Users.CountAsync(user =>
                user.Role == UserRole.Recruiter &&
                user.CreatedAt >= startDate &&
                user.CreatedAt <= endDate);

        int newManagers =
            await _context.Users.CountAsync(user =>
                user.Role == UserRole.HiringManager &&
                user.CreatedAt >= startDate &&
                user.CreatedAt <= endDate);

        int newOrganizations =
            await _context.Organizations.CountAsync(o =>
                o.CreatedAt >= startDate &&
                o.CreatedAt <= endDate);

        int newDepartments =
            await _context.Departments.CountAsync(d =>
                d.CreatedAt >= startDate &&
                d.CreatedAt <= endDate);

        int newJobs =
            await _context.JobPosts.CountAsync(job =>
                job.CreatedAt >= startDate &&
                job.CreatedAt <= endDate);

        int newApplications =
            await _context.JobApplications.CountAsync(application =>
                application.AppliedAt >= startDate &&
                application.AppliedAt <= endDate);

        int newInterviews =
            await _context.Interviews.CountAsync(interview =>
                interview.CreatedAt >= startDate &&
                interview.CreatedAt <= endDate);

        return new AdminReportsResponse
        {
            StartDate = startDate,
            EndDate = endDate,

            NewUsers = newUsers,
            NewCandidates = newCandidates,
            NewRecruiters = newRecruiters,
            NewHiringManagers = newManagers,

            NewOrganizations = newOrganizations,
            NewDepartments = newDepartments,

            NewJobPosts = newJobs,
            NewApplications = newApplications,
            NewInterviews = newInterviews
        };
    }

    /*
     * =====================================================
     * ANALYTICS
     * =====================================================
     */

    public async Task<AdminAnalyticsResponse>
        GetAnalyticsAsync(
            DateTime startDate,
            DateTime endDate)
    {
        AdminAnalyticsResponse analytics =
            new();

        analytics.UsersByRole =
        (
            await _context.Users
                .GroupBy(user => user.Role)
                .Select(group =>
                    new AdminReportItemResponse
                    {
                        Label = group.Key.ToString(),
                        Count = group.Count()
                    })
                .ToListAsync()
        );

        analytics.JobsByStatus =
        (
            await _context.JobPosts
                .GroupBy(job => job.Status)
                .Select(group =>
                    new AdminReportItemResponse
                    {
                        Label = group.Key.ToString(),
                        Count = group.Count()
                    })
                .ToListAsync()
        );

        analytics.ApplicationsByStatus =
        (
            await _context.JobApplications
                .GroupBy(application =>
                    application.Status)
                .Select(group =>
                    new AdminReportItemResponse
                    {
                        Label = group.Key.ToString(),
                        Count = group.Count()
                    })
                .ToListAsync()
        );

        return analytics;
    }


    /*
     * =====================================================
     * AUDIT LOGS
     * =====================================================
     */

    public async Task<PagedResponse<AuditLogResponse>>
        GetAuditLogsAsync(
            AuditLogQueryRequest request)
    {
        /*
         * AuditLog table is not yet implemented.
         * Returning an empty result keeps the API
         * compatible until the AuditLog entity is
         * added later.
         */

        return await Task.FromResult(
            new PagedResponse<AuditLogResponse>
            {
                Page = request.Page,
                PageSize = request.PageSize,
                TotalItems = 0,
                Items = new List<AuditLogResponse>()
            });
    }

    /*
     * =====================================================
     * SETTINGS
     * =====================================================
     */

    public async Task<AdminSettingsResponse?>
        GetSettingsAsync()
    {
        return await Task.FromResult(
            new AdminSettingsResponse
            {
                ApplicationName = "ApexHire",
                SupportEmail = "support@apexhire.com",
                AllowCandidateRegistration = true,
                RequireEmailVerification = false,
                EnableMaintenanceMode = false,
                DefaultPageSize = 10,
                MaximumPageSize = 100,
                PasswordMinimumLength = 8,
                UpdatedAt = DateTime.UtcNow
            });
    }

    public async Task<AdminSettingsResponse>
        UpdateSettingsAsync(
            UpdateAdminSettingsRequest request)
    {
        /*
         * Persistent settings table will be added
         * later. For now we simply return the
         * updated values.
         */

        return await Task.FromResult(
            new AdminSettingsResponse
            {
                ApplicationName =
                    request.ApplicationName,

                SupportEmail =
                    request.SupportEmail,

                AllowCandidateRegistration =
                    request.AllowCandidateRegistration,

                RequireEmailVerification =
                    request.RequireEmailVerification,

                EnableMaintenanceMode =
                    request.EnableMaintenanceMode,

                DefaultPageSize =
                    request.DefaultPageSize,

                MaximumPageSize =
                    request.MaximumPageSize,

                PasswordMinimumLength =
                    request.PasswordMinimumLength,

                UpdatedAt = DateTime.UtcNow
            });
    }

    /*
     * =====================================================
     * DATABASE
     * =====================================================
     */

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
