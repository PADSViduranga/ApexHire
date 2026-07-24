using ApexHire.Server.Models;
using ApexHire.Server.Models.Requests;

namespace ApexHire.Server.Interfaces;

public interface ICandidateInterviewFeedbackService
{
    Task<CandidateInterviewFeedback> CreateAsync(
        int interviewId,
        int candidateUserId,
        CreateCandidateInterviewFeedbackRequest request);

    Task<IEnumerable<CandidateInterviewFeedback>>
        GetByCandidateAsync(
            int candidateUserId);

    Task<IEnumerable<CandidateInterviewFeedback>>
        GetAllAsync();

    Task<CandidateInterviewFeedback?> GetByIdAsync(
        int feedbackId);

    Task DeleteAsync(
        int feedbackId,
        int deletedByUserId,
        string deletedByRole);
}