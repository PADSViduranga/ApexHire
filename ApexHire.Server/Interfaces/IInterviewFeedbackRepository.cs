using ApexHire.Server.Models;

namespace ApexHire.Server.Repositories.Interfaces;

public interface IInterviewFeedbackRepository
{
    Task<Interview?> GetInterviewByIdAsync(
        int interviewId);

    Task<InterviewFeedback?> GetByInterviewIdAsync(
        int interviewId);

    Task AddAsync(
        InterviewFeedback feedback);

    Task SaveChangesAsync();
}