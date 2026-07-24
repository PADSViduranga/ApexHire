using ApexHire.Server.DTOs.Dashboard;

namespace ApexHire.Server.Services.Interfaces;

public interface IDashboardService
{
    Task<DashboardResponse> GetRecruiterDashboardAsync(
        int recruiterUserId);

    Task<DashboardResponse> GetHiringManagerDashboardAsync(
        int hiringManagerUserId);

    Task<DashboardResponse> GetAdminDashboardAsync();
}