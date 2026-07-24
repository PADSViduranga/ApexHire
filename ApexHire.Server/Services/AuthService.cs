using ApexHire.Server.DTOs;
using ApexHire.Server.Enums;
using ApexHire.Server.Interfaces;
using ApexHire.Server.Models;
using Microsoft.AspNetCore.Identity;

namespace ApexHire.Server.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IEmailService _emailService;
    private readonly PasswordHasher<User> _passwordHasher;

    public AuthService(
        IUserRepository userRepository,
        IJwtTokenGenerator jwtTokenGenerator,
        IEmailService emailService)
    {
        _userRepository = userRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
        _emailService = emailService;
        _passwordHasher = new PasswordHasher<User>();
    }

    public async Task<ApiResponse<AuthResponse>> RegisterAsync(
        RegisterRequest request)
    {
        string normalizedEmail = request.Email
            .Trim()
            .ToLowerInvariant();

        bool emailExists = await _userRepository
            .EmailExistsAsync(normalizedEmail);

        if (emailExists)
        {
            return ApiResponse<AuthResponse>.Failed(
                "An account with this email already exists.");
        }

        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = normalizedEmail,
            Role = UserRole.Candidate,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        user.PasswordHash = _passwordHasher.HashPassword(
            user,
            request.Password);

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        // Send welcome email
        try
        {
            await _emailService.SendEmailAsync(
                user.Email,
                "Welcome to ApexHire",
                $"""
                <h2>Welcome to ApexHire!</h2>

                <p>Dear <strong>{user.FullName}</strong>,</p>

                <p>Your account has been created successfully.</p>

                <p>You can now:</p>

                <ul>
                    <li>Complete your candidate profile</li>
                    <li>Browse available jobs</li>
                    <li>Apply for jobs</li>
                    <li>Track your applications</li>
                </ul>

                <p>Thank you for choosing ApexHire.</p>

                <br/>

                <p><strong>ApexHire Team</strong></p>
                """);
        }
        catch
        {
            // Registration succeeds even if email sending fails.
        }

        var response = CreateAuthResponse(user);

        return ApiResponse<AuthResponse>.Succeeded(
            response,
            "Registration completed successfully.");
    }

    public async Task<ApiResponse<AuthResponse>> LoginAsync(
        LoginRequest request)
    {
        string normalizedEmail = request.Email
            .Trim()
            .ToLowerInvariant();

        User? user = await _userRepository
            .GetByEmailAsync(normalizedEmail);

        if (user is null)
        {
            return ApiResponse<AuthResponse>.Failed(
                "Invalid email or password.");
        }

        if (!user.IsActive)
        {
            return ApiResponse<AuthResponse>.Failed(
                "This account has been deactivated.");
        }

        PasswordVerificationResult passwordResult =
            _passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                request.Password);

        if (passwordResult == PasswordVerificationResult.Failed)
        {
            return ApiResponse<AuthResponse>.Failed(
                "Invalid email or password.");
        }

        var response = CreateAuthResponse(user);

        return ApiResponse<AuthResponse>.Succeeded(
            response,
            "Login successful.");
    }

    private AuthResponse CreateAuthResponse(User user)
    {
        return new AuthResponse
        {
            Token = _jwtTokenGenerator.GenerateToken(user),
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString(),
            ExpiresAt = _jwtTokenGenerator.GetExpirationTime()
        };
    }
}