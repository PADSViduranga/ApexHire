using ApexHire.Server.DTOs;
using ApexHire.Server.Models;

namespace ApexHire.Server.Interfaces;

public interface IJobRepository
{
    Task<PagedResponse<JobPost>> SearchAsync(
        JobSearchRequest request);

    Task<List<JobPost>> GetByCreatedUserIdAsync(
        int createdByUserId);

    Task<JobPost?> GetByIdAsync(int id);

    Task<bool> OrganizationExistsAsync(
        int organizationId);

    Task<bool> DepartmentBelongsToOrganizationAsync(
        int departmentId,
        int organizationId);

    Task AddAsync(JobPost job);

    // NEW
    void Update(JobPost job);

    // NEW
    void Remove(JobPost job);

    Task SaveChangesAsync();
}