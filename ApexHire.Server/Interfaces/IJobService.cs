using ApexHire.Server.DTOs;

namespace ApexHire.Server.Interfaces;

public interface IJobService
{
    Task<ApiResponse<PagedResponse<JobResponse>>>
        SearchAsync(JobSearchRequest request);

    Task<ApiResponse<JobResponse>> GetByIdAsync(
        int id);

    Task<ApiResponse<List<JobResponse>>>
        GetRecruiterJobsAsync(
            int currentUserId);

    Task<ApiResponse<JobResponse>> CreateAsync(
        int currentUserId,
        CreateJobRequest request);

    Task<ApiResponse<JobResponse>> UpdateStatusAsync(
        int currentUserId,
        int jobId,
        UpdateJobStatusRequest request);
    Task<ApiResponse<JobResponse>> UpdateAsync(
    int recruiterUserId,
    int jobId,
    UpdateJobRequest request);

    Task<ApiResponse<string>> DeleteAsync(
        int recruiterUserId,
        int jobId);
}
