namespace ApexHire.Server.DTOs.Dashboard;

public class DashboardResponse
{
    public DashboardSummaryDto Summary { get; set; } =
        new();

    public List<DashboardStatusItemDto>
        ApplicationStatuses
    {
        get;
        set;
    } = [];

    public List<DashboardStatusItemDto>
        InterviewStatuses
    {
        get;
        set;
    } = [];

    public List<RecentApplicationDto>
        RecentApplications
    {
        get;
        set;
    } = [];

    public List<UpcomingInterviewDto>
        UpcomingInterviews
    {
        get;
        set;
    } = [];
}

public class DashboardSummaryDto
{
    public int TotalJobs { get; set; }

    public int ActiveJobs { get; set; }

    public int TotalApplications { get; set; }

    public int ApplicationsToday { get; set; }

    public int PendingApplications { get; set; }

    public int ShortlistedCandidates { get; set; }

    public int HiredCandidates { get; set; }

    public int TotalInterviews { get; set; }

    public int InterviewsToday { get; set; }

    public int UpcomingInterviews { get; set; }

    public int CompletedInterviews { get; set; }

    public int CancelledInterviews { get; set; }

    public int TotalUsers { get; set; }

    public int ActiveUsers { get; set; }

    public int Candidates { get; set; }

    public int Recruiters { get; set; }

    public int HiringManagers { get; set; }

    public int Administrators { get; set; }

    public int Organizations { get; set; }

    public int Departments { get; set; }
}

public class DashboardStatusItemDto
{
    public string Status { get; set; } =
        string.Empty;

    public int Count { get; set; }
}

public class RecentApplicationDto
{
    public int ApplicationId { get; set; }

    public string CandidateName { get; set; } =
        string.Empty;

    public string JobTitle { get; set; } =
        string.Empty;

    public string Status { get; set; } =
        string.Empty;

    public decimal MatchScore { get; set; }

    public DateTime AppliedAt { get; set; }
}

public class UpcomingInterviewDto
{
    public int InterviewId { get; set; }

    public string CandidateName { get; set; } =
        string.Empty;

    public string JobTitle { get; set; } =
        string.Empty;

    public DateTime ScheduledAt { get; set; }

    public int DurationMinutes { get; set; }

    public string? Location { get; set; }

    public string? MeetingUrl { get; set; }

    public string Status { get; set; } =
        string.Empty;
}