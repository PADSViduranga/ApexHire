using ApexHire.Server.Data;
using ApexHire.Server.Enums;
using ApexHire.Server.Interfaces;
using ApexHire.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ApexHire.Server.Repositories;

public class InterviewRepository : IInterviewRepository
{
    private readonly ApplicationDbContext _context;

    public InterviewRepository(
        ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<JobApplication?>
        GetApplicationAsync(int applicationId)
    {
        return await _context.JobApplications
            .Include(application =>
                application.JobPost)
            .ThenInclude(job =>
                job.Organization)
            .Include(application =>
                application.JobPost)
            .ThenInclude(job =>
                job.Department)
            .Include(application =>
                application.CandidateUser)
            .FirstOrDefaultAsync(application =>
                application.Id == applicationId);
    }

    public async Task<Interview?> GetByIdAsync(
        int interviewId)
    {
        return await _context.Interviews
            .Include(interview =>
                interview.JobApplication)
            .ThenInclude(application =>
                application.JobPost)
            .Include(interview =>
                interview.JobApplication)
            .ThenInclude(application =>
                application.CandidateUser)
            .Include(interview =>
                interview.ScheduledByUser)
            .FirstOrDefaultAsync(interview =>
                interview.Id == interviewId);
    }

    public async Task<Interview?>
        GetActiveForApplicationAsync(
            int applicationId)
    {
        return await _context.Interviews
            .FirstOrDefaultAsync(interview =>
                interview.JobApplicationId ==
                    applicationId &&
                (
                    interview.Status ==
                        InterviewStatus.Scheduled ||
                    interview.Status ==
                        InterviewStatus.Rescheduled
                ));
    }

    public async Task<HiringManagerProfile?>
        GetHiringManagerProfileAsync(
            int userId)
    {
        return await _context.HiringManagerProfiles
            .AsNoTracking()
            .FirstOrDefaultAsync(profile =>
                profile.UserId == userId);
    }

    public async Task<List<Interview>>
        GetCandidateInterviewsAsync(
            int candidateUserId)
    {
        return await _context.Interviews
            .AsNoTracking()
            .Include(interview =>
                interview.JobApplication)
            .ThenInclude(application =>
                application.JobPost)
            .Include(interview =>
                interview.JobApplication)
            .ThenInclude(application =>
                application.CandidateUser)
            .Include(interview =>
                interview.ScheduledByUser)
            .Where(interview =>
                interview.JobApplication
                    .CandidateUserId ==
                    candidateUserId)
            .OrderBy(interview =>
                interview.ScheduledAt)
            .ToListAsync();
    }

    public async Task<List<Interview>>
        GetDepartmentInterviewsAsync(
            int departmentId)
    {
        return await _context.Interviews
            .AsNoTracking()
            .Include(interview =>
                interview.JobApplication)
            .ThenInclude(application =>
                application.JobPost)
            .Include(interview =>
                interview.JobApplication)
            .ThenInclude(application =>
                application.CandidateUser)
            .Include(interview =>
                interview.ScheduledByUser)
            .Where(interview =>
                interview.JobApplication.JobPost
                    .DepartmentId ==
                    departmentId)
            .OrderBy(interview =>
                interview.ScheduledAt)
            .ToListAsync();
    }

    public async Task AddAsync(
        Interview interview)
    {
        await _context.Interviews.AddAsync(
            interview);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}