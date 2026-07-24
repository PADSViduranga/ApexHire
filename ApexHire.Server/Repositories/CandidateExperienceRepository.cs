using ApexHire.Server.Data;
using ApexHire.Server.Interfaces;
using ApexHire.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ApexHire.Server.Repositories;

public class CandidateExperienceRepository : ICandidateExperienceRepository
{
    private readonly ApplicationDbContext _context;

    public CandidateExperienceRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<CandidateExperience>> GetAllByUserIdAsync(int userId)
    {
        return await _context.CandidateExperiences
            .Where(e => e.CandidateProfile.UserId == userId)
            .OrderByDescending(e => e.StartDate)
            .ToListAsync();
    }

    public async Task<CandidateExperience?> GetByIdForUserAsync(
        int experienceId,
        int userId)
    {
        return await _context.CandidateExperiences
            .FirstOrDefaultAsync(e =>
                e.Id == experienceId &&
                e.CandidateProfile.UserId == userId);
    }

    public async Task<CandidateProfile?> GetProfileByUserIdAsync(int userId)
    {
        return await _context.CandidateProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);
    }

    public async Task AddAsync(CandidateExperience experience)
    {
        await _context.CandidateExperiences.AddAsync(experience);
    }

    public void Delete(CandidateExperience experience)
    {
        _context.CandidateExperiences.Remove(experience);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}