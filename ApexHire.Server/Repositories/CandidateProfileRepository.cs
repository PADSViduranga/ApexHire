using ApexHire.Server.Data;
using ApexHire.Server.Interfaces;
using ApexHire.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ApexHire.Server.Repositories;

public class CandidateProfileRepository
    : ICandidateProfileRepository
{
    private readonly ApplicationDbContext _context;

    public CandidateProfileRepository(
        ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CandidateProfile?> GetByUserIdAsync(
        int userId)
    {
        return await _context.CandidateProfiles
            .Include(profile => profile.User)
            .FirstOrDefaultAsync(
                profile => profile.UserId == userId);
    }

    public async Task AddAsync(CandidateProfile profile)
    {
        await _context.CandidateProfiles.AddAsync(profile);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}