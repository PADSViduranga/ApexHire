using ApexHire.Server.Data;
using ApexHire.Server.Interfaces;
using ApexHire.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ApexHire.Server.Repositories;

public class RecruiterProfileRepository
    : IRecruiterProfileRepository
{
    private readonly ApplicationDbContext _context;

    public RecruiterProfileRepository(
        ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<RecruiterProfile?>
        GetByUserIdAsync(int userId)
    {
        return await _context.RecruiterProfiles
            .Include(profile => profile.User)
            .Include(profile => profile.Organization)
            .Include(profile => profile.Department)
            .FirstOrDefaultAsync(
                profile => profile.UserId == userId);
    }

    public async Task<RecruiterProfile>
        CreateAsync(RecruiterProfile profile)
    {
        _context.RecruiterProfiles.Add(profile);

        await _context.SaveChangesAsync();

        return profile;
    }

    public async Task UpdateAsync(
        RecruiterProfile profile)
    {
        _context.RecruiterProfiles.Update(profile);

        await _context.SaveChangesAsync();
    }
}
