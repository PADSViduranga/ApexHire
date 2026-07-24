using ApexHire.Server.DTOs;

namespace ApexHire.Server.Interfaces;

public interface ICandidateEducationService
{
    Task<List<CandidateEducationResponse>> GetAllAsync(int userId);

    Task<CandidateEducationResponse?> GetByIdAsync(
        int educationId,
        int userId);

    Task<CandidateEducationResponse> CreateAsync(
        int userId,
        CandidateEducationRequest request);

    Task<CandidateEducationResponse?> UpdateAsync(
        int educationId,
        int userId,
        CandidateEducationRequest request);

    Task<bool> DeleteAsync(
        int educationId,
        int userId);
}