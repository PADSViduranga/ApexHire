using ApexHire.Server.Data;
using ApexHire.Server.DTOs;
using ApexHire.Server.Enums;
using ApexHire.Server.Interfaces;
using ApexHire.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ApexHire.Server.Repositories;

public class JobRepository : IJobRepository
{
    private readonly ApplicationDbContext _context;

    public JobRepository(
        ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<JobPost>>
        SearchAsync(
            JobSearchRequest request)
    {
        int page = request.Page < 1
            ? 1
            : request.Page;

        int pageSize = request.PageSize switch
        {
            < 1 => 10,
            > 100 => 100,
            _ => request.PageSize
        };

        IQueryable<JobPost> query =
            _context.JobPosts
                .AsNoTracking()
                .Include(job =>
                    job.Organization)
                .Include(job =>
                    job.Department)
                .Include(job =>
                    job.CreatedByUser)
                .Where(job =>
                    job.Status ==
                        JobStatus.Published &&
                    (
                        job.ApplicationDeadline ==
                            null ||
                        job.ApplicationDeadline >=
                            DateTime.UtcNow
                    ));

        if (!string.IsNullOrWhiteSpace(
                request.Title))
        {
            string title =
                request.Title.Trim();

            query = query.Where(job =>
                job.Title.Contains(title));
        }

        if (!string.IsNullOrWhiteSpace(
                request.Location))
        {
            string location =
                request.Location.Trim();

            query = query.Where(job =>
                job.Location.Contains(location));
        }

        if (request.EmploymentType.HasValue)
        {
            EmploymentType employmentType =
                request.EmploymentType.Value;

            query = query.Where(job =>
                job.EmploymentType ==
                    employmentType);
        }

        if (request.MinimumSalary.HasValue)
        {
            decimal minimumSalary =
                request.MinimumSalary.Value;

            query = query.Where(job =>
                job.SalaryMax >=
                    minimumSalary);
        }

        if (request.MaximumSalary.HasValue)
        {
            decimal maximumSalary =
                request.MaximumSalary.Value;

            query = query.Where(job =>
                job.SalaryMin <=
                    maximumSalary);
        }

        if (request.OrganizationId.HasValue)
        {
            int organizationId =
                request.OrganizationId.Value;

            query = query.Where(job =>
                job.OrganizationId ==
                    organizationId);
        }

        int totalItems =
            await query.CountAsync();

        List<JobPost> items =
            await query
                .OrderByDescending(job =>
                    job.CreatedAt)
                .Skip(
                    (page - 1) *
                    pageSize)
                .Take(pageSize)
                .ToListAsync();

        return new PagedResponse<JobPost>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalItems = totalItems
        };
    }

    public async Task<List<JobPost>>
        GetByCreatedUserIdAsync(
            int createdByUserId)
    {
        return await _context.JobPosts
            .AsNoTracking()
            .Include(job =>
                job.Organization)
            .Include(job =>
                job.Department)
            .Include(job =>
                job.CreatedByUser)
            .Where(job =>
                job.CreatedByUserId ==
                    createdByUserId)
            .OrderByDescending(job =>
                job.CreatedAt)
            .ToListAsync();
    }

    public async Task<JobPost?>
        GetByIdAsync(int id)
    {
        return await _context.JobPosts
            .Include(job =>
                job.Organization)
            .Include(job =>
                job.Department)
            .Include(job =>
                job.CreatedByUser)
            .FirstOrDefaultAsync(job =>
                job.Id == id);
    }

    public async Task<bool>
        OrganizationExistsAsync(
            int organizationId)
    {
        return await _context.Organizations
            .AnyAsync(organization =>
                organization.Id ==
                    organizationId &&
                organization.IsActive);
    }

    public async Task<bool>
        DepartmentBelongsToOrganizationAsync(
            int departmentId,
            int organizationId)
    {
        return await _context.Departments
            .AnyAsync(department =>
                department.Id ==
                    departmentId &&
                department.OrganizationId ==
                    organizationId &&
                department.IsActive);
    }

    public async Task AddAsync(
        JobPost job)
    {
        await _context.JobPosts
            .AddAsync(job);
    }

    public void Update(
        JobPost job)
    {
        _context.JobPosts.Update(job);
    }

    public void Remove(
        JobPost job)
    {
        _context.JobPosts.Remove(job);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}