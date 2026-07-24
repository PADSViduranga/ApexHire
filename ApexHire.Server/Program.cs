using ApexHire.Api.Services;
using ApexHire.Api.Services.Interfaces;
using ApexHire.Server.Configurations;
using ApexHire.Server.Data;
using ApexHire.Server.Interfaces;
using ApexHire.Server.Repositories;
using ApexHire.Server.Repositories.Interfaces;
using ApexHire.Server.Services;
using ApexHire.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Database connection
builder.Services.AddDbContext<ApplicationDbContext>(
    options =>
        options.UseSqlServer(
            builder.Configuration.GetConnectionString(
                "DefaultConnection"
            )
        )
);

// Email configuration
builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection(
        "EmailSettings"
    )
);

// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowFrontend",
        policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    );
});

// Repositories
builder.Services.AddScoped<
    IUserRepository,
    UserRepository
>();

builder.Services.AddScoped<
    ICandidateProfileRepository,
    CandidateProfileRepository
>();

builder.Services.AddScoped<
    IJobRepository,
    JobRepository
>();

builder.Services.AddScoped<
    IAdminRepository,
    AdminRepository
>();

builder.Services.AddScoped<
    IJobApplicationRepository,
    JobApplicationRepository
>();

builder.Services.AddScoped<
    IInterviewRepository,
    InterviewRepository
>();

builder.Services.AddScoped<
    IInterviewFeedbackRepository,
    InterviewFeedbackRepository
>();

builder.Services.AddScoped<
    ICandidateInterviewFeedbackRepository,
    CandidateInterviewFeedbackRepository
>();

// Application services
builder.Services.AddScoped<
    IJwtTokenGenerator,
    JwtTokenGenerator
>();

builder.Services.AddScoped<
    IAuthService,
    AuthService
>();

builder.Services.AddScoped<
    ICandidateProfileService,
    CandidateProfileService
>();

builder.Services.AddScoped<
    IJobService,
    JobService
>();

builder.Services.AddScoped<
    IAdminService,
    AdminService
>();

builder.Services.AddScoped<
    IJobApplicationService,
    JobApplicationService
>();

builder.Services.AddScoped<
    IInterviewService,
    InterviewService
>();

builder.Services.AddScoped<
    IInterviewFeedbackService,
    InterviewFeedbackService
>();

builder.Services.AddScoped<
    ICandidateInterviewFeedbackService,
    CandidateInterviewFeedbackService
>();

builder.Services.AddScoped<
    IEmailService,
    EmailService
>();

// Dashboard service
builder.Services.AddScoped<
    IDashboardService,
    DashboardService
>();
builder.Services.AddScoped<
    ICandidateEducationRepository,
    CandidateEducationRepository>();

builder.Services.AddScoped<
    ICandidateEducationService,
    CandidateEducationService>();

builder.Services.AddScoped<
    ICandidateExperienceRepository,
    CandidateExperienceRepository>();

builder.Services.AddScoped<
    ICandidateExperienceService,
    CandidateExperienceService>();
builder.Services.AddScoped<
    IRecruiterProfileRepository,
    RecruiterProfileRepository>();

builder.Services.AddScoped<
    IRecruiterProfileService,
    RecruiterProfileService>();
// Controllers
builder.Services.AddControllers();
builder.Services.AddScoped<
    IAuditLogService, AuditLogService>();
// JWT settings
string jwtKey =
    builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException(
        "JWT key is missing."
    );

string jwtIssuer =
    builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException(
        "JWT issuer is missing."
    );

string jwtAudience =
    builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException(
        "JWT audience is missing."
    );

// JWT authentication
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = jwtIssuer,
                ValidAudience = jwtAudience,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            jwtKey
                        )
                    ),

                ClockSkew = TimeSpan.Zero
            };
    });

builder.Services.AddAuthorization();

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc(
        "v1",
        new OpenApiInfo
        {
            Title = "ApexHire API",
            Version = "v1",
            Description =
                "Recruitment and talent management platform API"
        }
    );

    options.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description =
                "Enter the JWT token received after login."
        }
    );

    options.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference =
                        new OpenApiReference
                        {
                            Type =
                                ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                },
                Array.Empty<string>()
            }
        }
    );
});

var app = builder.Build();

// Apply database migrations and seed demo data
using (IServiceScope scope =
       app.Services.CreateScope())
{
    ApplicationDbContext context =
        scope.ServiceProvider
            .GetRequiredService<
                ApplicationDbContext
            >();

    await context.Database.MigrateAsync();
    await DataSeeder.SeedAsync(context);
}

// Serve React frontend files
app.UseDefaultFiles();
app.UseStaticFiles();

// Swagger is available during development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS must run before authentication and authorization
app.UseCors("AllowFrontend");

// Authentication must be before authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();