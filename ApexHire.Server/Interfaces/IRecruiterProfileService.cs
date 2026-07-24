using ApexHire.Server.DTOs;

namespace ApexHire.Server.Interfaces;

public interface IRecruiterProfileService
{
    Task<RecruiterProfileResponse> GetProfileAsync(int userId);

    Task<RecruiterProfileResponse> UpdateProfileAsync(
        int userId,
        UpdateRecruiterProfileRequest request);
}