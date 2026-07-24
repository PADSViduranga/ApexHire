using ApexHire.Server.Models;
using ApexHire.Server.Models.Requests;

namespace ApexHire.Server.Services.Interfaces;

public interface IInterviewFeedbackService
{
    Task<InterviewFeedback> CreateAsync(
        int interviewId,
        int submittedByUserId,
        CreateInterviewFeedbackRequest request);

    Task<InterviewFeedback?> GetByInterviewIdAsync(
        int interviewId);
}