using ApexHire.Server.Models;

namespace ApexHire.Server.Interfaces;

public interface ICandidateExperienceRepository
{
    Task<List<CandidateExperience>> GetAllByUserIdAsync(int userId);

    Task<CandidateExperience?> GetByIdForUserAsync(
        int experienceId,
        int userId);

    Task<CandidateProfile?> GetProfileByUserIdAsync(int userId);

    Task AddAsync(CandidateExperience experience);

    void Delete(CandidateExperience experience);

    Task SaveChangesAsync();
}