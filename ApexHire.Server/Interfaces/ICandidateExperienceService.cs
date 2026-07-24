using ApexHire.Server.DTOs;

namespace ApexHire.Server.Interfaces;

public interface ICandidateExperienceService
{
    Task<List<CandidateExperienceResponse>> GetAllAsync(int userId);

    Task<CandidateExperienceResponse?> GetByIdAsync(
        int experienceId,
        int userId);

    Task<CandidateExperienceResponse> CreateAsync(
        int userId,
        CandidateExperienceRequest request);

    Task<CandidateExperienceResponse?> UpdateAsync(
        int experienceId,
        int userId,
        CandidateExperienceRequest request);

    Task<bool> DeleteAsync(
        int experienceId,
        int userId);
}