import {
    EMPTY_ANALYTICS_DATA,
    EMPTY_ANALYTICS_SUMMARY,
} from "./adminAnalyticsConstants";

import {
    formatDate,
    formatDateTime,
    getSafeNumber,
} from "./adminAnalyticsHelpers";

function mapSummary(
    source = {}
) {
    return {
        ...EMPTY_ANALYTICS_SUMMARY,

        totalApplications:
            getSafeNumber(
                source.totalApplications
            ),

        totalInterviews:
            getSafeNumber(
                source.totalInterviews
            ),

        totalOffers:
            getSafeNumber(
                source.totalOffers
            ),

        totalHires:
            getSafeNumber(
                source.totalHires
            ),

        applicationGrowthRate:
            getSafeNumber(
                source.applicationGrowthRate
            ),

        interviewConversionRate:
            getSafeNumber(
                source.interviewConversionRate
            ),

        offerAcceptanceRate:
            getSafeNumber(
                source.offerAcceptanceRate
            ),

        hiringConversionRate:
            getSafeNumber(
                source.hiringConversionRate
            ),

        averageTimeToInterviewDays:
            getSafeNumber(
                source.averageTimeToInterviewDays
            ),

        averageTimeToOfferDays:
            getSafeNumber(
                source.averageTimeToOfferDays
            ),

        averageTimeToHireDays:
            getSafeNumber(
                source.averageTimeToHireDays
            ),

        activeJobs:
            getSafeNumber(
                source.activeJobs
            ),

        closedJobs:
            getSafeNumber(
                source.closedJobs
            ),

        totalRecruiters:
            getSafeNumber(
                source.totalRecruiters
            ),

        totalCandidates:
            getSafeNumber(
                source.totalCandidates
            ),
    };
}

function mapTrendItem(
    source = {}
) {
    const date =
        source.date ??
        source.period ??
        source.label ??
        null;

    return {
        date,

        label:
            source.label ??
            formatDate(date),

        value:
            getSafeNumber(
                source.value ??
                source.count
            ),
    };
}

function mapHiringVelocityItem(
    source = {}
) {
    const date =
        source.date ??
        source.period ??
        source.label ??
        null;

    return {
        date,

        label:
            source.label ??
            formatDate(date),

        interviewDays:
            getSafeNumber(
                source.interviewDays ??
                source.averageTimeToInterviewDays
            ),

        offerDays:
            getSafeNumber(
                source.offerDays ??
                source.averageTimeToOfferDays
            ),

        hireDays:
            getSafeNumber(
                source.hireDays ??
                source.averageTimeToHireDays
            ),
    };
}

function mapConversionRateItem(
    source = {}
) {
    return {
        label:
            source.label ??
            source.stage ??
            source.name ??
            "Unknown",

        value:
            getSafeNumber(
                source.value ??
                source.rate ??
                source.percentage
            ),
    };
}

function mapSourcePerformanceItem(
    source = {}
) {
    return {
        source:
            source.source ??
            source.name ??
            source.label ??
            "Unknown",

        applications:
            getSafeNumber(
                source.applications ??
                source.applicationCount
            ),

        interviews:
            getSafeNumber(
                source.interviews ??
                source.interviewCount
            ),

        hires:
            getSafeNumber(
                source.hires ??
                source.hireCount
            ),

        conversionRate:
            getSafeNumber(
                source.conversionRate
            ),
    };
}

function mapDepartmentPerformanceItem(
    source = {}
) {
    return {
        departmentId:
            source.departmentId ??
            source.id ??
            null,

        department:
            source.department ??
            source.departmentName ??
            source.name ??
            "Unknown Department",

        applications:
            getSafeNumber(
                source.applications ??
                source.applicationCount
            ),

        interviews:
            getSafeNumber(
                source.interviews ??
                source.interviewCount
            ),

        offers:
            getSafeNumber(
                source.offers ??
                source.offerCount
            ),

        hires:
            getSafeNumber(
                source.hires ??
                source.hireCount
            ),

        averageTimeToHireDays:
            getSafeNumber(
                source.averageTimeToHireDays
            ),
    };
}

function mapRecruiterPerformanceItem(
    source = {}
) {
    return {
        id:
            source.id ??
            source.recruiterId ??
            null,

        name:
            source.name ??
            source.recruiterName ??
            "Unknown Recruiter",

        email:
            source.email ??
            null,

        jobsManaged:
            getSafeNumber(
                source.jobsManaged ??
                source.jobCount
            ),

        applicationsReviewed:
            getSafeNumber(
                source.applicationsReviewed
            ),

        interviewsScheduled:
            getSafeNumber(
                source.interviewsScheduled
            ),

        offersMade:
            getSafeNumber(
                source.offersMade
            ),

        hires:
            getSafeNumber(
                source.hires ??
                source.hireCount
            ),

        conversionRate:
            getSafeNumber(
                source.conversionRate
            ),

        averageTimeToHireDays:
            getSafeNumber(
                source.averageTimeToHireDays
            ),
    };
}

function mapJobPerformanceItem(
    source = {}
) {
    return {
        id:
            source.id ??
            source.jobId ??
            null,

        title:
            source.title ??
            source.jobTitle ??
            "Untitled Job",

        organization:
            source.organization ??
            source.organizationName ??
            "—",

        department:
            source.department ??
            source.departmentName ??
            "—",

        applications:
            getSafeNumber(
                source.applications ??
                source.applicationCount
            ),

        interviews:
            getSafeNumber(
                source.interviews ??
                source.interviewCount
            ),

        offers:
            getSafeNumber(
                source.offers ??
                source.offerCount
            ),

        hires:
            getSafeNumber(
                source.hires ??
                source.hireCount
            ),

        conversionRate:
            getSafeNumber(
                source.conversionRate
            ),

        averageTimeToHireDays:
            getSafeNumber(
                source.averageTimeToHireDays
            ),

        status:
            source.status ??
            "Unknown",
    };
}

function mapInsight(
    source = {}
) {
    return {
        id:
            source.id ??
            null,

        title:
            source.title ??
            "Analytics Insight",

        description:
            source.description ??
            source.message ??
            "",

        severity:
            source.severity ??
            source.type ??
            "info",

        metric:
            source.metric ??
            null,

        value:
            source.value ??
            null,
    };
}

function mapArray(
    items,
    mapper
) {
    if (!Array.isArray(items)) {
        return [];
    }

    return items.map(mapper);
}

export function mapAdminAnalytics(
    source = {}
) {
    const data =
        source.data ??
        source;

    return {
        ...EMPTY_ANALYTICS_DATA,

        summary:
            mapSummary(
                data.summary
            ),

        applicationPerformance:
            mapArray(
                data.applicationPerformance,
                mapTrendItem
            ),

        hiringVelocity:
            mapArray(
                data.hiringVelocity,
                mapHiringVelocityItem
            ),

        conversionRates:
            mapArray(
                data.conversionRates,
                mapConversionRateItem
            ),

        sourcePerformance:
            mapArray(
                data.sourcePerformance,
                mapSourcePerformanceItem
            ),

        departmentPerformance:
            mapArray(
                data.departmentPerformance,
                mapDepartmentPerformanceItem
            ),

        recruiterPerformance:
            mapArray(
                data.recruiterPerformance,
                mapRecruiterPerformanceItem
            ),

        jobPerformance:
            mapArray(
                data.jobPerformance,
                mapJobPerformanceItem
            ),

        insights:
            mapArray(
                data.insights,
                mapInsight
            ),

        generatedAt:
            data.generatedAt ??
            null,

        formattedGeneratedAt:
            formatDateTime(
                data.generatedAt
            ),
    };
}
