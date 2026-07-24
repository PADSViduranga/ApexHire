using ApexHire.Server.Models;

namespace ApexHire.Server.Interfaces;

public interface IRecruiterProfileRepository
{
    Task<RecruiterProfile?> GetByUserIdAsync(int userId);

    Task<RecruiterProfile> CreateAsync(RecruiterProfile profile);

    Task UpdateAsync(RecruiterProfile profile);
}
