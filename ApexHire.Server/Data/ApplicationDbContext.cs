
using ApexHire.Api.Models;
using ApexHire.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ApexHire.Server.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    public DbSet<CandidateProfile> CandidateProfiles
    {
        get;
        set;
    }

    public DbSet<Organization> Organizations { get; set; }

    public DbSet<Department> Departments { get; set; }

    public DbSet<JobPost> JobPosts { get; set; }

    public DbSet<RecruiterProfile> RecruiterProfiles
    {
        get;
        set;
    }

    public DbSet<HiringManagerProfile>
        HiringManagerProfiles
    {
        get;
        set;
    }

    public DbSet<JobApplication> JobApplications
    {
        get;
        set;
    }

    public DbSet<Interview> Interviews { get; set; }

    public DbSet<InterviewFeedback> InterviewFeedbacks
    {
        get;
        set;
    }
    public DbSet<CandidateInterviewFeedback>
    CandidateInterviewFeedbacks
    {
        get;
        set;
    }
    public DbSet<CandidateEducation> CandidateEducations { get; set; }

    public DbSet<CandidateExperience> CandidateExperiences { get; set; }

    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    protected override void OnModelCreating(
        ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(user => user.Id);

            entity.HasIndex(user => user.Email)
                .IsUnique();

            entity.Property(user => user.FullName)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(user => user.Email)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(user => user.PasswordHash)
                .IsRequired();

            entity.Property(user => user.Role)
                .HasConversion<string>()
                .HasMaxLength(30)
                .IsRequired();
        });

        // Candidate profile
        modelBuilder.Entity<CandidateProfile>(entity =>
        {
            entity.HasKey(profile => profile.Id);

            entity.HasIndex(profile => profile.UserId)
                .IsUnique();

            entity.Property(profile => profile.Skills)
                .HasMaxLength(1000);

            entity.HasOne(profile => profile.User)
                .WithOne(user => user.CandidateProfile)
                .HasForeignKey<CandidateProfile>(
                    profile => profile.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
        // Candidate Education
        modelBuilder.Entity<CandidateEducation>()
            .HasOne(e => e.CandidateProfile)
            .WithMany(p => p.Educations)
            .HasForeignKey(e => e.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        // Candidate Experience
        modelBuilder.Entity<CandidateExperience>()
            .HasOne(e => e.CandidateProfile)
            .WithMany(p => p.Experiences)
            .HasForeignKey(e => e.CandidateProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        // Organization
        modelBuilder.Entity<Organization>(entity =>
        {
            entity.HasKey(organization =>
                organization.Id);

            entity.HasIndex(organization =>
                    organization.Name)
                .IsUnique();

            entity.Property(organization =>
                    organization.Name)
                .HasMaxLength(150)
                .IsRequired();
        });

        // Department
        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(department =>
                department.Id);

            entity.HasIndex(department => new
            {
                department.OrganizationId,
                department.Name
            })
            .IsUnique();

            entity.Property(department =>
                    department.Name)
                .HasMaxLength(100)
                .IsRequired();

            entity.HasOne(department =>
                    department.Organization)
                .WithMany(organization =>
                    organization.Departments)
                .HasForeignKey(department =>
                    department.OrganizationId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Job post
        modelBuilder.Entity<JobPost>(entity =>
        {
            entity.HasKey(job => job.Id);

            entity.HasIndex(job => job.Title);

            entity.HasIndex(job => job.Location);

            entity.HasIndex(job =>
                job.OrganizationId);

            entity.HasIndex(job => job.Status);

            entity.Property(job => job.Title)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(job => job.Description)
                .HasMaxLength(5000)
                .IsRequired();

            entity.Property(job => job.Location)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(job =>
                    job.RequiredSkills)
                .HasMaxLength(1500);

            entity.Property(job => job.SalaryMin)
                .HasPrecision(18, 2);

            entity.Property(job => job.SalaryMax)
                .HasPrecision(18, 2);

            entity.Property(job =>
                    job.EmploymentType)
                .HasConversion<string>()
                .HasMaxLength(30)
                .IsRequired();

            entity.Property(job => job.Status)
                .HasConversion<string>()
                .HasMaxLength(30)
                .IsRequired();

            entity.HasOne(job => job.Organization)
                .WithMany()
                .HasForeignKey(job =>
                    job.OrganizationId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(job => job.Department)
                .WithMany()
                .HasForeignKey(job =>
                    job.DepartmentId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(job =>
                    job.CreatedByUser)
                .WithMany()
                .HasForeignKey(job =>
                    job.CreatedByUserId)
                .OnDelete(DeleteBehavior.NoAction);
        });

        // Recruiter profile
        modelBuilder.Entity<RecruiterProfile>(entity =>
        {
            entity.HasKey(profile => profile.Id);

            entity.HasIndex(profile =>
                    profile.UserId)
                .IsUnique();

            entity.HasIndex(profile => new
            {
                profile.OrganizationId,
                profile.DepartmentId
            });

            entity.Property(profile =>
                    profile.JobTitle)
                .HasMaxLength(100);

            entity.Property(profile =>
                    profile.PhoneNumber)
                .HasMaxLength(20);

            entity.HasOne(profile => profile.User)
                .WithOne(user =>
                    user.RecruiterProfile)
                .HasForeignKey<RecruiterProfile>(
                    profile => profile.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(profile =>
                    profile.Organization)
                .WithMany()
                .HasForeignKey(profile =>
                    profile.OrganizationId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(profile =>
                    profile.Department)
                .WithMany()
                .HasForeignKey(profile =>
                    profile.DepartmentId)
                .OnDelete(DeleteBehavior.NoAction);
        });

        // Hiring manager profile
        modelBuilder.Entity<HiringManagerProfile>(
            entity =>
            {
                entity.HasKey(profile => profile.Id);

                entity.HasIndex(profile =>
                        profile.UserId)
                    .IsUnique();

                entity.HasIndex(profile => new
                {
                    profile.OrganizationId,
                    profile.DepartmentId
                });

                entity.Property(profile =>
                        profile.JobTitle)
                    .HasMaxLength(100);

                entity.Property(profile =>
                        profile.PhoneNumber)
                    .HasMaxLength(20);

                entity.HasOne(profile =>
                        profile.User)
                    .WithOne(user =>
                        user.HiringManagerProfile)
                    .HasForeignKey<
                        HiringManagerProfile>(
                        profile => profile.UserId)
                    .OnDelete(
                        DeleteBehavior.NoAction);

                entity.HasOne(profile =>
                        profile.Organization)
                    .WithMany()
                    .HasForeignKey(profile =>
                        profile.OrganizationId)
                    .OnDelete(
                        DeleteBehavior.NoAction);

                entity.HasOne(profile =>
                        profile.Department)
                    .WithMany()
                    .HasForeignKey(profile =>
                        profile.DepartmentId)
                    .OnDelete(
                        DeleteBehavior.NoAction);
            });

        // Job application
        modelBuilder.Entity<JobApplication>(entity =>
        {
            entity.HasKey(application =>
                application.Id);

            // One candidate can apply only once per job
            entity.HasIndex(application => new
            {
                application.JobPostId,
                application.CandidateUserId
            })
            .IsUnique();

            entity.HasIndex(application =>
                application.Status);

            entity.Property(application =>
                    application.CoverLetter)
                .HasMaxLength(3000);

            entity.Property(application =>
                    application.Status)
                .HasConversion<string>()
                .HasMaxLength(30)
                .IsRequired();

            entity.Property(application =>
                    application.MatchScore)
                .HasPrecision(5, 2);

            entity.HasOne(application =>
                    application.JobPost)
                .WithMany(job => job.Applications)
                .HasForeignKey(application =>
                    application.JobPostId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(application =>
                    application.CandidateUser)
                .WithMany(user =>
                    user.JobApplications)
                .HasForeignKey(application =>
                    application.CandidateUserId)
                .OnDelete(DeleteBehavior.NoAction);
        });

        // Interview
        modelBuilder.Entity<Interview>(entity =>
        {
            entity.HasKey(interview =>
                interview.Id);

            entity.HasIndex(interview =>
                interview.JobApplicationId);

            entity.HasIndex(interview =>
                interview.ScheduledAt);

            entity.Property(interview =>
                    interview.Location)
                .HasMaxLength(150);

            entity.Property(interview =>
                    interview.MeetingUrl)
                .HasMaxLength(500);

            entity.Property(interview =>
                    interview.Instructions)
                .HasMaxLength(2000);

            entity.Property(interview =>
                    interview.Status)
                .HasConversion<string>()
                .HasMaxLength(30)
                .IsRequired();

            entity.HasOne(interview =>
                    interview.JobApplication)
                .WithMany()
                .HasForeignKey(interview =>
                    interview.JobApplicationId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(interview =>
                    interview.ScheduledByUser)
                .WithMany()
                .HasForeignKey(interview =>
                    interview.ScheduledByUserId)
                .OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Action)
                .HasConversion<int>();

            entity.Property(x => x.Severity)
                .HasConversion<int>();

            entity.Property(x => x.Status)
                .HasConversion<int>();

            entity.HasIndex(x => x.CreatedAt);

            entity.HasIndex(x => x.UserId);

            entity.HasIndex(x => x.Action);

            entity.HasIndex(x => x.Module);

            entity.HasIndex(x => x.EntityName);

            entity.HasIndex(x => x.EntityId);

            entity.HasIndex(x => x.Severity);

            entity.HasIndex(x => x.Status);

            entity.HasIndex(x => new
            {
                x.Module,
                x.Action,
                x.CreatedAt
            });
        });

        // Interview feedback
        modelBuilder.Entity<InterviewFeedback>(entity =>
        {
            entity.HasKey(feedback =>
                feedback.Id);

            entity.HasIndex(feedback =>
                    feedback.InterviewId)
                .IsUnique();

            entity.Property(feedback =>
                    feedback.Comments)
                .HasMaxLength(3000)
                .IsRequired();

            entity.HasOne(feedback =>
                    feedback.Interview)
                .WithOne(interview =>
                    interview.Feedback)
                .HasForeignKey<InterviewFeedback>(
                    feedback =>
                        feedback.InterviewId)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(feedback =>
                    feedback.SubmittedByUser)
                .WithMany()
                .HasForeignKey(feedback =>
                    feedback.SubmittedByUserId)
                .OnDelete(DeleteBehavior.NoAction);
        });
    }
}

