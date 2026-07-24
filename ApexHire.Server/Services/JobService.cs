using ApexHire.Api.Models.Enums;
using ApexHire.Api.Services.Interfaces;
using ApexHire.Server.DTOs;
using ApexHire.Server.Enums;
using ApexHire.Server.Interfaces;
using ApexHire.Server.Models;

namespace ApexHire.Server.Services;

public class JobService : IJobService
{
    private readonly IJobRepository
        _jobRepository;

    private readonly IUserRepository
        _userRepository;

    private readonly IAdminRepository
        _adminRepository;
    private readonly IAuditLogService _auditLogService;

    public JobService(
        IJobRepository jobRepository,
        IUserRepository userRepository,
        IAdminRepository adminRepository,
        IAuditLogService auditLogService)
    {
        _jobRepository = jobRepository;
        _userRepository = userRepository;
        _adminRepository = adminRepository;
        _auditLogService = auditLogService;
    }

    public async Task<
        ApiResponse<PagedResponse<JobResponse>>>
        SearchAsync(
            JobSearchRequest request)
    {
        if (request.MinimumSalary.HasValue &&
            request.MaximumSalary.HasValue &&
            request.MinimumSalary.Value >
                request.MaximumSalary.Value)
        {
            return ApiResponse<
                PagedResponse<JobResponse>>.Failed(
                    "Minimum salary cannot be greater than maximum salary.");
        }

        PagedResponse<JobPost> jobs =
            await _jobRepository.SearchAsync(
                request);

        var response =
            new PagedResponse<JobResponse>
            {
                Items = jobs.Items
                    .Select(CreateResponse)
                    .ToList(),

                Page = jobs.Page,
                PageSize = jobs.PageSize,
                TotalItems = jobs.TotalItems
            };

        return ApiResponse<
            PagedResponse<JobResponse>>.Succeeded(
                response,
                $"{response.TotalItems} job(s) found.");
    }

    public async Task<ApiResponse<JobResponse>>
        GetByIdAsync(
            int id)
    {
        JobPost? job =
            await _jobRepository.GetByIdAsync(
                id);

        if (job is null ||
            job.Status != JobStatus.Published)
        {
            return ApiResponse<JobResponse>.Failed(
                "Published job was not found.");
        }

        if (job.ApplicationDeadline.HasValue &&
            job.ApplicationDeadline.Value <
                DateTime.UtcNow)
        {
            return ApiResponse<JobResponse>.Failed(
                "This job application period has ended.");
        }

        return ApiResponse<JobResponse>.Succeeded(
            CreateResponse(job),
            "Job retrieved successfully.");
    }

    public async Task<
        ApiResponse<List<JobResponse>>>
        GetRecruiterJobsAsync(
            int currentUserId)
    {
        User? currentUser =
            await _userRepository.GetByIdAsync(
                currentUserId);

        if (currentUser is null ||
            !currentUser.IsActive)
        {
            return ApiResponse<
                List<JobResponse>>.Failed(
                    "User account was not found.");
        }

        if (currentUser.Role !=
            UserRole.Recruiter)
        {
            return ApiResponse<
                List<JobResponse>>.Failed(
                    "Only recruiters can view their job posts.");
        }

        List<JobPost> jobs =
            await _jobRepository
                .GetByCreatedUserIdAsync(
                    currentUserId);

        List<JobResponse> response =
            jobs
                .Select(CreateResponse)
                .ToList();

        return ApiResponse<
            List<JobResponse>>.Succeeded(
                response,
                $"{response.Count} job(s) found.");
    }
    public async Task<ApiResponse<JobResponse>>
    CreateAsync(
        int currentUserId,
        CreateJobRequest request)
    {
        User? currentUser =
            await _userRepository.GetByIdAsync(
                currentUserId);

        if (currentUser is null ||
            !currentUser.IsActive)
        {
            return ApiResponse<JobResponse>.Failed(
                "User account was not found.");
        }

        if (currentUser.Role !=
            UserRole.Recruiter)
        {
            return ApiResponse<JobResponse>.Failed(
                "Only recruiters can create job posts.");
        }

        RecruiterProfile? recruiterProfile =
            await _adminRepository
                .GetRecruiterProfileAsync(
                    currentUserId);

        if (recruiterProfile is null)
        {
            return ApiResponse<JobResponse>.Failed(
                "The recruiter has not been assigned to a department.");
        }

        Department? department =
            await _adminRepository
                .GetDepartmentAsync(
                    recruiterProfile.DepartmentId);

        if (department is null ||
            !department.IsActive ||
            department.OrganizationId !=
                recruiterProfile.OrganizationId ||
            !department.Organization.IsActive)
        {
            return ApiResponse<JobResponse>.Failed(
                "The recruiter's organization or department is inactive.");
        }

        if (string.IsNullOrWhiteSpace(
                request.Title))
        {
            return ApiResponse<JobResponse>.Failed(
                "Job title is required.");
        }

        if (string.IsNullOrWhiteSpace(
                request.Description))
        {
            return ApiResponse<JobResponse>.Failed(
                "Job description is required.");
        }

        if (string.IsNullOrWhiteSpace(
                request.Location))
        {
            return ApiResponse<JobResponse>.Failed(
                "Job location is required.");
        }

        if (!Enum.IsDefined(
                request.EmploymentType))
        {
            return ApiResponse<JobResponse>.Failed(
                "The selected employment type is invalid.");
        }

        if (request.SalaryMin < 0 ||
            request.SalaryMax < 0)
        {
            return ApiResponse<JobResponse>.Failed(
                "Salary values cannot be negative.");
        }

        if (request.SalaryMax <
            request.SalaryMin)
        {
            return ApiResponse<JobResponse>.Failed(
                "Maximum salary cannot be lower than minimum salary.");
        }

        if (request.ApplicationDeadline.HasValue &&
            request.ApplicationDeadline.Value <=
                DateTime.UtcNow)
        {
            return ApiResponse<JobResponse>.Failed(
                "Application deadline must be in the future.");
        }

        var job = new JobPost
        {
            Title =
                request.Title.Trim(),

            Description =
                request.Description.Trim(),

            Location =
                request.Location.Trim(),

            EmploymentType =
                request.EmploymentType,

            RequiredSkills =
                request.RequiredSkills?.Trim() ??
                string.Empty,

            SalaryMin =
                request.SalaryMin,

            SalaryMax =
                request.SalaryMax,

            OrganizationId =
                recruiterProfile.OrganizationId,

            DepartmentId =
                recruiterProfile.DepartmentId,

            ApplicationDeadline =
                request.ApplicationDeadline,

            CreatedByUserId =
                currentUserId,

            Status =
                request.PublishImmediately
                    ? JobStatus.Published
                    : JobStatus.Draft,

            CreatedAt =
                DateTime.UtcNow
        };

        await _jobRepository.AddAsync(
            job);

        await _jobRepository
            .SaveChangesAsync();

        await _auditLogService.LogAsync(
            AuditAction.Create,
            "Jobs",
            "Job",
            job.Id.ToString(),
            $"Created job '{job.Title}'.");

        JobPost? savedJob =
            await _jobRepository.GetByIdAsync(
                job.Id);

        if (savedJob is null)
        {
            return ApiResponse<JobResponse>.Failed(
                "The job was saved but could not be loaded.");
        }

        return ApiResponse<JobResponse>.Succeeded(
            CreateResponse(savedJob),
            "Job created successfully.");
    }
    public async Task<ApiResponse<JobResponse>>
    UpdateStatusAsync(
        int currentUserId,
        int jobId,
        UpdateJobStatusRequest request)
    {
        User? currentUser =
            await _userRepository.GetByIdAsync(
                currentUserId);

        if (currentUser is null ||
            !currentUser.IsActive)
        {
            return ApiResponse<JobResponse>.Failed(
                "User account was not found.");
        }

        if (currentUser.Role !=
            UserRole.Recruiter)
        {
            return ApiResponse<JobResponse>.Failed(
                "Only recruiters can update job status.");
        }

        JobPost? job =
            await _jobRepository.GetByIdAsync(
                jobId);

        if (job is null)
        {
            return ApiResponse<JobResponse>.Failed(
                "Job post was not found.");
        }

        if (job.CreatedByUserId !=
            currentUserId)
        {
            return ApiResponse<JobResponse>.Failed(
                "You can only manage job posts that you created.");
        }

        if (!Enum.IsDefined(
                request.Status))
        {
            return ApiResponse<JobResponse>.Failed(
                "The selected job status is invalid.");
        }

        if (request.Status ==
                JobStatus.Published &&
            job.ApplicationDeadline.HasValue &&
            job.ApplicationDeadline.Value <=
                DateTime.UtcNow)
        {
            return ApiResponse<JobResponse>.Failed(
                "A job with an expired deadline cannot be published.");
        }

        if (job.Status ==
            request.Status)
        {
            return ApiResponse<JobResponse>.Succeeded(
                CreateResponse(job),
                "The job already has the selected status.");
        }

        job.Status =
            request.Status;

        job.UpdatedAt =
            DateTime.UtcNow;

        _jobRepository.Update(
            job);

        await _jobRepository
            .SaveChangesAsync();

        await _auditLogService.LogAsync(
            AuditAction.Update,
            "Jobs",
            "Job Status",
            job.Id.ToString(),
            $"Changed status of job '{job.Title}' to {job.Status}.");

        JobPost? updatedJob =
            await _jobRepository.GetByIdAsync(
                job.Id);

        return ApiResponse<JobResponse>.Succeeded(
            CreateResponse(updatedJob ?? job),
            "Job status updated successfully.");
    }

    public async Task<ApiResponse<JobResponse>>
        UpdateAsync(
            int recruiterUserId,
            int jobId,
            UpdateJobRequest request)
    {
        User? recruiter =
            await _userRepository.GetByIdAsync(
                recruiterUserId);

        if (recruiter is null ||
            !recruiter.IsActive)
        {
            return ApiResponse<JobResponse>.Failed(
                "User account was not found.");
        }

        if (recruiter.Role !=
            UserRole.Recruiter)
        {
            return ApiResponse<JobResponse>.Failed(
                "Only recruiters can update job posts.");
        }

        JobPost? job =
            await _jobRepository.GetByIdAsync(
                jobId);

        if (job is null)
        {
            return ApiResponse<JobResponse>.Failed(
                "Job post was not found.");
        }

        if (job.CreatedByUserId !=
            recruiterUserId)
        {
            return ApiResponse<JobResponse>.Failed(
                "You can only update job posts that you created.");
        }

        if (string.IsNullOrWhiteSpace(
                request.Title))
        {
            return ApiResponse<JobResponse>.Failed(
                "Job title is required.");
        }

        if (string.IsNullOrWhiteSpace(
                request.Description))
        {
            return ApiResponse<JobResponse>.Failed(
                "Job description is required.");
        }

        if (string.IsNullOrWhiteSpace(
                request.Location))
        {
            return ApiResponse<JobResponse>.Failed(
                "Job location is required.");
        }

        if (!Enum.IsDefined(
                request.EmploymentType))
        {
            return ApiResponse<JobResponse>.Failed(
                "The selected employment type is invalid.");
        }

        if (request.SalaryMin < 0 ||
            request.SalaryMax < 0)
        {
            return ApiResponse<JobResponse>.Failed(
                "Salary values cannot be negative.");
        }

        if (request.SalaryMax <
            request.SalaryMin)
        {
            return ApiResponse<JobResponse>.Failed(
                "Maximum salary cannot be lower than minimum salary.");
        }

        if (request.ApplicationDeadline.HasValue &&
            request.ApplicationDeadline.Value <=
                DateTime.UtcNow)
        {
            return ApiResponse<JobResponse>.Failed(
                "Application deadline must be in the future.");
        }

        if (request.DepartmentId.HasValue)
        {
            bool departmentIsValid =
                await _jobRepository
                    .DepartmentBelongsToOrganizationAsync(
                        request.DepartmentId.Value,
                        job.OrganizationId);

            if (!departmentIsValid)
            {
                return ApiResponse<JobResponse>.Failed(
                    "The selected department does not belong to the job organization or is inactive.");
            }
        }

        job.Title =
            request.Title.Trim();

        job.Description =
            request.Description.Trim();

        job.Location =
            request.Location.Trim();

        job.EmploymentType =
            request.EmploymentType;

        job.RequiredSkills =
            request.RequiredSkills?.Trim() ??
            string.Empty;

        job.SalaryMin =
            request.SalaryMin;

        job.SalaryMax =
            request.SalaryMax;

        job.ApplicationDeadline =
            request.ApplicationDeadline;

        job.DepartmentId =
            request.DepartmentId;

        job.UpdatedAt =
            DateTime.UtcNow;

        _jobRepository.Update(
            job);

        await _jobRepository
            .SaveChangesAsync();

        await _auditLogService.LogAsync(
             AuditAction.Update,
            "Jobs",
            "Job",
            job.Id.ToString(),
            $"Updated job '{job.Title}'.");

        JobPost? updatedJob =
            await _jobRepository.GetByIdAsync(
                job.Id);

        if (updatedJob is null)
        {
            return ApiResponse<JobResponse>.Failed(
                "The job was updated but could not be loaded.");
        }

        return ApiResponse<JobResponse>.Succeeded(
            CreateResponse(updatedJob),
            "Job updated successfully.");
    }

    public async Task<ApiResponse<string>>
        DeleteAsync(
            int recruiterUserId,
            int jobId)
    {
        User? recruiter =
            await _userRepository.GetByIdAsync(
                recruiterUserId);

        if (recruiter is null ||
            !recruiter.IsActive)
        {
            return ApiResponse<string>.Failed(
                "User account was not found.");
        }

        if (recruiter.Role !=
            UserRole.Recruiter)
        {
            return ApiResponse<string>.Failed(
                "Only recruiters can delete job posts.");
        }

        JobPost? job =
            await _jobRepository.GetByIdAsync(
                jobId);

        if (job is null)
        {
            return ApiResponse<string>.Failed(
                "Job post was not found.");
        }

        if (job.CreatedByUserId !=
            recruiterUserId)
        {
            return ApiResponse<string>.Failed(
                "You can only delete job posts that you created.");
        }

        if (job.Applications.Count > 0)
        {
            return ApiResponse<string>.Failed(
                "This job cannot be deleted because it already has applications. Close the job instead.");
        }

        _jobRepository.Remove(
            job);

        await _jobRepository
            .SaveChangesAsync();
        await _auditLogService.LogAsync(
            AuditAction.Delete,
            "Jobs",
            "Job",
            job.Id.ToString(),
            $"Deleted job '{job.Title}'.");

        return ApiResponse<string>.Succeeded(
            "Job deleted successfully.",
            "Job deleted successfully.");
    }
    private static JobResponse CreateResponse(
    JobPost job)
    {
        return new JobResponse
        {
            Id =
                job.Id,

            Title =
                job.Title,

            Description =
                job.Description,

            Location =
                job.Location,

            EmploymentType =
                job.EmploymentType.ToString(),

            RequiredSkills =
                job.RequiredSkills,

            SalaryMin =
                job.SalaryMin,

            SalaryMax =
                job.SalaryMax,

            Status =
                job.Status.ToString(),

            ApplicationDeadline =
                job.ApplicationDeadline,

            OrganizationId =
                job.OrganizationId,

            OrganizationName =
                job.Organization?.Name ??
                string.Empty,

            DepartmentId =
                job.DepartmentId,

            DepartmentName =
                job.Department?.Name,

            CreatedByUserId =
                job.CreatedByUserId,

            CreatedByName =
                job.CreatedByUser?.FullName ??
                string.Empty,

            CreatedAt =
                job.CreatedAt
        };
    }
}