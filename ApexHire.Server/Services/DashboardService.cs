using ApexHire.Server.Data;
using ApexHire.Server.DTOs.Dashboard;
using ApexHire.Server.Enums;
using ApexHire.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApexHire.Server.Services;

public class DashboardService : IDashboardService
{
    private readonly ApplicationDbContext _context;

    public DashboardService(
        ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardResponse>
        GetRecruiterDashboardAsync(
            int recruiterUserId)
    {
        DashboardResponse response = new();

        var recruiter =
            await _context.RecruiterProfiles
                .AsNoTracking()
                .FirstOrDefaultAsync(r =>
                    r.UserId == recruiterUserId);

        if (recruiter is null)
        {
            return response;
        }

        var jobs = _context.JobPosts
            .Where(job =>
                job.OrganizationId ==
                    recruiter.OrganizationId &&
                job.DepartmentId ==
                    recruiter.DepartmentId);

        var applications =
            _context.JobApplications
                .Include(a => a.JobPost)
                .Include(a => a.CandidateUser)
                .Where(a =>
                    a.JobPost.OrganizationId ==
                        recruiter.OrganizationId &&
                    a.JobPost.DepartmentId ==
                        recruiter.DepartmentId);

        response.Summary.TotalJobs =
            await jobs.CountAsync();

        response.Summary.ActiveJobs =
            await jobs.CountAsync(job =>
                job.Status ==
                JobStatus.Published);

        response.Summary.TotalApplications =
            await applications.CountAsync();

        response.Summary.ApplicationsToday =
            await applications.CountAsync(a =>
                a.AppliedAt.Date ==
                DateTime.UtcNow.Date);

        response.Summary.PendingApplications =
            await applications.CountAsync(a =>
                a.Status ==
                    ApplicationStatus.Submitted ||
                a.Status ==
                    ApplicationStatus.UnderReview);

        response.Summary.ShortlistedCandidates =
            await applications.CountAsync(a =>
                a.Status ==
                ApplicationStatus.Shortlisted);

        response.Summary.HiredCandidates =
            await applications.CountAsync(a =>
                a.Status ==
                ApplicationStatus.Hired);

        response.ApplicationStatuses =
            await applications
                .GroupBy(a => a.Status)
                .Select(group =>
                    new DashboardStatusItemDto
                    {
                        Status =
                            group.Key.ToString(),

                        Count =
                            group.Count()
                    })
                .OrderBy(item => item.Status)
                .ToListAsync();

        response.RecentApplications =
            await applications
                .OrderByDescending(a =>
                    a.AppliedAt)
                .Take(10)
                .Select(a =>
                    new RecentApplicationDto
                    {
                        ApplicationId =
                            a.Id,

                        CandidateName =
                            a.CandidateUser
                                .FullName,

                        JobTitle =
                            a.JobPost
                                .Title,

                        Status =
                            a.Status
                                .ToString(),

                        MatchScore =
                            a.MatchScore,

                        AppliedAt =
                            a.AppliedAt
                    })
                .ToListAsync();

        return response;
    }
    public async Task<DashboardResponse>
    GetHiringManagerDashboardAsync(
        int hiringManagerUserId)
    {
        DashboardResponse response = new();

        var manager =
            await _context.HiringManagerProfiles
                .AsNoTracking()
                .FirstOrDefaultAsync(profile =>
                    profile.UserId == hiringManagerUserId);

        if (manager is null)
        {
            return response;
        }

        var interviews =
            _context.Interviews
                .Include(interview => interview.JobApplication)
                    .ThenInclude(application => application.JobPost)
                .Include(interview => interview.JobApplication)
                    .ThenInclude(application => application.CandidateUser)
                .Where(interview =>
                    interview.JobApplication.JobPost.OrganizationId ==
                        manager.OrganizationId &&
                    interview.JobApplication.JobPost.DepartmentId ==
                        manager.DepartmentId);

        response.Summary.TotalInterviews =
            await interviews.CountAsync();

        response.Summary.InterviewsToday =
            await interviews.CountAsync(interview =>
                interview.ScheduledAt.Date ==
                DateTime.UtcNow.Date);

        response.Summary.UpcomingInterviews =
            await interviews.CountAsync(interview =>
                interview.ScheduledAt >= DateTime.UtcNow &&
                (interview.Status == InterviewStatus.Scheduled ||
                 interview.Status == InterviewStatus.Rescheduled));

        response.Summary.CompletedInterviews =
            await interviews.CountAsync(interview =>
                interview.Status ==
                InterviewStatus.Completed);

        response.Summary.CancelledInterviews =
            await interviews.CountAsync(interview =>
                interview.Status ==
                InterviewStatus.Cancelled);

        response.InterviewStatuses =
            await interviews
                .GroupBy(interview => interview.Status)
                .Select(group =>
                    new DashboardStatusItemDto
                    {
                        Status = group.Key.ToString(),
                        Count = group.Count()
                    })
                .OrderBy(item => item.Status)
                .ToListAsync();

        response.UpcomingInterviews =
            await interviews
                .Where(interview =>
                    interview.ScheduledAt >= DateTime.UtcNow &&
                    (interview.Status == InterviewStatus.Scheduled ||
                     interview.Status == InterviewStatus.Rescheduled))
                .OrderBy(interview =>
                    interview.ScheduledAt)
                .Take(10)
                .Select(interview =>
                    new UpcomingInterviewDto
                    {
                        InterviewId =
                            interview.Id,

                        CandidateName =
                            interview.JobApplication
                                .CandidateUser
                                .FullName,

                        JobTitle =
                            interview.JobApplication
                                .JobPost
                                .Title,

                        ScheduledAt =
                            interview.ScheduledAt,

                        DurationMinutes =
                            interview.DurationMinutes,

                        Location =
                            interview.Location,

                        MeetingUrl =
                            interview.MeetingUrl,

                        Status =
                            interview.Status
                                .ToString()
                    })
                .ToListAsync();

        return response;
    }
    public async Task<DashboardResponse>
    GetAdminDashboardAsync()
    {
        DashboardResponse response = new();

        response.Summary.TotalUsers =
            await _context.Users.CountAsync();

        response.Summary.ActiveUsers =
            await _context.Users.CountAsync(user =>
                user.IsActive);

        response.Summary.Candidates =
            await _context.Users.CountAsync(user =>
                user.Role == UserRole.Candidate);

        response.Summary.Recruiters =
            await _context.Users.CountAsync(user =>
                user.Role == UserRole.Recruiter);

        response.Summary.HiringManagers =
            await _context.Users.CountAsync(user =>
                user.Role == UserRole.HiringManager);

        response.Summary.Administrators =
            await _context.Users.CountAsync(user =>
                user.Role == UserRole.Admin);

        response.Summary.Organizations =
            await _context.Organizations.CountAsync();

        response.Summary.Departments =
            await _context.Departments.CountAsync();

        response.Summary.TotalJobs =
            await _context.JobPosts.CountAsync();

        response.Summary.ActiveJobs =
            await _context.JobPosts.CountAsync(job =>
                job.Status == JobStatus.Published);

        response.Summary.TotalApplications =
            await _context.JobApplications.CountAsync();

        response.Summary.HiredCandidates =
            await _context.JobApplications.CountAsync(application =>
                application.Status == ApplicationStatus.Hired);

        response.Summary.TotalInterviews =
            await _context.Interviews.CountAsync();

        response.Summary.CompletedInterviews =
            await _context.Interviews.CountAsync(interview =>
                interview.Status == InterviewStatus.Completed);

        response.Summary.CancelledInterviews =
            await _context.Interviews.CountAsync(interview =>
                interview.Status == InterviewStatus.Cancelled);

        response.ApplicationStatuses =
            await _context.JobApplications
                .GroupBy(application => application.Status)
                .Select(group =>
                    new DashboardStatusItemDto
                    {
                        Status = group.Key.ToString(),
                        Count = group.Count()
                    })
                .OrderBy(item => item.Status)
                .ToListAsync();

        response.InterviewStatuses =
            await _context.Interviews
                .GroupBy(interview => interview.Status)
                .Select(group =>
                    new DashboardStatusItemDto
                    {
                        Status = group.Key.ToString(),
                        Count = group.Count()
                    })
                .OrderBy(item => item.Status)
                .ToListAsync();

        response.RecentApplications =
            await _context.JobApplications
                .Include(application => application.JobPost)
                .Include(application => application.CandidateUser)
                .OrderByDescending(application =>
                    application.AppliedAt)
                .Take(10)
                .Select(application =>
                    new RecentApplicationDto
                    {
                        ApplicationId = application.Id,
                        CandidateName = application.CandidateUser.FullName,
                        JobTitle = application.JobPost.Title,
                        Status = application.Status.ToString(),
                        MatchScore = application.MatchScore,
                        AppliedAt = application.AppliedAt
                    })
                .ToListAsync();

        response.UpcomingInterviews =
            await _context.Interviews
                .Include(interview => interview.JobApplication)
                    .ThenInclude(application => application.JobPost)
                .Include(interview => interview.JobApplication)
                    .ThenInclude(application => application.CandidateUser)
                .Where(interview =>
                    interview.ScheduledAt >= DateTime.UtcNow &&
                    (interview.Status == InterviewStatus.Scheduled ||
                     interview.Status == InterviewStatus.Rescheduled))
                .OrderBy(interview => interview.ScheduledAt)
                .Take(10)
                .Select(interview =>
                    new UpcomingInterviewDto
                    {
                        InterviewId = interview.Id,
                        CandidateName = interview.JobApplication.CandidateUser.FullName,
                        JobTitle = interview.JobApplication.JobPost.Title,
                        ScheduledAt = interview.ScheduledAt,
                        DurationMinutes = interview.DurationMinutes,
                        Location = interview.Location,
                        MeetingUrl = interview.MeetingUrl,
                        Status = interview.Status.ToString()
                    })
                .ToListAsync();

        return response;
    }
}