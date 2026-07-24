export const ANALYTICS_PERIOD_OPTIONS = [
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
];

export const ANALYTICS_GROUP_BY_OPTIONS = [
    {
        value: "day",
        label: "Daily",
    },
    {
        value: "week",
        label: "Weekly",
    },
    {
        value: "month",
        label: "Monthly",
    },
];

export const DEFAULT_ANALYTICS_FILTERS = {
    period: "30days",
    fromDate: "",
    toDate: "",
    groupBy: "day",
    organizationId: "",
    departmentId: "",
    recruiterId: "",
    jobId: "",
};

export const EMPTY_ANALYTICS_SUMMARY = {
    totalApplications: 0,
    totalInterviews: 0,
    totalOffers: 0,
    totalHires: 0,

    applicationGrowthRate: 0,
    interviewConversionRate: 0,
    offerAcceptanceRate: 0,
    hiringConversionRate: 0,

    averageTimeToInterviewDays: 0,
    averageTimeToOfferDays: 0,
    averageTimeToHireDays: 0,

    activeJobs: 0,
    closedJobs: 0,
    totalRecruiters: 0,
    totalCandidates: 0,
};

export const EMPTY_ANALYTICS_DATA = {
    summary: {
        ...EMPTY_ANALYTICS_SUMMARY,
    },

    applicationPerformance: [],
    hiringVelocity: [],
    conversionRates: [],
    sourcePerformance: [],
    departmentPerformance: [],
    recruiterPerformance: [],
    jobPerformance: [],
    insights: [],

    generatedAt: null,
    formattedGeneratedAt: "—",
};

export const ANALYTICS_DATE_FORMAT_OPTIONS = {
    year: "numeric",
    month: "short",
    day: "2-digit",
};

export const ANALYTICS_DATETIME_FORMAT_OPTIONS = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
};

export const ANALYTICS_PERCENTAGE_DECIMALS = 1;

export const ANALYTICS_MAX_TABLE_ROWS = 10;

export const ANALYTICS_INSIGHT_SEVERITIES = {
    INFO: "info",
    SUCCESS: "success",
    WARNING: "warning",
    ERROR: "error",
};
