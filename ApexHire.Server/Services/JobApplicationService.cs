using ApexHire.Api.Models.Enums;
using ApexHire.Api.Services.Interfaces;
using ApexHire.Server.DTOs;
using ApexHire.Server.Enums;
using ApexHire.Server.Interfaces;
using ApexHire.Server.Models;
using System.Net;

namespace ApexHire.Server.Services;

public class JobApplicationService : IJobApplicationService
{
    private readonly IJobApplicationRepository
        _applicationRepository;

    private readonly IUserRepository _userRepository;

    private readonly IEmailService _emailService;
    private readonly IAuditLogService _auditLogService;

    public JobApplicationService(
        IJobApplicationRepository applicationRepository,
        IUserRepository userRepository,
        IEmailService emailService,
        IAuditLogService auditLogService)
    {
        _applicationRepository = applicationRepository;
        _userRepository = userRepository;
        _emailService = emailService;
        _auditLogService = auditLogService;
    }

    public async Task<ApiResponse<JobApplicationResponse>>
        ApplyAsync(
            int candidateUserId,
            CreateJobApplicationRequest request)
    {
        User? user = await _userRepository.GetByIdAsync(
            candidateUserId);

        if (user is null || !user.IsActive)
        {
            return ApiResponse<JobApplicationResponse>.Failed(
                "User account was not found.");
        }

        if (user.Role != UserRole.Candidate)
        {
            return ApiResponse<JobApplicationResponse>.Failed(
                "Only candidates can apply for jobs.");
        }

        JobPost? job = await _applicationRepository
            .GetJobAsync(request.JobPostId);

        if (job is null)
        {
            return ApiResponse<JobApplicationResponse>.Failed(
                "Job was not found.");
        }

        if (job.Status != JobStatus.Published)
        {
            return ApiResponse<JobApplicationResponse>.Failed(
                "Applications are not accepted for this job.");
        }

        if (job.ApplicationDeadline.HasValue &&
            job.ApplicationDeadline.Value < DateTime.UtcNow)
        {
            return ApiResponse<JobApplicationResponse>.Failed(
                "The application deadline has passed.");
        }

        JobApplication? existingApplication =
            await _applicationRepository.GetExistingAsync(
                request.JobPostId,
                candidateUserId);

        if (existingApplication is not null)
        {
            return ApiResponse<JobApplicationResponse>.Failed(
                "You have already applied for this job.");
        }

        var application = new JobApplication
        {
            JobPostId = request.JobPostId,
            CandidateUserId = candidateUserId,

            CoverLetter = string.IsNullOrWhiteSpace(
                request.CoverLetter)
                    ? null
                    : request.CoverLetter.Trim(),

            Status = ApplicationStatus.Submitted,
            MatchScore = 0,
            AppliedAt = DateTime.UtcNow
        };

        await _applicationRepository.AddAsync(application);
        await _applicationRepository.SaveChangesAsync();

        await _auditLogService.LogAsync(
            AuditAction.Create,
            "Job Applications",
            "Application",
            application.Id.ToString(),
            $"Candidate '{user.Email}' applied for '{job.Title}'.");

        try
        {
            await SendApplicationSubmittedEmailAsync(
                user,
                job,
                application);
        }
        catch
        {
            // Application submission remains successful
            // even when email delivery fails.
        }

        var response = new JobApplicationResponse
        {
            Id = application.Id,
            JobPostId = application.JobPostId,
            JobTitle = job.Title,

            OrganizationName =
                job.Organization?.Name ??
                string.Empty,

            CandidateUserId =
                application.CandidateUserId,

            CandidateName = user.FullName,
            CoverLetter = application.CoverLetter,
            Status = application.Status.ToString(),
            MatchScore = application.MatchScore,
            AppliedAt = application.AppliedAt,
            UpdatedAt = application.UpdatedAt
        };

        return ApiResponse<JobApplicationResponse>.Succeeded(
            response,
            "Job application submitted successfully.");
    }

    public async Task<
        ApiResponse<List<JobApplicationResponse>>>
        GetCandidateApplicationsAsync(
            int candidateUserId)
    {
        User? user = await _userRepository.GetByIdAsync(
            candidateUserId);

        if (user is null || !user.IsActive)
        {
            return ApiResponse<
                List<JobApplicationResponse>>.Failed(
                    "User account was not found.");
        }

        if (user.Role != UserRole.Candidate)
        {
            return ApiResponse<
                List<JobApplicationResponse>>.Failed(
                    "Only candidates can view their applications.");
        }

        List<JobApplication> applications =
            await _applicationRepository
                .GetCandidateApplicationsAsync(
                    candidateUserId);

        List<JobApplicationResponse> response =
            applications
                .Select(CreateResponse)
                .ToList();

        return ApiResponse<
            List<JobApplicationResponse>>.Succeeded(
                response,
                $"{response.Count} application(s) found.");
    }

    public async Task<
        ApiResponse<List<JobApplicationResponse>>>
        GetStaffApplicationsAsync(
            int currentUserId)
    {
        User? user = await _userRepository.GetByIdAsync(
            currentUserId);

        if (user is null || !user.IsActive)
        {
            return ApiResponse<
                List<JobApplicationResponse>>.Failed(
                    "User account was not found.");
        }

        int? departmentId = null;

        if (user.Role == UserRole.Recruiter)
        {
            RecruiterProfile? profile =
                await _applicationRepository
                    .GetRecruiterProfileAsync(
                        currentUserId);

            departmentId = profile?.DepartmentId;
        }
        else if (user.Role == UserRole.HiringManager)
        {
            HiringManagerProfile? profile =
                await _applicationRepository
                    .GetHiringManagerProfileAsync(
                        currentUserId);

            departmentId = profile?.DepartmentId;
        }
        else
        {
            return ApiResponse<
                List<JobApplicationResponse>>.Failed(
                    "Only recruiters and hiring managers can view department applications.");
        }

        if (!departmentId.HasValue)
        {
            return ApiResponse<
                List<JobApplicationResponse>>.Failed(
                    "Your account is not assigned to a department.");
        }

        List<JobApplication> applications =
            await _applicationRepository
                .GetDepartmentApplicationsAsync(
                    departmentId.Value);

        List<JobApplicationResponse> response =
            applications
                .Select(CreateResponse)
                .ToList();

        return ApiResponse<
            List<JobApplicationResponse>>.Succeeded(
                response,
                $"{response.Count} application(s) found.");
    }

    public async Task<ApiResponse<JobApplicationResponse>>
        UpdateStatusAsync(
            int currentUserId,
            int applicationId,
            UpdateApplicationStatusRequest request)
    {
        User? user = await _userRepository.GetByIdAsync(
            currentUserId);

        if (user is null || !user.IsActive)
        {
            return ApiResponse<JobApplicationResponse>.Failed(
                "User account was not found.");
        }

        int? departmentId = null;

        if (user.Role == UserRole.Recruiter)
        {
            RecruiterProfile? profile =
                await _applicationRepository
                    .GetRecruiterProfileAsync(
                        currentUserId);

            departmentId = profile?.DepartmentId;

            bool recruiterStatusAllowed =
                request.Status ==
                    ApplicationStatus.UnderReview ||
                request.Status ==
                    ApplicationStatus.Shortlisted ||
                request.Status ==
                    ApplicationStatus.Rejected;

            if (!recruiterStatusAllowed)
            {
                return ApiResponse<
                    JobApplicationResponse>.Failed(
                        "Recruiters can only mark applications as under review, shortlisted, or rejected.");
            }
        }
        else if (user.Role == UserRole.HiringManager)
        {
            HiringManagerProfile? profile =
                await _applicationRepository
                    .GetHiringManagerProfileAsync(
                        currentUserId);

            departmentId = profile?.DepartmentId;

            bool managerStatusAllowed =
                request.Status ==
                    ApplicationStatus.InterviewScheduled ||
                request.Status ==
                    ApplicationStatus.Offered ||
                request.Status ==
                    ApplicationStatus.Rejected ||
                request.Status ==
                    ApplicationStatus.Hired;

            if (!managerStatusAllowed)
            {
                return ApiResponse<
                    JobApplicationResponse>.Failed(
                        "Hiring managers can only schedule interviews, make offers, reject candidates, or mark candidates as hired.");
            }
        }
        else
        {
            return ApiResponse<
                JobApplicationResponse>.Failed(
                    "Only recruiters and hiring managers can update application status.");
        }

        if (!departmentId.HasValue)
        {
            return ApiResponse<
                JobApplicationResponse>.Failed(
                    "Your account is not assigned to a department.");
        }

        JobApplication? application =
            await _applicationRepository.GetByIdAsync(
                applicationId);

        if (application is null)
        {
            return ApiResponse<
                JobApplicationResponse>.Failed(
                    "Job application was not found.");
        }

        if (application.JobPost?.DepartmentId !=
            departmentId.Value)
        {
            return ApiResponse<
                JobApplicationResponse>.Failed(
                    "You cannot manage applications outside your department.");
        }

        if (application.Status ==
            ApplicationStatus.Withdrawn)
        {
            return ApiResponse<
                JobApplicationResponse>.Failed(
                    "A withdrawn application cannot be updated.");
        }

        if (application.Status ==
            ApplicationStatus.Hired)
        {
            return ApiResponse<
                JobApplicationResponse>.Failed(
                    "A completed hiring decision cannot be changed.");
        }

        ApplicationStatus previousStatus =
            application.Status;

        application.Status = request.Status;
        application.UpdatedAt = DateTime.UtcNow;

        await _applicationRepository.SaveChangesAsync();

        await _auditLogService.LogAsync(
    AuditAction.Update,
            "Job Applications",
            "Application Status",
            application.Id.ToString(),
            $"Application status changed from '{previousStatus}' to '{request.Status}'.");

        if (previousStatus != request.Status)
        {
            try
            {
                User? candidate =
                    await _userRepository.GetByIdAsync(
                        application.CandidateUserId);

                if (candidate is not null &&
                    candidate.IsActive &&
                    !string.IsNullOrWhiteSpace(
                        candidate.Email))
                {
                    await SendApplicationStatusEmailAsync(
                        candidate,
                        application,
                        request.Status);
                }
            }
            catch
            {
                // Status update remains successful
                // even when email delivery fails.
            }
        }

        return ApiResponse<JobApplicationResponse>.Succeeded(
            CreateResponse(application),
            "Application status updated successfully.");
    }

    public async Task<ApiResponse<JobApplicationResponse>>
        WithdrawAsync(
            int candidateUserId,
            int applicationId)
    {
        User? user = await _userRepository.GetByIdAsync(
            candidateUserId);

        if (user is null || !user.IsActive)
        {
            return ApiResponse<JobApplicationResponse>.Failed(
                "User account was not found.");
        }

        if (user.Role != UserRole.Candidate)
        {
            return ApiResponse<JobApplicationResponse>.Failed(
                "Only candidates can withdraw applications.");
        }

        JobApplication? application =
            await _applicationRepository.GetByIdAsync(
                applicationId);

        if (application is null)
        {
            return ApiResponse<JobApplicationResponse>.Failed(
                "Job application was not found.");
        }

        if (application.CandidateUserId !=
            candidateUserId)
        {
            return ApiResponse<JobApplicationResponse>.Failed(
                "You can only withdraw your own applications.");
        }

        if (application.Status ==
            ApplicationStatus.Withdrawn)
        {
            return ApiResponse<JobApplicationResponse>.Failed(
                "This application has already been withdrawn.");
        }

        if (application.Status ==
                ApplicationStatus.Rejected ||
            application.Status ==
                ApplicationStatus.Hired)
        {
            return ApiResponse<JobApplicationResponse>.Failed(
                "This completed application cannot be withdrawn.");
        }

        application.Status =
            ApplicationStatus.Withdrawn;

        application.UpdatedAt = DateTime.UtcNow;

        await _applicationRepository.SaveChangesAsync();

        await _auditLogService.LogAsync(
            AuditAction.Update,
            "Job Applications",
            "Application",
            application.Id.ToString(),
            $"Candidate withdrew application for '{application.JobPost?.Title}'.");

        return ApiResponse<JobApplicationResponse>.Succeeded(
            CreateResponse(application),
            "Application withdrawn successfully.");
    }

    private async Task SendApplicationSubmittedEmailAsync(
        User candidate,
        JobPost job,
        JobApplication application)
    {
        string candidateName =
            WebUtility.HtmlEncode(candidate.FullName);

        string jobTitle =
            WebUtility.HtmlEncode(job.Title);

        string organizationName =
            WebUtility.HtmlEncode(
                job.Organization?.Name ??
                "the organization");

        string submittedDate =
            application.AppliedAt.ToString(
                "dd MMMM yyyy 'at' HH:mm 'UTC'");

        string subject =
            $"Application received - {job.Title}";

        string htmlBody =
            BuildEmailTemplate(
                candidateName,
                "Application submitted successfully",
                $"""
                Thank you for applying through
                <strong>ApexHire</strong>. Your application
                has been received successfully.
                """,
                jobTitle,
                organizationName,
                "Submitted",
                submittedDate);

        await _emailService.SendEmailAsync(
            candidate.Email,
            subject,
            htmlBody);
    }

    private async Task SendApplicationStatusEmailAsync(
        User candidate,
        JobApplication application,
        ApplicationStatus status)
    {
        string candidateName =
            WebUtility.HtmlEncode(candidate.FullName);

        string rawJobTitle =
            application.JobPost?.Title ??
            "the advertised position";

        string jobTitle =
            WebUtility.HtmlEncode(rawJobTitle);

        string organizationName =
            WebUtility.HtmlEncode(
                application.JobPost?.Organization?.Name ??
                "the organization");

        string subject;
        string heading;
        string message;
        string statusLabel;

        switch (status)
        {
            case ApplicationStatus.UnderReview:
                subject =
                    $"Your application is under review - {rawJobTitle}";

                heading =
                    "Your application is under review";

                statusLabel =
                    "Under Review";

                message =
                    $"""
                    Our recruitment team is currently
                    reviewing your application for the
                    <strong>{jobTitle}</strong> position at
                    <strong>{organizationName}</strong>.
                    We will notify you when there is another
                    update.
                    """;

                break;

            case ApplicationStatus.Shortlisted:
                subject =
                    $"You have been shortlisted - {rawJobTitle}";

                heading =
                    "Congratulations, you have been shortlisted";

                statusLabel =
                    "Shortlisted";

                message =
                    $"""
                    We are pleased to inform you that you
                    have been shortlisted for the
                    <strong>{jobTitle}</strong> position at
                    <strong>{organizationName}</strong>.
                    Our recruitment team will contact you
                    with information about the next stage.
                    """;

                break;

            case ApplicationStatus.InterviewScheduled:
                subject =
                    $"Interview stage update - {rawJobTitle}";

                heading =
                    "Your application has progressed";

                statusLabel =
                    "Interview Scheduled";

                message =
                    $"""
                    Your application for the
                    <strong>{jobTitle}</strong> position at
                    <strong>{organizationName}</strong> has
                    progressed to the interview stage.
                    Please check your ApexHire account for
                    the interview details.
                    """;

                break;

            case ApplicationStatus.Offered:
                subject =
                    $"Congratulations - offer update for {rawJobTitle}";

                heading =
                    "Congratulations";

                statusLabel =
                    "Offered";

                message =
                    $"""
                    We are delighted to inform you that your
                    application for the
                    <strong>{jobTitle}</strong> position at
                    <strong>{organizationName}</strong> has
                    been successful and has progressed to
                    the offer stage. The recruitment team
                    will contact you with the next steps.
                    """;

                break;

            case ApplicationStatus.Rejected:
                subject =
                    $"Update on your application - {rawJobTitle}";

                heading =
                    "Application status update";

                statusLabel =
                    "Not Selected";

                message =
                    $"""
                    Thank you for your interest in the
                    <strong>{jobTitle}</strong> position at
                    <strong>{organizationName}</strong>.
                    After careful consideration, the
                    recruitment team has decided to proceed
                    with other candidates whose experience
                    more closely matches the current
                    requirements. We appreciate the time
                    and effort you invested and encourage
                    you to apply for future opportunities
                    on ApexHire.
                    """;

                break;

            case ApplicationStatus.Hired:
                subject =
                    $"Welcome to the team - {rawJobTitle}";

                heading =
                    "Welcome to the team";

                statusLabel =
                    "Hired";

                message =
                    $"""
                    We are pleased to confirm that you have
                    successfully completed the recruitment
                    process for the
                    <strong>{jobTitle}</strong> position at
                    <strong>{organizationName}</strong>.
                    Congratulations on your achievement.
                    The recruitment team will contact you
                    with onboarding information and the
                    next steps.
                    """;

                break;

            default:
                return;
        }

        string htmlBody =
            BuildEmailTemplate(
                candidateName,
                heading,
                message,
                jobTitle,
                organizationName,
                statusLabel,
                DateTime.UtcNow.ToString(
                    "dd MMMM yyyy 'at' HH:mm 'UTC'"));

        await _emailService.SendEmailAsync(
            candidate.Email,
            subject,
            htmlBody);
    }

    private static string BuildEmailTemplate(
        string candidateName,
        string heading,
        string message,
        string jobTitle,
        string organizationName,
        string statusLabel,
        string updatedDate)
    {
        return
            $"""
            <!DOCTYPE html>
            <html>
            <body style="
                margin:0;
                padding:0;
                background-color:#f4f6f8;
                font-family:Arial,Helvetica,sans-serif;
                color:#1f2937;">

                <table
                    role="presentation"
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    style="
                        background-color:#f4f6f8;
                        padding:32px 16px;">

                    <tr>
                        <td align="center">
                            <table
                                role="presentation"
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                style="
                                    max-width:620px;
                                    background-color:#ffffff;
                                    border-radius:12px;
                                    overflow:hidden;
                                    box-shadow:
                                        0 4px 14px
                                        rgba(0,0,0,0.08);">

                                <tr>
                                    <td style="
                                        padding:24px 32px;
                                        background-color:#0f4c81;
                                        color:#ffffff;">

                                        <h1 style="
                                            margin:0;
                                            font-size:26px;">
                                            ApexHire
                                        </h1>

                                        <p style="
                                            margin:6px 0 0;
                                            font-size:14px;">
                                            Recruitment made simple
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:32px;">
                                        <h2 style="
                                            margin:0 0 20px;
                                            color:#0f4c81;
                                            font-size:22px;">
                                            {heading}
                                        </h2>

                                        <p style="
                                            margin:0 0 16px;
                                            line-height:1.6;">
                                            Dear
                                            <strong>
                                                {candidateName}
                                            </strong>,
                                        </p>

                                        <p style="
                                            margin:0 0 24px;
                                            line-height:1.7;">
                                            {message}
                                        </p>

                                        <table
                                            role="presentation"
                                            width="100%"
                                            cellspacing="0"
                                            cellpadding="0"
                                            style="
                                                border-collapse:
                                                collapse;
                                                margin-bottom:24px;">

                                            <tr>
                                                <td style="
                                                    width:35%;
                                                    padding:12px;
                                                    border:1px solid
                                                    #e5e7eb;
                                                    background-color:
                                                    #f9fafb;">
                                                    <strong>
                                                        Position
                                                    </strong>
                                                </td>

                                                <td style="
                                                    padding:12px;
                                                    border:1px solid
                                                    #e5e7eb;">
                                                    {jobTitle}
                                                </td>
                                            </tr>

                                            <tr>
                                                <td style="
                                                    padding:12px;
                                                    border:1px solid
                                                    #e5e7eb;
                                                    background-color:
                                                    #f9fafb;">
                                                    <strong>
                                                        Organization
                                                    </strong>
                                                </td>

                                                <td style="
                                                    padding:12px;
                                                    border:1px solid
                                                    #e5e7eb;">
                                                    {organizationName}
                                                </td>
                                            </tr>

                                            <tr>
                                                <td style="
                                                    padding:12px;
                                                    border:1px solid
                                                    #e5e7eb;
                                                    background-color:
                                                    #f9fafb;">
                                                    <strong>
                                                        Status
                                                    </strong>
                                                </td>

                                                <td style="
                                                    padding:12px;
                                                    border:1px solid
                                                    #e5e7eb;">
                                                    {statusLabel}
                                                </td>
                                            </tr>

                                            <tr>
                                                <td style="
                                                    padding:12px;
                                                    border:1px solid
                                                    #e5e7eb;
                                                    background-color:
                                                    #f9fafb;">
                                                    <strong>
                                                        Updated
                                                    </strong>
                                                </td>

                                                <td style="
                                                    padding:12px;
                                                    border:1px solid
                                                    #e5e7eb;">
                                                    {updatedDate}
                                                </td>
                                            </tr>
                                        </table>

                                        <p style="
                                            margin:0;
                                            line-height:1.6;">
                                            Kind regards,<br>
                                            <strong>
                                                ApexHire Recruitment
                                                Team
                                            </strong>
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="
                                        padding:18px 32px;
                                        background-color:#f9fafb;
                                        border-top:1px solid #e5e7eb;
                                        color:#6b7280;
                                        font-size:12px;
                                        text-align:center;">
                                        This is an automated
                                        notification from ApexHire.
                                        Please do not reply.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """;
    }

    private static JobApplicationResponse CreateResponse(
        JobApplication application)
    {
        return new JobApplicationResponse
        {
            Id = application.Id,
            JobPostId = application.JobPostId,

            JobTitle =
                application.JobPost?.Title ??
                string.Empty,

            OrganizationName =
                application.JobPost?.Organization?.Name ??
                string.Empty,

            CandidateUserId =
                application.CandidateUserId,

            CandidateName =
                application.CandidateUser?.FullName ??
                string.Empty,

            CoverLetter = application.CoverLetter,
            Status = application.Status.ToString(),
            MatchScore = application.MatchScore,
            AppliedAt = application.AppliedAt,
            UpdatedAt = application.UpdatedAt
        };
    }
}