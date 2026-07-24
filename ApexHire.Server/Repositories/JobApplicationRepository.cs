using ApexHire.Server.Data;
using ApexHire.Server.Interfaces;
using ApexHire.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ApexHire.Server.Repositories;

public class JobApplicationRepository
    : IJobApplicationRepository
{
    private readonly ApplicationDbContext _context;

    public JobApplicationRepository(
        ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<JobPost?> GetJobAsync(
        int jobPostId)
    {
        return await _context.JobPosts
            .Include(job => job.Organization)
            .Include(job => job.Department)
            .FirstOrDefaultAsync(job =>
                job.Id == jobPostId);
    }

    public async Task<JobApplication?> GetExistingAsync(
        int jobPostId,
        int candidateUserId)
    {
        return await _context.JobApplications
            .FirstOrDefaultAsync(application =>
                application.JobPostId == jobPostId &&
                application.CandidateUserId ==
                    candidateUserId);
    }

    public async Task<JobApplication?> GetByIdAsync(
        int applicationId)
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

    public async Task<List<JobApplication>>
        GetCandidateApplicationsAsync(
            int candidateUserId)
    {
        return await _context.JobApplications
            .AsNoTracking()
            .Include(application =>
                application.JobPost)
            .ThenInclude(job =>
                job.Organization)
            .Include(application =>
                application.CandidateUser)
            .Where(application =>
                application.CandidateUserId ==
                    candidateUserId)
            .OrderByDescending(application =>
                application.AppliedAt)
            .ToListAsync();
    }

    public async Task<List<JobApplication>>
        GetDepartmentApplicationsAsync(
            int departmentId)
    {
        return await _context.JobApplications
            .AsNoTracking()
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
            .Where(application =>
                application.JobPost.DepartmentId ==
                    departmentId)
            .OrderByDescending(application =>
                application.AppliedAt)
            .ToListAsync();
    }

    public async Task<RecruiterProfile?>
        GetRecruiterProfileAsync(int userId)
    {
        return await _context.RecruiterProfiles
            .AsNoTracking()
            .FirstOrDefaultAsync(profile =>
                profile.UserId == userId);
    }

    public async Task<HiringManagerProfile?>
        GetHiringManagerProfileAsync(int userId)
    {
        return await _context.HiringManagerProfiles
            .AsNoTracking()
            .FirstOrDefaultAsync(profile =>
                profile.UserId == userId);
    }

    public async Task AddAsync(
        JobApplication application)
    {
        await _context.JobApplications.AddAsync(
            application);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}