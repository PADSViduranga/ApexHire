using ApexHire.Server.DTOs;
using ApexHire.Server.Interfaces;
using ApexHire.Server.Models;
using ApexHire.Server.Repositories.Interfaces;

namespace ApexHire.Server.Services;

public class CandidateEducationService : ICandidateEducationService
{
    private readonly ICandidateEducationRepository _repository;

    public CandidateEducationService(
        ICandidateEducationRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<CandidateEducationResponse>> GetAllAsync(int userId)
    {
        var educations = await _repository.GetAllByUserIdAsync(userId);

        return educations.Select(Map).ToList();
    }

    public async Task<CandidateEducationResponse?> GetByIdAsync(
        int educationId,
        int userId)
    {
        var education =
            await _repository.GetByIdForUserAsync(
                educationId,
                userId);

        return education == null ? null : Map(education);
    }

    public async Task<CandidateEducationResponse> CreateAsync(
        int userId,
        CandidateEducationRequest request)
    {
        var profile =
            await _repository.GetProfileByUserIdAsync(userId)
            ?? throw new Exception("Candidate profile not found.");

        var education = new CandidateEducation
        {
            CandidateProfileId = profile.Id,
            Institution = request.Institution,
            Degree = request.Degree,
            FieldOfStudy = request.FieldOfStudy,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Description = request.Description
        };

        await _repository.AddAsync(education);
        await _repository.SaveChangesAsync();

        return Map(education);
    }

    public async Task<CandidateEducationResponse?> UpdateAsync(
        int educationId,
        int userId,
        CandidateEducationRequest request)
    {
        var education =
            await _repository.GetByIdForUserAsync(
                educationId,
                userId);

        if (education == null)
            return null;

        education.Institution = request.Institution;
        education.Degree = request.Degree;
        education.FieldOfStudy = request.FieldOfStudy;
        education.StartDate = request.StartDate;
        education.EndDate = request.EndDate;
        education.Description = request.Description;

        await _repository.SaveChangesAsync();

        return Map(education);
    }

    public async Task<bool> DeleteAsync(
        int educationId,
        int userId)
    {
        var education =
            await _repository.GetByIdForUserAsync(
                educationId,
                userId);

        if (education == null)
            return false;

        _repository.Delete(education);

        await _repository.SaveChangesAsync();

        return true;
    }

    private static CandidateEducationResponse Map(
        CandidateEducation education)
    {
        return new CandidateEducationResponse
        {
            Id = education.Id,
            Institution = education.Institution,
            Degree = education.Degree,
            FieldOfStudy = education.FieldOfStudy,
            StartDate = education.StartDate,
            EndDate = education.EndDate,
            Description = education.Description
        };
    }
}