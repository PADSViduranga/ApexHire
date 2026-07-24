using ApexHire.Server.Data;
using ApexHire.Server.Interfaces;
using ApexHire.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ApexHire.Server.Repositories;

public class CandidateInterviewFeedbackRepository
    : ICandidateInterviewFeedbackRepository
{
    private readonly ApplicationDbContext _context;

    public CandidateInterviewFeedbackRepository(
        ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CandidateInterviewFeedback?>
        GetByIdAsync(int id)
    {
        return await _context
            .CandidateInterviewFeedbacks
            .FirstOrDefaultAsync(feedback =>
                feedback.Id == id);
    }

    public async Task<CandidateInterviewFeedback?>
        GetByInterviewAndCandidateAsync(
            int interviewId,
            int candidateUserId)
    {
        return await _context
            .CandidateInterviewFeedbacks
            .FirstOrDefaultAsync(feedback =>
                feedback.InterviewId == interviewId &&
                feedback.CandidateUserId ==
                    candidateUserId);
    }

    public async Task<
        IEnumerable<CandidateInterviewFeedback>>
        GetByInterviewAsync(
            int interviewId)
    {
        return await _context
            .CandidateInterviewFeedbacks
            .AsNoTracking()
            .Where(feedback =>
                feedback.InterviewId == interviewId)
            .OrderByDescending(feedback =>
                feedback.CreatedAt)
            .ToListAsync();
    }

    public async Task<
        IEnumerable<CandidateInterviewFeedback>>
        GetByCandidateAsync(
            int candidateUserId)
    {
        return await _context
            .CandidateInterviewFeedbacks
            .AsNoTracking()
            .Where(feedback =>
                feedback.CandidateUserId ==
                    candidateUserId)
            .OrderByDescending(feedback =>
                feedback.CreatedAt)
            .ToListAsync();
    }

    public async Task<
        IEnumerable<CandidateInterviewFeedback>>
        GetAllAsync()
    {
        return await _context
            .CandidateInterviewFeedbacks
            .AsNoTracking()
            .Include(feedback =>
                feedback.CandidateUser)
            .Include(feedback =>
                feedback.Interview)
            .OrderByDescending(feedback =>
                feedback.CreatedAt)
            .ToListAsync();
    }

    public async Task AddAsync(
        CandidateInterviewFeedback feedback)
    {
        await _context
            .CandidateInterviewFeedbacks
            .AddAsync(feedback);
    }

    public void Update(
        CandidateInterviewFeedback feedback)
    {
        _context
            .CandidateInterviewFeedbacks
            .Update(feedback);
    }

    public void Delete(
        CandidateInterviewFeedback feedback)
    {
        _context
            .CandidateInterviewFeedbacks
            .Remove(feedback);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}