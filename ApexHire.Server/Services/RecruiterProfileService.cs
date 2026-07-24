using ApexHire.Api.Models.Enums;
using ApexHire.Api.Services.Interfaces;
using ApexHire.Server.Data;
using ApexHire.Server.DTOs;
using ApexHire.Server.Interfaces;
using ApexHire.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ApexHire.Server.Services;

public class RecruiterProfileService
    : IRecruiterProfileService
{
    private readonly IRecruiterProfileRepository
        _repository;

    private readonly ApplicationDbContext _context;
    private readonly IAuditLogService _auditLogService;

    public RecruiterProfileService(
        IRecruiterProfileRepository repository,
        ApplicationDbContext context,
        IAuditLogService auditLogService)
    {
        _repository = repository;
        _context = context;
         _auditLogService = auditLogService;
    }

    public async Task<RecruiterProfileResponse>
        GetProfileAsync(int userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(user =>
                user.Id == userId);

        if (user is null)
        {
            throw new KeyNotFoundException(
                "User was not found.");
        }

        var profile =
            await _repository.GetByUserIdAsync(userId);

        if (profile is null)
        {
            throw new KeyNotFoundException(
                "Recruiter profile was not found.");
        }

        return MapToResponse(profile);
    }

    public async Task<RecruiterProfileResponse>
        UpdateProfileAsync(
            int userId,
            UpdateRecruiterProfileRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(user =>
                user.Id == userId);

        if (user is null)
        {
            throw new KeyNotFoundException(
                "User was not found.");
        }

        var organization =
            await _context.Organizations
                .FirstOrDefaultAsync(organization =>
                    organization.Id ==
                    request.OrganizationId);

        if (organization is null)
        {
            throw new ArgumentException(
                "Selected organization does not exist.");
        }

        var department =
            await _context.Departments
                .FirstOrDefaultAsync(department =>
                    department.Id ==
                    request.DepartmentId);

        if (department is null)
        {
            throw new ArgumentException(
                "Selected department does not exist.");
        }

        if (department.OrganizationId !=
            request.OrganizationId)
        {
            throw new ArgumentException(
                "The selected department does not belong " +
                "to the selected organization.");
        }

        var profile =
            await _repository.GetByUserIdAsync(userId);

        if (profile is null)
        {
            profile = new RecruiterProfile
            {
                UserId = userId,
                OrganizationId =
                    request.OrganizationId,
                DepartmentId =
                    request.DepartmentId,
                JobTitle =
                    request.JobTitle?.Trim(),
                PhoneNumber =
                    request.PhoneNumber?.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            await _repository.CreateAsync(profile);

            await _auditLogService.LogAsync(
                AuditAction.Create,
                "Recruiter",
                "Recruiter Profile",
                profile.Id.ToString(),
                $"Recruiter profile created for '{user.Email}'.");
        }
        else
        {
            profile.OrganizationId =
                request.OrganizationId;

            profile.DepartmentId =
                request.DepartmentId;

            profile.JobTitle =
                request.JobTitle?.Trim();

            profile.PhoneNumber =
                request.PhoneNumber?.Trim();

            profile.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(profile);

            await _auditLogService.LogAsync(
                AuditAction.Update,
                "Recruiter",
                "Recruiter Profile",
                profile.Id.ToString(),
                $"Recruiter profile updated for '{user.Email}'.");
                    }

        var updatedProfile =
            await _repository.GetByUserIdAsync(userId);

        if (updatedProfile is null)
        {
            throw new InvalidOperationException(
                "Recruiter profile could not be loaded.");
        }

        return MapToResponse(updatedProfile);
    }

    private static RecruiterProfileResponse
        MapToResponse(RecruiterProfile profile)
    {
        return new RecruiterProfileResponse
        {
            Id = profile.Id,
            UserId = profile.UserId,
            FullName = profile.User.FullName,
            Email = profile.User.Email,
            OrganizationId =
                profile.OrganizationId,
            OrganizationName =
                profile.Organization.Name,
            DepartmentId =
                profile.DepartmentId,
            DepartmentName =
                profile.Department.Name,
            JobTitle = profile.JobTitle,
            PhoneNumber = profile.PhoneNumber,
            CreatedAt = profile.CreatedAt,
            UpdatedAt = profile.UpdatedAt
        };
    }
}
