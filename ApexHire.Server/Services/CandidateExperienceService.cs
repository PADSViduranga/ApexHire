using ApexHire.Server.DTOs;
using ApexHire.Server.Interfaces;
using ApexHire.Server.Models;

namespace ApexHire.Server.Services;

public class CandidateExperienceService : ICandidateExperienceService
{
    private readonly ICandidateExperienceRepository _repository;

    public CandidateExperienceService(
        ICandidateExperienceRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<CandidateExperienceResponse>> GetAllAsync(int userId)
    {
        var experiences = await _repository.GetAllByUserIdAsync(userId);

        return experiences.Select(Map).ToList();
    }

    public async Task<CandidateExperienceResponse?> GetByIdAsync(
        int experienceId,
        int userId)
    {
        var experience = await _repository.GetByIdForUserAsync(
            experienceId,
            userId);

        return experience == null ? null : Map(experience);
    }

    public async Task<CandidateExperienceResponse> CreateAsync(
        int userId,
        CandidateExperienceRequest request)
    {
        var profile = await _repository.GetProfileByUserIdAsync(userId)
            ?? throw new Exception("Candidate profile not found.");

        var experience = new CandidateExperience
        {
            CandidateProfileId = profile.Id,
            Company = request.Company,
            Position = request.Position,
            EmploymentType = request.EmploymentType,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            CurrentJob = request.CurrentJob,
            Description = request.Description
        };

        await _repository.AddAsync(experience);
        await _repository.SaveChangesAsync();

        return Map(experience);
    }

    public async Task<CandidateExperienceResponse?> UpdateAsync(
        int experienceId,
        int userId,
        CandidateExperienceRequest request)
    {
        var experience = await _repository.GetByIdForUserAsync(
            experienceId,
            userId);

        if (experience == null)
            return null;

        experience.Company = request.Company;
        experience.Position = request.Position;
        experience.EmploymentType = request.EmploymentType;
        experience.StartDate = request.StartDate;
        experience.EndDate = request.EndDate;
        experience.CurrentJob = request.CurrentJob;
        experience.Description = request.Description;

        await _repository.SaveChangesAsync();

        return Map(experience);
    }

    public async Task<bool> DeleteAsync(
        int experienceId,
        int userId)
    {
        var experience = await _repository.GetByIdForUserAsync(
            experienceId,
            userId);

        if (experience == null)
            return false;

        _repository.Delete(experience);

        await _repository.SaveChangesAsync();

        return true;
    }

    private static CandidateExperienceResponse Map(
        CandidateExperience experience)
    {
        return new CandidateExperienceResponse
        {
            Id = experience.Id,
            Company = experience.Company,
            Position = experience.Position,
            EmploymentType = experience.EmploymentType,
            StartDate = experience.StartDate,
            EndDate = experience.EndDate,
            CurrentJob = experience.CurrentJob,
            Description = experience.Description
        };
    }
}