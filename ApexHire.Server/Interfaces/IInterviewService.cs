using ApexHire.Server.DTOs;

namespace ApexHire.Server.Interfaces;

public interface IInterviewService
{
    Task<ApiResponse<InterviewResponse>> ScheduleAsync(
        int currentUserId,
        ScheduleInterviewRequest request);

    Task<ApiResponse<List<InterviewResponse>>>
        GetCandidateInterviewsAsync(
            int candidateUserId);

    Task<ApiResponse<List<InterviewResponse>>>
        GetDepartmentInterviewsAsync(
            int currentUserId);

    Task<ApiResponse<InterviewResponse>>
        UpdateStatusAsync(
            int currentUserId,
            int interviewId,
            UpdateInterviewStatusRequest request);

    Task<ApiResponse<InterviewResponse>>
        RescheduleAsync(
            int currentUserId,
            int interviewId,
            RescheduleInterviewRequest request);
}