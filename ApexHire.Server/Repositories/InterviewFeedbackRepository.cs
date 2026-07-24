using ApexHire.Server.Data;
using ApexHire.Server.Models;
using ApexHire.Server.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApexHire.Server.Repositories;

public class InterviewFeedbackRepository
    : IInterviewFeedbackRepository
{
    private readonly ApplicationDbContext _context;

    public InterviewFeedbackRepository(
        ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Interview?> GetInterviewByIdAsync(
        int interviewId)
    {
        return await _context.Interviews
            .Include(interview => interview.Feedback)
            .FirstOrDefaultAsync(interview =>
                interview.Id == interviewId);
    }

    public async Task<InterviewFeedback?>
        GetByInterviewIdAsync(
            int interviewId)
    {
        return await _context.InterviewFeedbacks
            .AsNoTracking()
            .Include(feedback =>
                feedback.SubmittedByUser)
            .FirstOrDefaultAsync(feedback =>
                feedback.InterviewId == interviewId);
    }

    public async Task AddAsync(
        InterviewFeedback feedback)
    {
        await _context.InterviewFeedbacks
            .AddAsync(feedback);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}