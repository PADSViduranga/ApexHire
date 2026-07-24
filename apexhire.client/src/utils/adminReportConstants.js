export const REPORT_PERIOD_OPTIONS = Object.freeze([
    {
        value: "7days",
        label: "Last 7 Days",
    },
    {
        value: "30days",
        label: "Last 30 Days",
    },
    {
        value: "90days",
        label: "Last 90 Days",
    },
    {
        value: "6months",
        label: "Last 6 Months",
    },
    {
        value: "12months",
        label: "Last 12 Months",
    },
    {
        value: "custom",
        label: "Custom Range",
    },
]);

export const REPORT_EXPORT_FORMATS = Object.freeze([
    {
        value: "pdf",
        label: "PDF",
    },
    {
        value: "excel",
        label: "Excel",
    },
    {
        value: "csv",
        label: "CSV",
    },
]);

export const APPLICATION_STATUS_OPTIONS = Object.freeze([
    {
        value: "",
        label: "All Statuses",
    },
    {
        value: "Submitted",
        label: "Submitted",
    },
    {
        value: "UnderReview",
        label: "Under Review",
    },
    {
        value: "Shortlisted",
        label: "Shortlisted",
    },
    {
        value: "InterviewScheduled",
        label: "Interview Scheduled",
    },
    {
        value: "Offered",
        label: "Offered",
    },
    {
        value: "Hired",
        label: "Hired",
    },
    {
        value: "Rejected",
        label: "Rejected",
    },
    {
        value: "Withdrawn",
        label: "Withdrawn",
    },
]);

export const DEFAULT_REPORT_FILTERS = Object.freeze({
    period: "30days",
    fromDate: "",
    toDate: "",
    organizationId: "",
    departmentId: "",
    recruiterId: "",
    jobId: "",
    applicationStatus: "",
});

export const EMPTY_REPORT_SUMMARY = Object.freeze({
    totalUsers: 0,
    totalCandidates: 0,
    totalRecruiters: 0,
    totalHiringManagers: 0,
    totalJobs: 0,
    activeJobs: 0,
    closedJobs: 0,
    totalApplications: 0,
    shortlistedApplications: 0,
    interviewsScheduled: 0,
    offersMade: 0,
    hires: 0,
    rejectedApplications: 0,
    averageTimeToHireDays: 0,
    hiringSuccessRate: 0,
});

export const EMPTY_REPORT_DATA = Object.freeze({
    summary: EMPTY_REPORT_SUMMARY,
    applicationTrend: [],
    jobTrend: [],
    userDistribution: [],
    applicationStatusDistribution: [],
    hiringFunnel: [],
    topJobs: [],
    topRecruiters: [],
    topOrganizations: [],
    recentActivities: [],
});

export const REPORT_PAGE_SIZES = Object.freeze([
    5,
    10,
    20,
]);

export const REPORT_DATE_FORMAT_OPTIONS = Object.freeze({
    year: "numeric",
    month: "short",
    day: "2-digit",
});

export const REPORT_DATETIME_FORMAT_OPTIONS = Object.freeze({
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
});
