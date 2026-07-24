import {
    EMPTY_REPORT_DATA,
    EMPTY_REPORT_SUMMARY,
} from "./adminReportConstants";

import {
    formatDate,
    formatDateTime,
    getSafeNumber,
} from "./adminReportHelpers";

function mapSummary(
    source = {}
) {
    return {
        ...EMPTY_REPORT_SUMMARY,

        totalUsers:
            getSafeNumber(
                source.totalUsers
            ),

        totalCandidates:
            getSafeNumber(
                source.totalCandidates
            ),

        totalRecruiters:
            getSafeNumber(
                source.totalRecruiters
            ),

        totalHiringManagers:
            getSafeNumber(
                source.totalHiringManagers
            ),

        totalJobs:
            getSafeNumber(
                source.totalJobs
            ),

        activeJobs:
            getSafeNumber(
                source.activeJobs
            ),

        closedJobs:
            getSafeNumber(
                source.closedJobs
            ),

        totalApplications:
            getSafeNumber(
                source.totalApplications
            ),

        shortlistedApplications:
            getSafeNumber(
                source.shortlistedApplications
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
                source.hires
            ),

        rejectedApplications:
            getSafeNumber(
                source.rejectedApplications
            ),

        averageTimeToHireDays:
            getSafeNumber(
                source.averageTimeToHireDays
            ),

        hiringSuccessRate:
            getSafeNumber(
                source.hiringSuccessRate
            ),

        totalUsersChange:
            getSafeNumber(
                source.totalUsersChange
            ),

        totalJobsChange:
            getSafeNumber(
                source.totalJobsChange
            ),

        totalApplicationsChange:
            getSafeNumber(
                source.totalApplicationsChange
            ),

        hiresChange:
            getSafeNumber(
                source.hiresChange
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

function mapDistributionItem(
    source = {}
) {
    return {
        label:
            source.label ??
            source.name ??
            source.status ??
            source.role ??
            "Unknown",

        value:
            getSafeNumber(
                source.value ??
                source.count
            ),
    };
}

function mapHiringFunnelItem(
    source = {}
) {
    return {
        stage:
            source.stage ??
            source.label ??
            "Unknown",

        value:
            getSafeNumber(
                source.value ??
                source.count
            ),

        percentage:
            getSafeNumber(
                source.percentage
            ),
    };
}

function mapTopJob(
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

        recruiter:
            source.recruiter ??
            source.recruiterName ??
            "—",

        applications:
            getSafeNumber(
                source.applications ??
                source.applicationCount
            ),

        shortlisted:
            getSafeNumber(
                source.shortlisted ??
                source.shortlistedCount
            ),

        hires:
            getSafeNumber(
                source.hires ??
                source.hiredCount
            ),

        status:
            source.status ??
            "Unknown",
    };
}

function mapTopRecruiter(
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

        jobsPosted:
            getSafeNumber(
                source.jobsPosted ??
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

        hires:
            getSafeNumber(
                source.hires ??
                source.hiredCount
            ),

        successRate:
            getSafeNumber(
                source.successRate
            ),
    };
}

function mapTopOrganization(
    source = {}
) {
    return {
        id:
            source.id ??
            source.organizationId ??
            null,

        name:
            source.name ??
            source.organizationName ??
            "Unknown Organization",

        activeJobs:
            getSafeNumber(
                source.activeJobs
            ),

        totalJobs:
            getSafeNumber(
                source.totalJobs ??
                source.jobCount
            ),

        applications:
            getSafeNumber(
                source.applications ??
                source.applicationCount
            ),

        hires:
            getSafeNumber(
                source.hires ??
                source.hiredCount
            ),
    };
}

function mapRecentActivity(
    source = {}
) {
    const createdAt =
        source.createdAt ??
        source.timestamp ??
        null;

    return {
        id:
            source.id ??
            null,

        type:
            source.type ??
            source.action ??
            "Activity",

        title:
            source.title ??
            source.description ??
            "System activity",

        description:
            source.description ??
            "",

        userName:
            source.userName ??
            source.actorName ??
            "System",

        createdAt,

        formattedCreatedAt:
            formatDateTime(
                createdAt
            ),
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

export function mapAdminReport(
    source = {}
) {
    const data =
        source.data ??
        source;

    return {
        ...EMPTY_REPORT_DATA,

        summary:
            mapSummary(
                data.summary
            ),

        applicationTrend:
            mapArray(
                data.applicationTrend,
                mapTrendItem
            ),

        jobTrend:
            mapArray(
                data.jobTrend,
                mapTrendItem
            ),

        userDistribution:
            mapArray(
                data.userDistribution,
                mapDistributionItem
            ),

        applicationStatusDistribution:
            mapArray(
                data.applicationStatusDistribution,
                mapDistributionItem
            ),

        hiringFunnel:
            mapArray(
                data.hiringFunnel,
                mapHiringFunnelItem
            ),

        topJobs:
            mapArray(
                data.topJobs,
                mapTopJob
            ),

        topRecruiters:
            mapArray(
                data.topRecruiters,
                mapTopRecruiter
            ),

        topOrganizations:
            mapArray(
                data.topOrganizations,
                mapTopOrganization
            ),

        recentActivities:
            mapArray(
                data.recentActivities,
                mapRecentActivity
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
