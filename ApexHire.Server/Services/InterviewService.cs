using ApexHire.Api.Models.Enums;
using ApexHire.Api.Services.Interfaces;
using ApexHire.Server.DTOs;
using ApexHire.Server.Enums;
using ApexHire.Server.Interfaces;
using ApexHire.Server.Models;
using System.Net;

namespace ApexHire.Server.Services;

public class InterviewService : IInterviewService
{
    private readonly IInterviewRepository
        _interviewRepository;

    private readonly IUserRepository
        _userRepository;

    private readonly IEmailService
        _emailService;
    private readonly IAuditLogService _auditLogService;

    public InterviewService(
        IInterviewRepository interviewRepository,
        IUserRepository userRepository,
        IEmailService emailService,
        IAuditLogService auditLogService)
    {
        _interviewRepository = interviewRepository;
        _userRepository = userRepository;
        _emailService = emailService;
        _auditLogService = auditLogService;
    }

    public async Task<ApiResponse<InterviewResponse>>
        ScheduleAsync(
            int currentUserId,
            ScheduleInterviewRequest request)
    {
        User? currentUser =
            await _userRepository.GetByIdAsync(
                currentUserId);

        if (currentUser is null ||
            !currentUser.IsActive)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "User account was not found.");
        }

        if (currentUser.Role !=
            UserRole.HiringManager)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "Only hiring managers can schedule interviews.");
        }

        HiringManagerProfile? managerProfile =
            await _interviewRepository
                .GetHiringManagerProfileAsync(
                    currentUserId);

        if (managerProfile is null)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "The hiring manager is not assigned to a department.");
        }

        JobApplication? application =
            await _interviewRepository
                .GetApplicationAsync(
                    request.JobApplicationId);

        if (application is null)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "Job application was not found.");
        }

        if (application.JobPost?.DepartmentId !=
            managerProfile.DepartmentId)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "You cannot schedule interviews outside your department.");
        }

        if (application.Status ==
                ApplicationStatus.Withdrawn ||
            application.Status ==
                ApplicationStatus.Rejected ||
            application.Status ==
                ApplicationStatus.Hired)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "An interview cannot be scheduled for this application.");
        }

        if (request.ScheduledAt <= DateTime.UtcNow)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "The interview date and time must be in the future.");
        }

        if (request.DurationMinutes <= 0)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "The interview duration must be greater than zero.");
        }

        if (string.IsNullOrWhiteSpace(
                request.Location) &&
            string.IsNullOrWhiteSpace(
                request.MeetingUrl))
        {
            return ApiResponse<InterviewResponse>.Failed(
                "Provide either an interview location or a meeting URL.");
        }

        Interview? activeInterview =
            await _interviewRepository
                .GetActiveForApplicationAsync(
                    request.JobApplicationId);

        if (activeInterview is not null)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "This application already has an active interview.");
        }

        var interview = new Interview
        {
            JobApplicationId =
                request.JobApplicationId,

            ScheduledByUserId =
                currentUserId,

            ScheduledAt =
                request.ScheduledAt,

            DurationMinutes =
                request.DurationMinutes,

            Location =
                CleanOptional(request.Location),

            MeetingUrl =
                CleanOptional(request.MeetingUrl),

            Instructions =
                CleanOptional(request.Instructions),

            Status =
                InterviewStatus.Scheduled,

            CreatedAt =
                DateTime.UtcNow,

            JobApplication =
                application,

            ScheduledByUser =
                currentUser
        };

        application.Status =
            ApplicationStatus.InterviewScheduled;

        application.UpdatedAt =
            DateTime.UtcNow;

        await _interviewRepository.AddAsync(
            interview);

        await _interviewRepository
            .SaveChangesAsync();

        await _auditLogService.LogAsync(
            AuditAction.Create,
            "Interviews",
            "Interview",
            interview.Id.ToString(),
            $"Scheduled interview for '{application.JobPost?.Title}'.");

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
                await SendInterviewScheduledEmailAsync(
                    candidate,
                    application,
                    interview);
            }
        }
        catch
        {
            // Interview scheduling remains successful
            // even when email delivery fails.
        }

        return ApiResponse<InterviewResponse>.Succeeded(
            CreateResponse(interview),
            "Interview scheduled successfully.");
    }

    public async Task<
        ApiResponse<List<InterviewResponse>>>
        GetCandidateInterviewsAsync(
            int candidateUserId)
    {
        User? user =
            await _userRepository.GetByIdAsync(
                candidateUserId);

        if (user is null || !user.IsActive)
        {
            return ApiResponse<
                List<InterviewResponse>>.Failed(
                    "User account was not found.");
        }

        if (user.Role != UserRole.Candidate)
        {
            return ApiResponse<
                List<InterviewResponse>>.Failed(
                    "Only candidates can view their interviews.");
        }

        List<Interview> interviews =
            await _interviewRepository
                .GetCandidateInterviewsAsync(
                    candidateUserId);

        List<InterviewResponse> response =
            interviews
                .Select(CreateResponse)
                .ToList();

        return ApiResponse<
            List<InterviewResponse>>.Succeeded(
                response,
                $"{response.Count} interview(s) found.");
    }

    public async Task<
        ApiResponse<List<InterviewResponse>>>
        GetDepartmentInterviewsAsync(
            int currentUserId)
    {
        User? user =
            await _userRepository.GetByIdAsync(
                currentUserId);

        if (user is null || !user.IsActive)
        {
            return ApiResponse<
                List<InterviewResponse>>.Failed(
                    "User account was not found.");
        }

        if (user.Role !=
            UserRole.HiringManager)
        {
            return ApiResponse<
                List<InterviewResponse>>.Failed(
                    "Only hiring managers can manage interviews.");
        }

        HiringManagerProfile? managerProfile =
            await _interviewRepository
                .GetHiringManagerProfileAsync(
                    currentUserId);

        if (managerProfile is null)
        {
            return ApiResponse<
                List<InterviewResponse>>.Failed(
                    "The hiring manager is not assigned to a department.");
        }

        List<Interview> interviews =
            await _interviewRepository
                .GetDepartmentInterviewsAsync(
                    managerProfile.DepartmentId);

        List<InterviewResponse> response =
            interviews
                .Select(CreateResponse)
                .ToList();

        return ApiResponse<
            List<InterviewResponse>>.Succeeded(
                response,
                $"{response.Count} interview(s) found.");
    }
    public async Task<ApiResponse<InterviewResponse>>
    UpdateStatusAsync(
        int currentUserId,
        int interviewId,
        UpdateInterviewStatusRequest request)
    {
        User? user =
            await _userRepository.GetByIdAsync(
                currentUserId);

        if (user is null || !user.IsActive)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "User account was not found.");
        }

        if (user.Role !=
            UserRole.HiringManager)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "Only hiring managers can update interviews.");
        }

        HiringManagerProfile? managerProfile =
            await _interviewRepository
                .GetHiringManagerProfileAsync(
                    currentUserId);

        if (managerProfile is null)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "The hiring manager is not assigned to a department.");
        }

        Interview? interview =
            await _interviewRepository.GetByIdAsync(
                interviewId);

        if (interview is null)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "Interview was not found.");
        }

        if (interview.JobApplication?.JobPost
                ?.DepartmentId !=
            managerProfile.DepartmentId)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "You cannot manage interviews outside your department.");
        }

        bool statusAllowed =
            request.Status ==
                InterviewStatus.Completed ||
            request.Status ==
                InterviewStatus.Cancelled;

        if (!statusAllowed)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "The interview can only be marked as completed or cancelled.");
        }

        if (interview.Status ==
                InterviewStatus.Completed ||
            interview.Status ==
                InterviewStatus.Cancelled)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "This interview has already been completed or cancelled.");
        }

        InterviewStatus previousStatus =
            interview.Status;

        interview.Status =
            request.Status;

        interview.UpdatedAt =
            DateTime.UtcNow;

        await _interviewRepository
            .SaveChangesAsync();
        await _auditLogService.LogAsync(
            AuditAction.Update,
            "Interviews",
            "Interview Status",
            interview.Id.ToString(),
            $"Interview status changed from '{previousStatus}' to '{request.Status}'.");

        if (previousStatus != request.Status &&
            request.Status ==
                InterviewStatus.Cancelled)
        {
            try
            {
                JobApplication? application =
                    interview.JobApplication;

                if (application is not null)
                {
                    User? candidate =
                        await _userRepository.GetByIdAsync(
                            application.CandidateUserId);

                    if (candidate is not null &&
                        candidate.IsActive &&
                        !string.IsNullOrWhiteSpace(
                            candidate.Email))
                    {
                        await SendInterviewCancelledEmailAsync(
                            candidate,
                            application,
                            interview);
                    }
                }
            }
            catch
            {
                // Interview status update remains
                // successful when email delivery fails.
            }
        }

        return ApiResponse<InterviewResponse>.Succeeded(
            CreateResponse(interview),
            "Interview status updated successfully.");
    }


    public async Task<ApiResponse<InterviewResponse>>
        RescheduleAsync(
            int currentUserId,
            int interviewId,
            RescheduleInterviewRequest request)
    {
        User? user =
            await _userRepository.GetByIdAsync(
                currentUserId);

        if (user is null || !user.IsActive)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "User account was not found.");
        }

        if (user.Role != UserRole.HiringManager)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "Only hiring managers can reschedule interviews.");
        }

        HiringManagerProfile? managerProfile =
            await _interviewRepository
                .GetHiringManagerProfileAsync(
                    currentUserId);

        if (managerProfile is null)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "The hiring manager is not assigned to a department.");
        }

        Interview? interview =
            await _interviewRepository.GetByIdAsync(
                interviewId);

        if (interview is null)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "Interview was not found.");
        }

        if (interview.JobApplication?.JobPost
                ?.DepartmentId !=
            managerProfile.DepartmentId)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "You cannot manage interviews outside your department.");
        }

        if (interview.Status ==
                InterviewStatus.Completed ||
            interview.Status ==
                InterviewStatus.Cancelled)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "Completed or cancelled interviews cannot be rescheduled.");
        }

        if (request.ScheduledAt <= DateTime.UtcNow)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "The interview date and time must be in the future.");
        }

        if (request.DurationMinutes <= 0)
        {
            return ApiResponse<InterviewResponse>.Failed(
                "The interview duration must be greater than zero.");
        }

        if (string.IsNullOrWhiteSpace(
                request.Location) &&
            string.IsNullOrWhiteSpace(
                request.MeetingUrl))
        {
            return ApiResponse<InterviewResponse>.Failed(
                "Provide either an interview location or a meeting URL.");
        }

        interview.ScheduledAt =
            request.ScheduledAt;

        interview.DurationMinutes =
            request.DurationMinutes;

        interview.Location =
            CleanOptional(request.Location);

        interview.MeetingUrl =
            CleanOptional(request.MeetingUrl);

        interview.Instructions =
            CleanOptional(request.Instructions);

        interview.Status =
            InterviewStatus.Rescheduled;

        interview.UpdatedAt =
            DateTime.UtcNow;

        await _interviewRepository
            .SaveChangesAsync();

        await _auditLogService.LogAsync(
            AuditAction.Update,
            "Interviews",
            "Interview",
            interview.Id.ToString(),
            $"Interview rescheduled for '{interview.JobApplication?.JobPost?.Title}'.");

        try
        {
            JobApplication? application =
                interview.JobApplication;

            if (application is not null)
            {
                User? candidate =
                    await _userRepository.GetByIdAsync(
                        application.CandidateUserId);

                if (candidate is not null &&
                    candidate.IsActive &&
                    !string.IsNullOrWhiteSpace(
                        candidate.Email))
                {
                    await SendInterviewRescheduledEmailAsync(
                        candidate,
                        application,
                        interview);
                }
            }
        }
        catch
        {
            // Rescheduling remains successful
            // even when email delivery fails.
        }

        return ApiResponse<InterviewResponse>.Succeeded(
            CreateResponse(interview),
            "Interview rescheduled successfully.");
    }

    private async Task
        SendInterviewScheduledEmailAsync(
            User candidate,
            JobApplication application,
            Interview interview)
    {
        string candidateName =
            WebUtility.HtmlEncode(
                candidate.FullName);

        string rawJobTitle =
            application.JobPost?.Title ??
            "the advertised position";

        string jobTitle =
            WebUtility.HtmlEncode(
                rawJobTitle);

        string organizationName =
            WebUtility.HtmlEncode(
                application.JobPost
                    ?.Organization?.Name ??
                "the organization");

        string interviewDate =
            interview.ScheduledAt.ToString(
                "dddd, dd MMMM yyyy");

        string interviewTime =
            interview.ScheduledAt.ToString(
                "HH:mm 'UTC'");

        string duration =
            $"{interview.DurationMinutes} minutes";

        string location =
            WebUtility.HtmlEncode(
                interview.Location ??
                "Online interview");

        string meetingUrl =
            CleanOptional(interview.MeetingUrl) ??
            string.Empty;

        string instructions =
            WebUtility.HtmlEncode(
                interview.Instructions ??
                "No additional instructions were provided.");

        string subject =
            $"Interview scheduled - {rawJobTitle}";

        string htmlBody =
            BuildInterviewEmailTemplate(
                candidateName: candidateName,
                heading:
                    "Your interview has been scheduled",
                introduction:
                    $"""
                    Congratulations! Your application for
                    the <strong>{jobTitle}</strong>
                    position at
                    <strong>{organizationName}</strong>
                    has progressed to the interview stage.
                    Please review the interview details
                    below.
                    """,
                jobTitle: jobTitle,
                organizationName:
                    organizationName,
                statusLabel:
                    "Scheduled",
                interviewDate:
                    interviewDate,
                interviewTime:
                    interviewTime,
                duration:
                    duration,
                location:
                    location,
                meetingUrl:
                    meetingUrl,
                instructions:
                    instructions,
                closingMessage:
                    """
                    Please join or arrive at least
                    10 minutes before the scheduled time.
                    We wish you the very best for your
                    interview.
                    """);

        await _emailService.SendEmailAsync(
            candidate.Email,
            subject,
            htmlBody);
    }


    private async Task
        SendInterviewRescheduledEmailAsync(
            User candidate,
            JobApplication application,
            Interview interview)
    {
        string candidateName =
            WebUtility.HtmlEncode(
                candidate.FullName);

        string rawJobTitle =
            application.JobPost?.Title ??
            "the advertised position";

        string jobTitle =
            WebUtility.HtmlEncode(
                rawJobTitle);

        string organizationName =
            WebUtility.HtmlEncode(
                application.JobPost
                    ?.Organization?.Name ??
                "the organization");

        string interviewDate =
            interview.ScheduledAt.ToString(
                "dddd, dd MMMM yyyy");

        string interviewTime =
            interview.ScheduledAt.ToString(
                "HH:mm 'UTC'");

        string duration =
            $"{interview.DurationMinutes} minutes";

        string location =
            WebUtility.HtmlEncode(
                interview.Location ??
                "Online interview");

        string meetingUrl =
            CleanOptional(interview.MeetingUrl) ??
            string.Empty;

        string instructions =
            WebUtility.HtmlEncode(
                interview.Instructions ??
                "No additional instructions were provided.");

        string subject =
            $"Interview rescheduled - {rawJobTitle}";

        string htmlBody =
            BuildInterviewEmailTemplate(
                candidateName: candidateName,
                heading:
                    "Your interview has been rescheduled",
                introduction:
                    $"""
                    The interview for the
                    <strong>{jobTitle}</strong> position
                    at <strong>{organizationName}</strong>
                    has been rescheduled. Please review the
                    updated interview details below.
                    """,
                jobTitle:
                    jobTitle,
                organizationName:
                    organizationName,
                statusLabel:
                    "Rescheduled",
                interviewDate:
                    interviewDate,
                interviewTime:
                    interviewTime,
                duration:
                    duration,
                location:
                    location,
                meetingUrl:
                    meetingUrl,
                instructions:
                    instructions,
                closingMessage:
                    """
                    Please use these updated details instead
                    of the previous schedule. We apologize
                    for any inconvenience and look forward
                    to meeting you.
                    """);

        await _emailService.SendEmailAsync(
            candidate.Email,
            subject,
            htmlBody);
    }

    private async Task
        SendInterviewCancelledEmailAsync(
            User candidate,
            JobApplication application,
            Interview interview)
    {
        string candidateName =
            WebUtility.HtmlEncode(
                candidate.FullName);

        string rawJobTitle =
            application.JobPost?.Title ??
            "the advertised position";

        string jobTitle =
            WebUtility.HtmlEncode(
                rawJobTitle);

        string organizationName =
            WebUtility.HtmlEncode(
                application.JobPost
                    ?.Organization?.Name ??
                "the organization");

        string interviewDate =
            interview.ScheduledAt.ToString(
                "dddd, dd MMMM yyyy");

        string interviewTime =
            interview.ScheduledAt.ToString(
                "HH:mm 'UTC'");

        string duration =
            $"{interview.DurationMinutes} minutes";

        string location =
            WebUtility.HtmlEncode(
                interview.Location ??
                "Online interview");

        string meetingUrl =
            CleanOptional(interview.MeetingUrl) ??
            string.Empty;

        string instructions =
            WebUtility.HtmlEncode(
                interview.Instructions ??
                "No additional instructions were provided.");

        string subject =
            $"Interview cancelled - {rawJobTitle}";

        string htmlBody =
            BuildInterviewEmailTemplate(
                candidateName: candidateName,
                heading:
                    "Your interview has been cancelled",
                introduction:
                    $"""
                    We are writing to inform you that the
                    interview for the
                    <strong>{jobTitle}</strong> position
                    at <strong>{organizationName}</strong>
                    has been cancelled.
                    """,
                jobTitle:
                    jobTitle,
                organizationName:
                    organizationName,
                statusLabel:
                    "Cancelled",
                interviewDate:
                    interviewDate,
                interviewTime:
                    interviewTime,
                duration:
                    duration,
                location:
                    location,
                meetingUrl:
                    meetingUrl,
                instructions:
                    instructions,
                closingMessage:
                    """
                    We apologize for any inconvenience.
                    The recruitment team will contact you
                    if a new interview is arranged.
                    """);

        await _emailService.SendEmailAsync(
            candidate.Email,
            subject,
            htmlBody);
    }

    private static string BuildInterviewEmailTemplate(
        string candidateName,
        string heading,
        string introduction,
        string jobTitle,
        string organizationName,
        string statusLabel,
        string interviewDate,
        string interviewTime,
        string duration,
        string location,
        string meetingUrl,
        string instructions,
        string closingMessage)
    {
        string meetingSection =
            string.IsNullOrWhiteSpace(meetingUrl)
                ? string.Empty
                : $"""
                  <tr>
                      <td style="
                          padding:12px;
                          border:1px solid #e5e7eb;
                          background-color:#f9fafb;">
                          <strong>Meeting link</strong>
                      </td>

                      <td style="
                          padding:12px;
                          border:1px solid #e5e7eb;
                          word-break:break-all;">
                          <a
                              href="{WebUtility.HtmlEncode(meetingUrl)}"
                              style="
                                  color:#0f4c81;
                                  text-decoration:none;">
                              Join online interview
                          </a>
                      </td>
                  </tr>
                  """;
        return
    $"""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta
                    name="viewport"
                    content="width=device-width,
                    initial-scale=1.0">
            </head>

            <body style="
                margin:0;
                padding:0;
                background-color:#f4f6f8;
                font-family:
                    Arial,Helvetica,sans-serif;
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
                                    max-width:640px;
                                    background-color:#ffffff;
                                    border-radius:12px;
                                    overflow:hidden;
                                    box-shadow:
                                        0 4px 14px
                                        rgba(0,0,0,0.08);">

                                <tr>
                                    <td style="
                                        padding:26px 32px;
                                        background-color:#0f4c81;
                                        color:#ffffff;">

                                        <h1 style="
                                            margin:0;
                                            font-size:27px;">
                                            ApexHire
                                        </h1>

                                        <p style="
                                            margin:7px 0 0;
                                            font-size:14px;
                                            color:#e5eef6;">
                                            Recruitment made simple
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:32px;">
                                        <h2 style="
                                            margin:0 0 20px;
                                            color:#0f4c81;
                                            font-size:23px;
                                            line-height:1.3;">
                                            {heading}
                                        </h2>

                                        <p style="
                                            margin:0 0 16px;
                                            line-height:1.7;">
                                            Dear
                                            <strong>
                                                {candidateName}
                                            </strong>,
                                        </p>

                                        <p style="
                                            margin:0 0 24px;
                                            line-height:1.7;">
                                            {introduction}
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
                                                        Date
                                                    </strong>
                                                </td>

                                                <td style="
                                                    padding:12px;
                                                    border:1px solid
                                                        #e5e7eb;">
                                                    {interviewDate}
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
                                                        Time
                                                    </strong>
                                                </td>

                                                <td style="
                                                    padding:12px;
                                                    border:1px solid
                                                        #e5e7eb;">
                                                    {interviewTime}
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
                                                        Duration
                                                    </strong>
                                                </td>

                                                <td style="
                                                    padding:12px;
                                                    border:1px solid
                                                        #e5e7eb;">
                                                    {duration}
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
                                                        Location
                                                    </strong>
                                                </td>

                                                <td style="
                                                    padding:12px;
                                                    border:1px solid
                                                        #e5e7eb;">
                                                    {location}
                                                </td>
                                            </tr>

                                            {meetingSection}
                                        </table>

                                        <div style="
                                            margin-bottom:24px;
                                            padding:16px;
                                            background-color:#f9fafb;
                                            border-left:
                                                4px solid #0f4c81;
                                            border-radius:6px;">

                                            <p style="
                                                margin:0 0 6px;
                                                font-weight:bold;">
                                                Interview instructions
                                            </p>

                                            <p style="
                                                margin:0;
                                                line-height:1.7;">
                                                {instructions}
                                            </p>
                                        </div>

                                        <p style="
                                            margin:0 0 24px;
                                            line-height:1.7;">
                                            {closingMessage}
                                        </p>

                                        <p style="
                                            margin:0;
                                            line-height:1.7;">
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
                                        border-top:
                                            1px solid #e5e7eb;
                                        color:#6b7280;
                                        font-size:12px;
                                        text-align:center;
                                        line-height:1.5;">
                                        This is an automated
                                        notification from ApexHire.
                                        Please do not reply to this
                                        email.
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

    private static string? CleanOptional(
        string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? null
            : value.Trim();
    }

    private static InterviewResponse CreateResponse(
        Interview interview)
    {
        JobApplication? application =
            interview.JobApplication;

        return new InterviewResponse
        {
            Id =
                interview.Id,

            JobApplicationId =
                interview.JobApplicationId,

            JobPostId =
                application?.JobPostId ?? 0,

            JobTitle =
                application?.JobPost?.Title ??
                string.Empty,

            CandidateUserId =
                application?.CandidateUserId ?? 0,

            CandidateName =
                application?.CandidateUser
                    ?.FullName ??
                string.Empty,

            ScheduledAt =
                interview.ScheduledAt,

            DurationMinutes =
                interview.DurationMinutes,

            Location =
                interview.Location,

            MeetingUrl =
                interview.MeetingUrl,

            Instructions =
                interview.Instructions,

            Status =
                interview.Status.ToString(),

            ScheduledByUserId =
                interview.ScheduledByUserId,

            ScheduledByName =
                interview.ScheduledByUser
                    ?.FullName ??
                string.Empty,

            CreatedAt =
                interview.CreatedAt,

            UpdatedAt =
                interview.UpdatedAt
        };
    }
}