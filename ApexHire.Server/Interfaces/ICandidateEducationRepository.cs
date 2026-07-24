using ApexHire.Server.Models;

namespace ApexHire.Server.Repositories.Interfaces;

public interface ICandidateEducationRepository
{
    Task<List<CandidateEducation>> GetAllByUserIdAsync(int userId);

    Task<CandidateEducation?> GetByIdForUserAsync(
        int educationId,
        int userId);

    Task<CandidateProfile?> GetProfileByUserIdAsync(int userId);

    Task AddAsync(CandidateEducation education);

    void Delete(CandidateEducation education);

    Task SaveChangesAsync();
}