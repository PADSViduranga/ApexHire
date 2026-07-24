using ApexHire.Api.Models.Enums;
using ApexHire.Api.Services.Interfaces;
using ApexHire.Server.DTOs;
using ApexHire.Server.Enums;
using ApexHire.Server.Interfaces;
using ApexHire.Server.Models;

namespace ApexHire.Server.Services;

public class AdminService : IAdminService
{
    private readonly IAdminRepository _adminRepository;
    private readonly IAuditLogService _auditLogService;

    public AdminService(
        IAdminRepository adminRepository,
        IAuditLogService auditLogService)
    {
        _adminRepository = adminRepository;
        _auditLogService = auditLogService;
    }
    /*
     * =====================================================
     * DASHBOARD
     * =====================================================
     */

    public async Task<ApiResponse<AdminDashboardResponse>>
        GetDashboardAsync()
    {
        AdminDashboardResponse dashboard =
            await _adminRepository
                .GetDashboardAsync();

        return ApiResponse<AdminDashboardResponse>
            .Succeeded(
                dashboard,
                "Dashboard loaded successfully.");
    }

    /*
     * =====================================================
     * USERS
     * =====================================================
     */

    public async Task<
        ApiResponse<PagedResponse<AdminUserResponse>>>
        GetUsersAsync(
            AdminUserQueryRequest request)
    {
        var result =
            await _adminRepository
                .GetUsersAsync(request);

        PagedResponse<AdminUserResponse>
            response = new()
            {
                Page = request.Page,
                PageSize = request.PageSize,
                TotalItems = result.TotalCount,
                Items = result.Items
                    .Select(MapAdminUser)
                    .ToList()
            };

        return ApiResponse<
            PagedResponse<AdminUserResponse>>
            .Succeeded(
                response,
                "Users loaded successfully.");
    }

    public async Task<
        ApiResponse<AdminUserResponse>>
        GetUserByIdAsync(
            int userId)
    {
        User? user =
            await _adminRepository
                .GetUserByIdAsync(userId);

        if (user is null)
        {
            return ApiResponse<AdminUserResponse>
                .Failed("User not found.");
        }

        return ApiResponse<AdminUserResponse>
            .Succeeded(
                MapAdminUser(user),
                "User loaded successfully.");
    }

    public async Task<
        ApiResponse<AdminUserResponse>>
        CreateUserAsync(
            CreateAdminUserRequest request)
    {
        bool exists =
            await _adminRepository
                .UserEmailExistsAsync(
                    request.Email);

        if (exists)
        {
            return ApiResponse<AdminUserResponse>
                .Failed(
                    "Email already exists.");
        }

        UserRole role =
            Enum.Parse<UserRole>(
                request.Role,
                true);

        User user = new()
        {
            FullName =
                request.FullName.Trim(),

            Email =
                request.Email
                    .Trim()
                    .ToLowerInvariant(),

            PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(
                    request.Password),

            Role = role,

            IsActive =
                request.IsActive,

            CreatedAt =
                DateTime.UtcNow
        };

        await _adminRepository
            .AddUserAsync(user);

        await _adminRepository
            .SaveChangesAsync();

        await _auditLogService
       .LogAsync(
           AuditAction.Create,
           "Administration",
           "User",
           user.Id.ToString(),
           $"Created user '{user.Email}'.");

        return ApiResponse<AdminUserResponse>
            .Succeeded(
                MapAdminUser(user),
                "User created successfully.");
    }

    public async Task<
        ApiResponse<AdminUserResponse>>
        UpdateUserAsync(
            int userId,
            UpdateAdminUserRequest request)
    {
        User? user =
            await _adminRepository
                .GetUserByIdAsync(userId);

        if (user is null)
        {
            return ApiResponse<AdminUserResponse>
                .Failed("User not found.");
        }

        bool exists =
            await _adminRepository
                .UserEmailExistsAsync(
                    request.Email,
                    userId);

        if (exists)
        {
            return ApiResponse<AdminUserResponse>
                .Failed(
                    "Email already exists.");
        }

        user.FullName =
            request.FullName.Trim();

        user.Email =
            request.Email
                .Trim()
                .ToLowerInvariant();

        user.IsActive =
            request.IsActive;

        user.UpdatedAt =
            DateTime.UtcNow;

        await _adminRepository
            .SaveChangesAsync();

        await _auditLogService.LogAsync(
            AuditAction.Update,
            "Administration",
            "User",
            user.Id.ToString(),
            $"Updated user '{user.Email}'.");

        return ApiResponse<AdminUserResponse>
            .Succeeded(
                MapAdminUser(user),
                "User updated successfully.");
    }


    public async Task<
        ApiResponse<AdminUserResponse>>
        UpdateUserRoleAsync(
            int userId,
            UpdateUserRoleRequest request)
    {
        User? user =
            await _adminRepository
                .GetUserByIdAsync(userId);

        if (user is null)
        {
            return ApiResponse<AdminUserResponse>
                .Failed("User not found.");
        }

        if (!Enum.TryParse(
                request.Role,
                true,
                out UserRole role))
        {
            return ApiResponse<AdminUserResponse>
                .Failed("Invalid role.");
        }

        user.Role = role;
        user.UpdatedAt = DateTime.UtcNow;

        await _adminRepository
            .SaveChangesAsync();

        await _auditLogService.LogAsync(
            AuditAction.Update,
            "Administration",
            "User Role",
            user.Id.ToString(),
            $"Changed role of '{user.Email}' to {user.Role}.");

        return ApiResponse<AdminUserResponse>
            .Succeeded(
                MapAdminUser(user),
                "Role updated successfully.");
    }

    public async Task<
        ApiResponse<AdminUserResponse>>
        UpdateUserStatusAsync(
            int userId,
            UpdateUserStatusRequest request)
    {
        User? user =
            await _adminRepository
                .GetUserByIdAsync(userId);

        if (user is null)
        {
            return ApiResponse<AdminUserResponse>
                .Failed("User not found.");
        }

        user.IsActive =
            request.IsActive;

        user.UpdatedAt =
            DateTime.UtcNow;

        await _adminRepository
            .SaveChangesAsync();

        await _auditLogService.LogAsync(
            AuditAction.Update,
            "Administration",
            "User Status",
            user.Id.ToString(),
            $"Changed status of '{user.Email}' to {(user.IsActive ? "Active" : "Inactive")}.");

        return ApiResponse<AdminUserResponse>
            .Succeeded(
                MapAdminUser(user),
                "User status updated successfully.");
    }

    public async Task<
        ApiResponse<string>>
        ResetUserPasswordAsync(
            int userId,
            ResetUserPasswordRequest request)
    {
        User? user =
            await _adminRepository
                .GetUserByIdAsync(userId);

        if (user is null)
        {
            return ApiResponse<string>
                .Failed("User not found.");
        }

        user.PasswordHash =
            BCrypt.Net.BCrypt.HashPassword(
                request.NewPassword);

        user.UpdatedAt =
            DateTime.UtcNow;

        await _adminRepository
            .SaveChangesAsync();

        await _auditLogService.LogAsync(
            AuditAction.Update,
            "Administration",
            "Password",
            user.Id.ToString(),
            $"Password reset for '{user.Email}'.");

        return ApiResponse<string>
            .Succeeded(
                user.Email,
                "Password reset successfully.");
    }

    public async Task<
        ApiResponse<string>>
        DeleteUserAsync(
            int userId)
    {
        User? user =
            await _adminRepository
                .GetUserByIdAsync(userId);

        if (user is null)
        {
            return ApiResponse<string>
                .Failed("User not found.");
        }

        _adminRepository
            .DeleteUser(user);

        await _adminRepository
            .SaveChangesAsync();

        await _auditLogService.LogAsync(
            AuditAction.Delete,
            "Administration",
            "User",
            user.Id.ToString(),
            $"Deleted user '{user.Email}'.");

        return ApiResponse<string>
            .Succeeded(
                user.Email,
                "User deleted successfully.");
    }

    /*
     * =====================================================
     * ORGANIZATIONS
     * =====================================================
     */

    public async Task<
        ApiResponse<List<OrganizationResponse>>>
        GetOrganizationsAsync()
    {
        List<Organization> organizations =
            await _adminRepository
                .GetOrganizationsAsync();

        return ApiResponse<
            List<OrganizationResponse>>
            .Succeeded(
                organizations
                    .Select(MapOrganization)
                    .ToList(),
                "Organizations loaded successfully.");
    }


    public async Task<
        ApiResponse<OrganizationResponse>>
        CreateOrganizationAsync(
            CreateOrganizationRequest request)
    {
        bool exists =
            await _adminRepository
                .OrganizationNameExistsAsync(
                    request.Name);

        if (exists)
        {
            return ApiResponse<OrganizationResponse>
                .Failed(
                    "Organization already exists.");
        }

        Organization organization = new()
        {
            Name = request.Name.Trim(),
            Description =
                request.Description?.Trim(),
            Website =
                request.Website?.Trim(),
            Location =
                request.Location?.Trim(),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _adminRepository
            .AddOrganizationAsync(
                organization);

        await _adminRepository
            .SaveChangesAsync();

        await _auditLogService.LogAsync(
            AuditAction.Create,
            "Administration",
            "Organization",
            organization.Id.ToString(),
            $"Created organization '{organization.Name}'.");

        return ApiResponse<OrganizationResponse>
            .Succeeded(
                MapOrganization(organization),
                "Organization created successfully.");
    }

    public async Task<
        ApiResponse<OrganizationResponse>>
        UpdateOrganizationAsync(
            int organizationId,
            UpdateOrganizationRequest request)
    {
        Organization? organization =
            await _adminRepository
                .GetOrganizationAsync(
                    organizationId);

        if (organization is null)
        {
            return ApiResponse<OrganizationResponse>
                .Failed(
                    "Organization not found.");
        }

        bool exists =
            await _adminRepository
                .OrganizationNameExistsAsync(
                    request.Name,
                    organizationId);

        if (exists)
        {
            return ApiResponse<OrganizationResponse>
                .Failed(
                    "Organization already exists.");
        }

        organization.Name =
            request.Name.Trim();

        organization.Description =
            request.Description?.Trim();

        organization.Website =
            request.Website?.Trim();

        organization.Location =
            request.Location?.Trim();

        organization.IsActive =
            request.IsActive;

        organization.UpdatedAt =
            DateTime.UtcNow;

        await _adminRepository
            .SaveChangesAsync();

        await _auditLogService.LogAsync(
            AuditAction.Update,
            "Administration",
            "Organization",
            organization.Id.ToString(),
            $"Updated organization '{organization.Name}'.");

        return ApiResponse<OrganizationResponse>
            .Succeeded(
                MapOrganization(
                    organization),
                "Organization updated successfully.");
    }

    public async Task<
        ApiResponse<string>>
        DeleteOrganizationAsync(
            int organizationId)
    {
        Organization? organization =
            await _adminRepository
                .GetOrganizationAsync(
                    organizationId);

        if (organization is null)
        {
            return ApiResponse<string>
                .Failed(
                    "Organization not found.");
        }

        bool hasDepartments =
            await _adminRepository
                .OrganizationHasDepartmentsAsync(
                    organizationId);

        if (hasDepartments)
        {
            return ApiResponse<string>
                .Failed(
                    "Delete all departments first.");
        }

        _adminRepository
            .DeleteOrganization(
                organization);

        await _adminRepository
            .SaveChangesAsync();

        await _auditLogService.LogAsync(
            AuditAction.Delete,
            "Administration",
            "Organization",
            organization.Id.ToString(),
            $"Deleted organization '{organization.Name}'.");

        return ApiResponse<string>
            .Succeeded(
                organization.Name,
                "Organization deleted successfully.");
    }

    /*
     * =====================================================
     * DEPARTMENTS
     * =====================================================
     */

    public async Task<
        ApiResponse<List<DepartmentResponse>>>
        GetDepartmentsAsync(
            int? organizationId)
    {
        List<Department> departments =
            await _adminRepository
                .GetDepartmentsAsync(
                    organizationId);

        return ApiResponse<
            List<DepartmentResponse>>
            .Succeeded(
                departments
                    .Select(MapDepartment)
                    .ToList(),
                "Departments loaded successfully.");
    }


    public async Task<
        ApiResponse<DepartmentResponse>>
        CreateDepartmentAsync(
            CreateDepartmentRequest request)
    {
        Organization? organization =
            await _adminRepository
                .GetOrganizationAsync(
                    request.OrganizationId);

        if (organization is null ||
            !organization.IsActive)
        {
            return ApiResponse<DepartmentResponse>
                .Failed("Organization not found.");
        }

        bool exists =
            await _adminRepository
                .DepartmentNameExistsAsync(
                    request.OrganizationId,
                    request.Name);

        if (exists)
        {
            return ApiResponse<DepartmentResponse>
                .Failed(
                    "Department already exists.");
        }

        Department department = new()
        {
            Name = request.Name.Trim(),
            Description =
                request.Description?.Trim(),
            OrganizationId =
                request.OrganizationId,
            Organization = organization,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _adminRepository
            .AddDepartmentAsync(
                department);

        await _adminRepository
            .SaveChangesAsync();

        await _auditLogService.LogAsync(
            AuditAction.Create,
            "Administration",
            "Department",
            department.Id.ToString(),
            $"Created department '{department.Name}'.");

        return ApiResponse<DepartmentResponse>
            .Succeeded(
                MapDepartment(department),
                "Department created successfully.");
    }

    public async Task<
        ApiResponse<DepartmentResponse>>
        UpdateDepartmentAsync(
            int departmentId,
            UpdateDepartmentRequest request)
    {
        Department? department =
            await _adminRepository
                .GetDepartmentAsync(
                    departmentId);

        if (department is null)
        {
            return ApiResponse<DepartmentResponse>
                .Failed(
                    "Department not found.");
        }

        Organization? organization =
            await _adminRepository
                .GetOrganizationAsync(
                    request.OrganizationId);

        if (organization is null)
        {
            return ApiResponse<DepartmentResponse>
                .Failed(
                    "Organization not found.");
        }

        bool exists =
            await _adminRepository
                .DepartmentNameExistsAsync(
                    request.OrganizationId,
                    request.Name,
                    departmentId);

        if (exists)
        {
            return ApiResponse<DepartmentResponse>
                .Failed(
                    "Department already exists.");
        }

        department.Name =
            request.Name.Trim();

        department.Description =
            request.Description?.Trim();

        department.OrganizationId =
            request.OrganizationId;

        department.Organization =
            organization;

        department.IsActive =
            request.IsActive;

        await _adminRepository
            .SaveChangesAsync();

        await _adminRepository
            .SaveChangesAsync();

        await _auditLogService.LogAsync(
            AuditAction.Update,
            "Administration",
            "Department",
            department.Id.ToString(),
            $"Updated department '{department.Name}'.");

        return ApiResponse<DepartmentResponse>
            .Succeeded(
                MapDepartment(department),
                "Department updated successfully.");
    }

    public async Task<
        ApiResponse<string>>
        DeleteDepartmentAsync(
            int departmentId)
    {
        Department? department =
            await _adminRepository
                .GetDepartmentAsync(
                    departmentId);

        if (department is null)
        {
            return ApiResponse<string>
                .Failed(
                    "Department not found.");
        }

        bool hasRelations =
            await _adminRepository
                .DepartmentHasRelatedRecordsAsync(
                    departmentId);

        if (hasRelations)
        {
            return ApiResponse<string>
                .Failed(
                    "Department is in use.");
        }

        _adminRepository
            .DeleteDepartment(
                department);

        await _adminRepository
            .SaveChangesAsync();

        await _auditLogService.LogAsync(
            AuditAction.Delete,
            "Administration",
            "Department",
            department.Id.ToString(),
            $"Deleted department '{department.Name}'.");

        return ApiResponse<string>
            .Succeeded(
                department.Name,
                "Department deleted successfully.");
    }

    /*
     * =====================================================
     * STAFF ASSIGNMENT
     * =====================================================
     */


    public async Task<
        ApiResponse<string>>
        AssignRecruiterAsync(
            AssignStaffRequest request)
    {
        User? user =
            await _adminRepository
                .GetUserByEmailAsync(
                    request.UserEmail);

        if (user is null)
        {
            return ApiResponse<string>
                .Failed(
                    "User not found.");
        }

        Department? department =
            await ValidateDepartmentAsync(
                request);

        if (department is null)
        {
            return ApiResponse<string>
                .Failed(
                    "Invalid organization or department.");
        }

        HiringManagerProfile? manager =
            await _adminRepository
                .GetHiringManagerProfileAsync(
                    user.Id);

        if (manager is not null)
        {
            return ApiResponse<string>
                .Failed(
                    "User is already a hiring manager.");
        }

        RecruiterProfile? recruiter =
            await _adminRepository
                .GetRecruiterProfileAsync(
                    user.Id);

        if (recruiter is null)
        {
            recruiter = new RecruiterProfile
            {
                UserId = user.Id,
                OrganizationId =
                    request.OrganizationId,
                DepartmentId =
                    request.DepartmentId,
                JobTitle =
                    request.JobTitle?.Trim(),
                PhoneNumber =
                    request.PhoneNumber?.Trim(),
                CreatedAt =
                    DateTime.UtcNow
            };

            await _adminRepository
                .AddRecruiterProfileAsync(
                    recruiter);
        }
        else
        {
            recruiter.OrganizationId =
                request.OrganizationId;

            recruiter.DepartmentId =
                request.DepartmentId;

            recruiter.JobTitle =
                request.JobTitle?.Trim();

            recruiter.PhoneNumber =
                request.PhoneNumber?.Trim();

            recruiter.UpdatedAt =
                DateTime.UtcNow;
        }

        user.Role =
            UserRole.Recruiter;

        user.UpdatedAt =
            DateTime.UtcNow;

        await _adminRepository
            .SaveChangesAsync();

        await _auditLogService.LogAsync(
            AuditAction.Assign,
            "Administration",
            "Recruiter",
            user.Id.ToString(),
            $"Assigned recruiter '{user.Email}'.");

        return ApiResponse<string>
            .Succeeded(
                user.Email,
                "Recruiter assigned successfully.");
    }

    public async Task<
        ApiResponse<string>>
        AssignHiringManagerAsync(
            AssignStaffRequest request)
    {
        User? user =
            await _adminRepository
                .GetUserByEmailAsync(
                    request.UserEmail);

        if (user is null)
        {
            return ApiResponse<string>
                .Failed(
                    "User not found.");
        }

        Department? department =
            await ValidateDepartmentAsync(
                request);

        if (department is null)
        {
            return ApiResponse<string>
                .Failed(
                    "Invalid organization or department.");
        }

        RecruiterProfile? recruiter =
            await _adminRepository
                .GetRecruiterProfileAsync(
                    user.Id);

        if (recruiter is not null)
        {
            return ApiResponse<string>
                .Failed(
                    "User is already a recruiter.");
        }

        HiringManagerProfile? manager =
            await _adminRepository
                .GetHiringManagerProfileAsync(
                    user.Id);

        if (manager is null)
        {
            manager = new HiringManagerProfile
            {
                UserId = user.Id,
                OrganizationId =
                    request.OrganizationId,
                DepartmentId =
                    request.DepartmentId,
                JobTitle =
                    request.JobTitle?.Trim(),
                PhoneNumber =
                    request.PhoneNumber?.Trim(),
                CreatedAt =
                    DateTime.UtcNow
            };

            await _adminRepository
                .AddHiringManagerProfileAsync(
                    manager);
        }
        else
        {
            manager.OrganizationId =
                request.OrganizationId;

            manager.DepartmentId =
                request.DepartmentId;

            manager.JobTitle =
                request.JobTitle?.Trim();

            manager.PhoneNumber =
                request.PhoneNumber?.Trim();

            manager.UpdatedAt =
                DateTime.UtcNow;
        }

        user.Role =
            UserRole.HiringManager;

        user.UpdatedAt =
            DateTime.UtcNow;

        await _adminRepository
            .SaveChangesAsync();
        await _auditLogService.LogAsync(
            AuditAction.Assign,
            "Administration",
            "Hiring Manager",
            user.Id.ToString(),
            $"Assigned hiring manager '{user.Email}'.");

        return ApiResponse<string>
            .Succeeded(
                user.Email,
                "Hiring manager assigned successfully.");
    }

    /*
     * =====================================================
     * REPORTS
     * =====================================================
     */


    public async Task<
        ApiResponse<AdminReportsResponse>>
        GetReportsAsync(
            DateTime? startDate,
            DateTime? endDate)
    {
        AdminReportsResponse report =
            await _adminRepository
                .GetReportsAsync(
                    startDate ?? DateTime.UtcNow.AddMonths(-1),
                    endDate ?? DateTime.UtcNow);

        return ApiResponse<AdminReportsResponse>
            .Succeeded(
                report,
                "Reports loaded successfully.");
    }

    /*
     * =====================================================
     * ANALYTICS
     * =====================================================
     */

    public async Task<
        ApiResponse<AdminAnalyticsResponse>>
        GetAnalyticsAsync(
            DateTime? startDate,
            DateTime? endDate)
    {
        AdminAnalyticsResponse analytics =
            await _adminRepository
                .GetAnalyticsAsync(
                    startDate ?? DateTime.UtcNow.AddMonths(-1),
                    endDate ?? DateTime.UtcNow);

        return ApiResponse<AdminAnalyticsResponse>
            .Succeeded(
                analytics,
                "Analytics loaded successfully.");
    }

    /*
     * =====================================================
     * AUDIT LOGS
     * =====================================================
     */

    public async Task<
        ApiResponse<
            PagedResponse<AuditLogResponse>>>
        GetAuditLogsAsync(
            AuditLogQueryRequest request)
    {
        PagedResponse<AuditLogResponse> logs =
            await _adminRepository
                .GetAuditLogsAsync(
                    request);

        return ApiResponse<
            PagedResponse<AuditLogResponse>>
            .Succeeded(
                logs,
                "Audit logs loaded successfully.");
    }

    /*
     * =====================================================
     * SETTINGS
     * =====================================================
     */

    public async Task<
        ApiResponse<AdminSettingsResponse>>
        GetSettingsAsync()
    {
        AdminSettingsResponse? settings =
            await _adminRepository
                .GetSettingsAsync();

        if (settings is null)
        {
            return ApiResponse<
                AdminSettingsResponse>
                .Failed(
                    "Settings not found.");
        }

        return ApiResponse<
            AdminSettingsResponse>
            .Succeeded(
                settings,
                "Settings loaded successfully.");
    }

    public async Task<
        ApiResponse<AdminSettingsResponse>>
        UpdateSettingsAsync(
            UpdateAdminSettingsRequest request)
    {
        AdminSettingsResponse settings =
            await _adminRepository
                .UpdateSettingsAsync(
                    request);

        return ApiResponse<
            AdminSettingsResponse>
            .Succeeded(
                settings,
                "Settings updated successfully.");
    }

    /*
     * =====================================================
     * HELPERS
     * =====================================================
     */


    private async Task<Department?>
        ValidateDepartmentAsync(
            AssignStaffRequest request)
    {
        Department? department =
            await _adminRepository
                .GetDepartmentAsync(
                    request.DepartmentId);

        if (department is null)
        {
            return null;
        }

        if (!department.IsActive)
        {
            return null;
        }

        if (department.OrganizationId !=
            request.OrganizationId)
        {
            return null;
        }

        if (department.Organization is null)
        {
            return null;
        }

        if (!department.Organization.IsActive)
        {
            return null;
        }

        return department;
    }

    private static AdminUserResponse
        MapAdminUser(
            User user)
    {
        return new AdminUserResponse
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString(),
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }

    private static OrganizationResponse
        MapOrganization(
            Organization organization)
    {
        return new OrganizationResponse
        {
            Id = organization.Id,
            Name = organization.Name,
            Description = organization.Description,
            Website = organization.Website,
            Location = organization.Location,
            IsActive = organization.IsActive
        };
    }

    private static DepartmentResponse
        MapDepartment(
            Department department)
    {
        return new DepartmentResponse
        {
            Id = department.Id,
            Name = department.Name,
            Description = department.Description,
            OrganizationId =
                department.OrganizationId,
            OrganizationName =
                department.Organization?.Name ??
                string.Empty,
            IsActive =
                department.IsActive
        };
    }

    public async Task<ApiResponse<OrganizationResponse>>
        GetOrganizationByIdAsync(
            int organizationId)
    {
        Organization? organization =
            await _adminRepository
                .GetOrganizationAsync(
                    organizationId);

        if (organization is null)
        {
            return ApiResponse<OrganizationResponse>
                .Failed("Organization not found.");
        }

        return ApiResponse<OrganizationResponse>
            .Succeeded(
                MapOrganization(organization),
                "Organization loaded successfully.");
    }

    public async Task<ApiResponse<DepartmentResponse>>
        GetDepartmentByIdAsync(
            int departmentId)
    {
        Department? department =
            await _adminRepository
                .GetDepartmentAsync(
                    departmentId);

        if (department is null)
        {
            return ApiResponse<DepartmentResponse>
                .Failed("Department not found.");
        }

        return ApiResponse<DepartmentResponse>
            .Succeeded(
                MapDepartment(department),
                "Department loaded successfully.");
    }

    public Task<ApiResponse<List<RoleResponse>>>
        GetRolesAsync()
    {
        List<RoleResponse> roles =
            Enum.GetValues<UserRole>()
                .Select(role =>
                    new RoleResponse
                    {
                        Value = (int)role,
                        Name = role.ToString(),
                        DisplayName =
                            role == UserRole.HiringManager
                                ? "Hiring Manager"
                                : role.ToString()
                    })
                .ToList();

        return Task.FromResult(
            ApiResponse<List<RoleResponse>>
                .Succeeded(
                    roles,
                    "Roles loaded successfully."));
    }

}

