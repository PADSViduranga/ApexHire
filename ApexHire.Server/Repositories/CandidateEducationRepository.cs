using ApexHire.Server.Data;
using ApexHire.Server.Models;
using ApexHire.Server.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApexHire.Server.Repositories;

public class CandidateEducationRepository : ICandidateEducationRepository
{
    private readonly ApplicationDbContext _context;

    public CandidateEducationRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<CandidateEducation>> GetAllByUserIdAsync(int userId)
    {
        return await _context.CandidateEducations
            .Where(e => e.CandidateProfile.UserId == userId)
            .OrderByDescending(e => e.StartDate)
            .ToListAsync();
    }

    public async Task<CandidateEducation?> GetByIdForUserAsync(
        int educationId,
        int userId)
    {
        return await _context.CandidateEducations
            .FirstOrDefaultAsync(e =>
                e.Id == educationId &&
                e.CandidateProfile.UserId == userId);
    }

    public async Task<CandidateProfile?> GetProfileByUserIdAsync(int userId)
    {
        return await _context.CandidateProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId);
    }

    public async Task AddAsync(CandidateEducation education)
    {
        await _context.CandidateEducations.AddAsync(education);
    }

    public void Delete(CandidateEducation education)
    {
        _context.CandidateEducations.Remove(education);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}