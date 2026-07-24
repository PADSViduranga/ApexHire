using ApexHire.Server.DTOs;

namespace ApexHire.Server.Interfaces;

public interface IAuthService
{
    Task<ApiResponse<AuthResponse>> RegisterAsync(
        RegisterRequest request);

    Task<ApiResponse<AuthResponse>> LoginAsync(
        LoginRequest request);
}