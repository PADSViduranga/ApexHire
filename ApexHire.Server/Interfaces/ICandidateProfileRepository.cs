using ApexHire.Server.Models;

namespace ApexHire.Server.Interfaces;

public interface ICandidateProfileRepository
{
    Task<CandidateProfile?> GetByUserIdAsync(int userId);

    Task AddAsync(CandidateProfile profile);

    Task SaveChangesAsync();
}