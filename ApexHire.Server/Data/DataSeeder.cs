using ApexHire.Server.Enums;
using ApexHire.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ApexHire.Server.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(
        ApplicationDbContext context)
    {
        var passwordHasher = new PasswordHasher<User>();

        await CreateUserIfMissingAsync(
            context,
            passwordHasher,
            "Recruiter Demo",
            "recruiter@apexhire.com",
            "Demo123!",
            UserRole.Recruiter);

        await CreateUserIfMissingAsync(
            context,
            passwordHasher,
            "Hiring Manager Demo",
            "manager@apexhire.com",
            "Demo123!",
            UserRole.HiringManager);

        await CreateUserIfMissingAsync(
            context,
            passwordHasher,
            "Administrator Demo",
            "admin@apexhire.com",
            "Demo123!",
            UserRole.Admin);

        Organization? organization =
            await context.Organizations
                .FirstOrDefaultAsync(
                    item => item.Name == "Apex Global");

        if (organization is null)
        {
            organization = new Organization
            {
                Name = "Apex Global",
                Description =
                    "Technology and consulting organization.",
                Website = "https://example.com",
                Location = "Colombo, Sri Lanka",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            context.Organizations.Add(organization);
            await context.SaveChangesAsync();
        }

        Department? department =
            await context.Departments
                .FirstOrDefaultAsync(item =>
                    item.OrganizationId ==
                        organization.Id &&
                    item.Name ==
                        "Software Engineering");

        if (department is null)
        {
            department = new Department
            {
                Name = "Software Engineering",
                Description =
                    "Software design and development team.",
                OrganizationId = organization.Id,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            context.Departments.Add(department);
            await context.SaveChangesAsync();
        }

        User recruiter = await context.Users
            .FirstAsync(user =>
                user.Email == "recruiter@apexhire.com");

        bool recruiterProfileExists =
            await context.RecruiterProfiles.AnyAsync(
                profile =>
                    profile.UserId == recruiter.Id);

        if (!recruiterProfileExists)
        {
            context.RecruiterProfiles.Add(
                new RecruiterProfile
                {
                    UserId = recruiter.Id,
                    OrganizationId = organization.Id,
                    DepartmentId = department.Id,
                    JobTitle = "Technical Recruiter",
                    PhoneNumber = "0110000001",
                    CreatedAt = DateTime.UtcNow
                });
        }

        User hiringManager = await context.Users
            .FirstAsync(user =>
                user.Email == "manager@apexhire.com");

        bool managerProfileExists =
            await context.HiringManagerProfiles.AnyAsync(
                profile =>
                    profile.UserId == hiringManager.Id);

        if (!managerProfileExists)
        {
            context.HiringManagerProfiles.Add(
                new HiringManagerProfile
                {
                    UserId = hiringManager.Id,
                    OrganizationId = organization.Id,
                    DepartmentId = department.Id,
                    JobTitle =
                        "Software Engineering Manager",
                    PhoneNumber = "0110000002",
                    CreatedAt = DateTime.UtcNow
                });
        }

        await context.SaveChangesAsync();
    }

    private static async Task CreateUserIfMissingAsync(
        ApplicationDbContext context,
        PasswordHasher<User> passwordHasher,
        string fullName,
        string email,
        string password,
        UserRole role)
    {
        bool userExists = await context.Users
            .AnyAsync(user => user.Email == email);

        if (userExists)
        {
            return;
        }

        var user = new User
        {
            FullName = fullName,
            Email = email,
            Role = role,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        user.PasswordHash =
            passwordHasher.HashPassword(user, password);

        context.Users.Add(user);
        await context.SaveChangesAsync();
    }
}