using ApexHire.Server.Interfaces;
using ApexHire.Server.Models;
using ApexHire.Server.Models.Enums;
using ApexHire.Server.Models.Requests;

namespace ApexHire.Server.Services;

public class CandidateInterviewFeedbackService
    : ICandidateInterviewFeedbackService
{
    private readonly
        ICandidateInterviewFeedbackRepository _repository;

    private readonly IInterviewRepository
        _interviewRepository;

    public CandidateInterviewFeedbackService(
        ICandidateInterviewFeedbackRepository repository,
        IInterviewRepository interviewRepository)
    {
        _repository = repository;
        _interviewRepository = interviewRepository;
    }

    public async Task<CandidateInterviewFeedback>
        CreateAsync(
            int interviewId,
            int candidateUserId,
            CreateCandidateInterviewFeedbackRequest request)
    {
        var interview = await _interviewRepository
            .GetByIdAsync(interviewId);

        if (interview is null)
        {
            throw new KeyNotFoundException(
                "Interview not found.");
        }

        if (interview.JobApplication.CandidateUserId
            != candidateUserId)
        {
            throw new UnauthorizedAccessException(
                "You can only give feedback for your own interview.");
        }

        var existingFeedback = await _repository
            .GetByInterviewAndCandidateAsync(
                interviewId,
                candidateUserId);

        if (existingFeedback is not null)
        {
            throw new InvalidOperationException(
                "Feedback has already been submitted for this interview.");
        }

        var feedback =
            new CandidateInterviewFeedback
            {
                InterviewId = interviewId,
                CandidateUserId = candidateUserId,

                OverallExperienceRating =
                    request.OverallExperienceRating,

                InterviewerProfessionalismRating =
                    request.InterviewerProfessionalismRating,

                ProcessClarityRating =
                    request.ProcessClarityRating,

                Comments = request.Comments.Trim(),

                Status =
                    CandidateFeedbackStatus.Submitted,

                CreatedAt = DateTime.UtcNow
            };

        await _repository.AddAsync(feedback);
        await _repository.SaveChangesAsync();

        return feedback;
    }

    public async Task<
        IEnumerable<CandidateInterviewFeedback>>
        GetByCandidateAsync(
            int candidateUserId)
    {
        return await _repository
            .GetByCandidateAsync(candidateUserId);
    }

    public async Task<
        IEnumerable<CandidateInterviewFeedback>>
        GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<CandidateInterviewFeedback?>
        GetByIdAsync(
            int feedbackId)
    {
        return await _repository
            .GetByIdAsync(feedbackId);
    }

    public async Task DeleteAsync(
        int feedbackId,
        int deletedByUserId,
        string deletedByRole)
    {
        if (deletedByRole != "HiringManager" &&
            deletedByRole != "Admin")
        {
            throw new UnauthorizedAccessException(
                "You are not allowed to delete candidate feedback.");
        }

        var feedback =
            await _repository.GetByIdAsync(
                feedbackId);

        if (feedback is null)
        {
            throw new KeyNotFoundException(
                "Candidate feedback not found.");
        }

        _repository.Delete(feedback);

        await _repository.SaveChangesAsync();
    }
}