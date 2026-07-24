import axiosClient from "../api/axiosClient";

function unwrapResponse(response) {
    return response?.data?.data ?? response?.data;
}

function unwrapList(response) {
    const data = unwrapResponse(response);

    return Array.isArray(data)
        ? data
        : [];
}

function buildQueryString(filters = {}) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            params.append(key, value);
        }
    });

    const queryString = params.toString();

    return queryString
        ? `?${queryString}`
        : "";
}

const hiringManagerService = {
    /*
     * =========================================================
     * JOB APPLICATIONS
     * =========================================================
     */

    async getDepartmentApplications() {
        const response = await axiosClient.get(
            "/api/job-applications/department"
        );

        return unwrapList(response);
    },

    async updateApplicationStatus(
        applicationId,
        status
    ) {
        if (!applicationId) {
            throw new Error(
                "Application ID is required."
            );
        }

        if (!status) {
            throw new Error(
                "Application status is required."
            );
        }

        const response = await axiosClient.put(
            `/api/job-applications/${applicationId}/status`,
            {
                status
            }
        );

        return unwrapResponse(response);
    },

    /*
     * =========================================================
     * INTERVIEWS
     * =========================================================
     */

    async getDepartmentInterviews() {
        const response = await axiosClient.get(
            "/api/interviews/department"
        );

        return unwrapList(response);
    },

    async scheduleInterview(interviewData) {
        if (!interviewData) {
            throw new Error(
                "Interview details are required."
            );
        }

        const response = await axiosClient.post(
            "/api/interviews",
            interviewData
        );

        return unwrapResponse(response);
    },

    async updateInterviewStatus(
        interviewId,
        status
    ) {
        if (!interviewId) {
            throw new Error(
                "Interview ID is required."
            );
        }

        if (!status) {
            throw new Error(
                "Interview status is required."
            );
        }

        const response = await axiosClient.put(
            `/api/interviews/${interviewId}/status`,
            {
                status
            }
        );

        return unwrapResponse(response);
    },

    async rescheduleInterview(
        interviewId,
        rescheduleData
    ) {
        if (!interviewId) {
            throw new Error(
                "Interview ID is required."
            );
        }

        if (!rescheduleData) {
            throw new Error(
                "Reschedule details are required."
            );
        }

        const response = await axiosClient.put(
            `/api/interviews/${interviewId}/reschedule`,
            rescheduleData
        );

        return unwrapResponse(response);
    },

    /*
     * =========================================================
     * CANDIDATE INTERVIEW FEEDBACK
     * =========================================================
     */

    async getCandidateFeedback() {
        const response = await axiosClient.get(
            "/api/candidate-interview-feedback"
        );

        return unwrapList(response);
    },

    async getCandidateFeedbackById(feedbackId) {
        if (!feedbackId) {
            throw new Error(
                "Feedback ID is required."
            );
        }

        const response = await axiosClient.get(
            `/api/candidate-interview-feedback/${feedbackId}`
        );

        return unwrapResponse(response);
    },

    async deleteCandidateFeedback(feedbackId) {
        if (!feedbackId) {
            throw new Error(
                "Feedback ID is required."
            );
        }

        const response = await axiosClient.delete(
            `/api/candidate-interview-feedback/${feedbackId}`
        );

        return unwrapResponse(response);
    },

    /*
     * =========================================================
     * PUBLIC JOBS
     * =========================================================
     *
     * HiringManager cannot use GET /api/jobs/mine because your
     * backend currently allows only the Recruiter role.
     *
     * This method uses the public job search endpoint instead.
     */

    async searchJobs(filters = {}) {
        const queryString =
            buildQueryString(filters);

        const response = await axiosClient.get(
            `/api/jobs${queryString}`
        );

        const data = unwrapResponse(response);

        return data ?? {
            items: [],
            totalCount: 0,
            pageNumber: 1,
            pageSize: 10,
            totalPages: 0
        };
    },

    async getJobById(jobId) {
        if (!jobId) {
            throw new Error(
                "Job ID is required."
            );
        }

        const response = await axiosClient.get(
            `/api/jobs/${jobId}`
        );

        return unwrapResponse(response);
    },

    /*
     * =========================================================
     * DASHBOARD
     * =========================================================
     *
     * The backend does not currently have a separate dashboard
     * endpoint, so dashboard statistics are calculated from:
     *
     * - Department applications
     * - Department interviews
     * - Candidate interview feedback
     */

    async getDashboardData() {
        const results = await Promise.allSettled([
            this.getDepartmentApplications(),
            this.getDepartmentInterviews(),
            this.getCandidateFeedback()
        ]);

        const applications =
            results[0].status === "fulfilled"
                ? results[0].value
                : [];

        const interviews =
            results[1].status === "fulfilled"
                ? results[1].value
                : [];

        const feedback =
            results[2].status === "fulfilled"
                ? results[2].value
                : [];

        const countByStatus = (
            collection,
            targetStatus
        ) => {
            const normalizedTarget = String(
                targetStatus
            )
                .replace(/\s+/g, "")
                .toLowerCase();

            return collection.filter(item => {
                const normalizedStatus = String(
                    item?.status ?? ""
                )
                    .replace(/\s+/g, "")
                    .toLowerCase();

                return normalizedStatus ===
                    normalizedTarget;
            }).length;
        };

        const upcomingInterviews =
            interviews
                .filter(interview => {
                    const dateValue =
                        interview.scheduledAt ??
                        interview.interviewDate ??
                        interview.startTime ??
                        interview.date;

                    if (!dateValue) {
                        return false;
                    }

                    const interviewDate =
                        new Date(dateValue);

                    return (
                        !Number.isNaN(
                            interviewDate.getTime()
                        ) &&
                        interviewDate >= new Date()
                    );
                })
                .sort((first, second) => {
                    const firstDate = new Date(
                        first.scheduledAt ??
                        first.interviewDate ??
                        first.startTime ??
                        first.date
                    );

                    const secondDate = new Date(
                        second.scheduledAt ??
                        second.interviewDate ??
                        second.startTime ??
                        second.date
                    );

                    return (
                        firstDate.getTime() -
                        secondDate.getTime()
                    );
                });

        const recentApplications =
            [...applications]
                .sort((first, second) => {
                    const firstDate = new Date(
                        first.appliedAt ??
                        first.createdAt ??
                        0
                    );

                    const secondDate = new Date(
                        second.appliedAt ??
                        second.createdAt ??
                        0
                    );

                    return (
                        secondDate.getTime() -
                        firstDate.getTime()
                    );
                })
                .slice(0, 5);

        return {
            statistics: {
                totalApplications:
                    applications.length,

                submitted:
                    countByStatus(
                        applications,
                        "Submitted"
                    ),

                underReview:
                    countByStatus(
                        applications,
                        "UnderReview"
                    ),

                shortlisted:
                    countByStatus(
                        applications,
                        "Shortlisted"
                    ),

                interviewScheduled:
                    countByStatus(
                        applications,
                        "InterviewScheduled"
                    ),

                offered:
                    countByStatus(
                        applications,
                        "Offered"
                    ),

                hired:
                    countByStatus(
                        applications,
                        "Hired"
                    ),

                rejected:
                    countByStatus(
                        applications,
                        "Rejected"
                    ),

                totalInterviews:
                    interviews.length,

                upcomingInterviews:
                    upcomingInterviews.length,

                totalFeedback:
                    feedback.length
            },

            applications,
            interviews,
            feedback,
            recentApplications,
            upcomingInterviews:
                upcomingInterviews.slice(0, 5),

            errors: {
                applications:
                    results[0].status === "rejected"
                        ? results[0].reason
                        : null,

                interviews:
                    results[1].status === "rejected"
                        ? results[1].reason
                        : null,

                feedback:
                    results[2].status === "rejected"
                        ? results[2].reason
                        : null
            }
        };
    }
};

export default hiringManagerService;
