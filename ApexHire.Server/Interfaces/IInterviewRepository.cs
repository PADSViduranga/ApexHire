using ApexHire.Server.Models;

namespace ApexHire.Server.Interfaces;

public interface IInterviewRepository
{
    Task<JobApplication?> GetApplicationAsync(
        int applicationId);

    Task<Interview?> GetByIdAsync(
        int interviewId);

    Task<Interview?> GetActiveForApplicationAsync(
        int applicationId);

    Task<HiringManagerProfile?>
        GetHiringManagerProfileAsync(
            int userId);

    Task<List<Interview>>
        GetCandidateInterviewsAsync(
            int candidateUserId);

    Task<List<Interview>>
        GetDepartmentInterviewsAsync(
            int departmentId);

    Task AddAsync(Interview interview);

    Task SaveChangesAsync();
}