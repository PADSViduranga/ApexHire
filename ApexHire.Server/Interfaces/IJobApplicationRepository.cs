using ApexHire.Server.Models;

namespace ApexHire.Server.Interfaces;

public interface IJobApplicationRepository
{
    Task<JobPost?> GetJobAsync(int jobPostId);

    Task<JobApplication?> GetExistingAsync(
        int jobPostId,
        int candidateUserId);

    Task<JobApplication?> GetByIdAsync(
        int applicationId);

    Task<List<JobApplication>>
        GetCandidateApplicationsAsync(
            int candidateUserId);

    Task<List<JobApplication>>
        GetDepartmentApplicationsAsync(
            int departmentId);

    Task<RecruiterProfile?> GetRecruiterProfileAsync(
        int userId);

    Task<HiringManagerProfile?>
        GetHiringManagerProfileAsync(
            int userId);

    Task AddAsync(JobApplication application);

    Task SaveChangesAsync();
}