using ApexHire.Server.Models;

namespace ApexHire.Server.Interfaces;

public interface ICandidateInterviewFeedbackRepository
{
    Task<CandidateInterviewFeedback?> GetByIdAsync(
        int id);

    Task<CandidateInterviewFeedback?>
        GetByInterviewAndCandidateAsync(
            int interviewId,
            int candidateUserId);

    Task<IEnumerable<CandidateInterviewFeedback>>
        GetByInterviewAsync(
            int interviewId);

    Task<IEnumerable<CandidateInterviewFeedback>>
        GetByCandidateAsync(
            int candidateUserId);

    Task<IEnumerable<CandidateInterviewFeedback>>
        GetAllAsync();

    Task AddAsync(
        CandidateInterviewFeedback feedback);

    void Update(
        CandidateInterviewFeedback feedback);

    void Delete(
        CandidateInterviewFeedback feedback);

    Task SaveChangesAsync();
}