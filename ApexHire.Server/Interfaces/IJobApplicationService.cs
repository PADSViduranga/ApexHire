using ApexHire.Server.DTOs;

namespace ApexHire.Server.Interfaces;

public interface IJobApplicationService
{
    Task<ApiResponse<JobApplicationResponse>> ApplyAsync(
        int candidateUserId,
        CreateJobApplicationRequest request);

    Task<ApiResponse<List<JobApplicationResponse>>>
        GetCandidateApplicationsAsync(
            int candidateUserId);

    Task<ApiResponse<List<JobApplicationResponse>>>
        GetStaffApplicationsAsync(
            int currentUserId);

    Task<ApiResponse<JobApplicationResponse>>
        UpdateStatusAsync(
            int currentUserId,
            int applicationId,
            UpdateApplicationStatusRequest request);

    Task<ApiResponse<JobApplicationResponse>>
        WithdrawAsync(
            int candidateUserId,
            int applicationId);
}