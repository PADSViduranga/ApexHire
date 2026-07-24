using System.ComponentModel.DataAnnotations;

namespace ApexHire.Server.DTOs;

public class AdminUserQueryRequest
{
    public string? Search { get; set; }

    public string? Role { get; set; }

    public bool? IsActive { get; set; }

    [Range(1, int.MaxValue)]
    public int Page { get; set; } = 1;

    [Range(1, 100)]
    public int PageSize { get; set; } = 10;

    public string SortBy { get; set; } = "FullName";

    public bool Descending { get; set; }
}

public class AdminUserResponse
{
    public int Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool HasCandidateProfile { get; set; }

    public bool HasRecruiterProfile { get; set; }

    public bool HasHiringManagerProfile { get; set; }
}

public class CreateAdminUserRequest
{
    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = "Candidate";

    public bool IsActive { get; set; } = true;
}

public class UpdateAdminUserRequest
{
    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}

public class UpdateUserRoleRequest
{
    [Required]
    public string Role { get; set; } = string.Empty;
}

public class UpdateUserStatusRequest
{
    public bool IsActive { get; set; }
}

public class ResetUserPasswordRequest
{
    [Required]
    [MinLength(8)]
    public string NewPassword { get; set; } = string.Empty;
}

public class AdminDashboardResponse
{
    public int TotalUsers { get; set; }

    public int ActiveUsers { get; set; }

    public int InactiveUsers { get; set; }

    public int CandidateCount { get; set; }

    public int RecruiterCount { get; set; }

    public int HiringManagerCount { get; set; }

    public int AdminCount { get; set; }

    public int OrganizationCount { get; set; }

    public int DepartmentCount { get; set; }

    public int JobPostCount { get; set; }

    public int ActiveJobPostCount { get; set; }

    public int ApplicationCount { get; set; }

    public int InterviewCount { get; set; }

    public int RecentUserCount { get; set; }

    public List<AdminUserResponse> RecentUsers { get; set; } =
        new();
}

public class RoleResponse
{
    public int Value { get; set; }

    public string Name { get; set; } = string.Empty;

    public string DisplayName { get; set; } = string.Empty;
}

public class AuditLogQueryRequest
{
    public string? Search { get; set; }

    public string? Action { get; set; }

    public string? EntityType { get; set; }

    public int? UserId { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    [Range(1, int.MaxValue)]
    public int Page { get; set; } = 1;

    [Range(1, 100)]
    public int PageSize { get; set; } = 20;
}

public class AuditLogResponse
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public string? UserName { get; set; }

    public string? UserEmail { get; set; }

    public string Action { get; set; } = string.Empty;

    public string EntityType { get; set; } = string.Empty;

    public string? EntityId { get; set; }

    public string? Description { get; set; }

    public string? IpAddress { get; set; }

    public DateTime CreatedAt { get; set; }
}

public class AdminReportsResponse
{
    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public int NewUsers { get; set; }

    public int NewCandidates { get; set; }

    public int NewRecruiters { get; set; }

    public int NewHiringManagers { get; set; }

    public int NewOrganizations { get; set; }

    public int NewDepartments { get; set; }

    public int NewJobPosts { get; set; }

    public int NewApplications { get; set; }

    public int NewInterviews { get; set; }

    public decimal AverageApplicationsPerJob { get; set; }

    public decimal InterviewConversionRate { get; set; }

    public List<AdminReportItemResponse>
        UsersByRole { get; set; } = new();

    public List<AdminReportItemResponse>
        ApplicationsByStatus { get; set; } = new();

    public List<AdminReportItemResponse>
        JobsByStatus { get; set; } = new();
}

public class AdminReportItemResponse
{
    public string Label { get; set; } = string.Empty;

    public int Count { get; set; }

    public decimal Percentage { get; set; }
}

public class AdminAnalyticsResponse
{
    public List<AdminTimeSeriesPointResponse>
        UserGrowth { get; set; } = new();

    public List<AdminTimeSeriesPointResponse>
        JobGrowth { get; set; } = new();

    public List<AdminTimeSeriesPointResponse>
        ApplicationGrowth { get; set; } = new();

    public List<AdminReportItemResponse>
        UsersByRole { get; set; } = new();

    public List<AdminReportItemResponse>
        ApplicationsByStatus { get; set; } = new();

    public List<AdminReportItemResponse>
        JobsByStatus { get; set; } = new();

    public List<AdminOrganizationAnalyticsResponse>
        TopOrganizations { get; set; } = new();
}

public class AdminTimeSeriesPointResponse
{
    public string Period { get; set; } = string.Empty;

    public int Count { get; set; }
}

public class AdminOrganizationAnalyticsResponse
{
    public int OrganizationId { get; set; }

    public string OrganizationName { get; set; } =
        string.Empty;

    public int DepartmentCount { get; set; }

    public int JobCount { get; set; }

    public int ApplicationCount { get; set; }
}

public class AdminSettingsResponse
{
    public string ApplicationName { get; set; } =
        "ApexHire";

    public string SupportEmail { get; set; } =
        string.Empty;

    public bool AllowCandidateRegistration { get; set; } =
        true;

    public bool RequireEmailVerification { get; set; }

    public bool EnableMaintenanceMode { get; set; }

    public int DefaultPageSize { get; set; } = 10;

    public int MaximumPageSize { get; set; } = 100;

    public int PasswordMinimumLength { get; set; } = 8;

    public DateTime? UpdatedAt { get; set; }
}

public class UpdateAdminSettingsRequest
{
    [Required]
    [MaxLength(100)]
    public string ApplicationName { get; set; } =
        "ApexHire";

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string SupportEmail { get; set; } =
        string.Empty;

    public bool AllowCandidateRegistration { get; set; }

    public bool RequireEmailVerification { get; set; }

    public bool EnableMaintenanceMode { get; set; }

    [Range(1, 100)]
    public int DefaultPageSize { get; set; } = 10;

    [Range(1, 500)]
    public int MaximumPageSize { get; set; } = 100;

    [Range(8, 128)]
    public int PasswordMinimumLength { get; set; } = 8;
}

public class UpdateOrganizationRequest
{
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Url]
    [MaxLength(150)]
    public string? Website { get; set; }

    [MaxLength(150)]
    public string? Location { get; set; }

    public bool IsActive { get; set; }
}

public class UpdateDepartmentRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Range(1, int.MaxValue)]
    public int OrganizationId { get; set; }

    public bool IsActive { get; set; }
}

public class CreateOrganizationRequest
{
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Url]
    [MaxLength(150)]
    public string? Website { get; set; }

    [MaxLength(150)]
    public string? Location { get; set; }
}

public class OrganizationResponse
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? Website { get; set; }

    public string? Location { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}

public class CreateDepartmentRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Range(1, int.MaxValue)]
    public int OrganizationId { get; set; }
}

public class DepartmentResponse
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int OrganizationId { get; set; }

    public string OrganizationName { get; set; } =
        string.Empty;

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }
}

public class AssignStaffRequest
{
    [Required]
    [EmailAddress]
    public string UserEmail { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int OrganizationId { get; set; }

    [Range(1, int.MaxValue)]
    public int DepartmentId { get; set; }

    [MaxLength(100)]
    public string? JobTitle { get; set; }

    [MaxLength(30)]
    public string? PhoneNumber { get; set; }
}

