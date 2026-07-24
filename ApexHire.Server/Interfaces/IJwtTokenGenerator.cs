using ApexHire.Server.Models;

namespace ApexHire.Server.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);

    DateTime GetExpirationTime();
}