using ApexHire.Api.Models.Enums;
using ApexHire.Api.Services.Interfaces;
using ApexHire.Server.Models;
using ApexHire.Server.Models.Requests;
using ApexHire.Server.Repositories.Interfaces;
using ApexHire.Server.Services.Interfaces;

namespace ApexHire.Server.Services;

public class InterviewFeedbackService
    : IInterviewFeedbackService

{
    private readonly IInterviewFeedbackRepository
        _feedbackRepository;
    private readonly IAuditLogService _auditLogService;

    public InterviewFeedbackService(
        IInterviewFeedbackRepository feedbackRepository,
        IAuditLogService auditLogService)
    {
        _feedbackRepository = feedbackRepository;
        _auditLogService = auditLogService;
    }

    public async Task<InterviewFeedback> CreateAsync(
        int interviewId,
        int submittedByUserId,
        CreateInterviewFeedbackRequest request)
    {
        var interview = await _feedbackRepository
            .GetInterviewByIdAsync(interviewId);

        if (interview is null)
        {
            throw new KeyNotFoundException(
                "Interview not found.");
        }

        if (interview.Feedback is not null)
        {
            throw new InvalidOperationException(
                "Feedback has already been submitted for this interview.");
        }

        var feedback = new InterviewFeedback
        {
            InterviewId = interviewId,
            SubmittedByUserId = submittedByUserId,
            Comments = request.Comments.Trim(),
            TechnicalRating = request.TechnicalRating,
            CommunicationRating =
                request.CommunicationRating,
            OverallRating = request.OverallRating,
            RecommendedForHire =
                request.RecommendedForHire,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = null
        };

        await _feedbackRepository.AddAsync(feedback);
        await _feedbackRepository.SaveChangesAsync();
        await _auditLogService.LogAsync(
            AuditAction.Create,
            "Candidate",
            "Interview Feedback",
            feedback.Id.ToString(),
            $"Candidate submitted interview feedback.");

        return feedback;
    }

    public async Task<InterviewFeedback?>
        GetByInterviewIdAsync(
            int interviewId)
    {
        return await _feedbackRepository
            .GetByInterviewIdAsync(interviewId);
    }
}