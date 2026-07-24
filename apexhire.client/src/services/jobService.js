import axiosClient from "../api/axiosClient";

function addValue(params, key, value) {
    if (
        value !== "" &&
        value !== null &&
        value !== undefined
    ) {
        params[key] = value;
    }
}

function validateJobId(jobId) {
    if (!jobId) {
        throw new Error("A job ID is required.");
    }
}

const jobService = {
    async searchJobs(filters = {}) {
        const params = {};

        if (filters.title?.trim()) {
            params.title = filters.title.trim();
        }

        if (filters.location?.trim()) {
            params.location = filters.location.trim();
        }

        addValue(
            params,
            "employmentType",
            filters.employmentType
        );

        addValue(
            params,
            "minimumSalary",
            filters.minimumSalary
        );

        addValue(
            params,
            "maximumSalary",
            filters.maximumSalary
        );

        addValue(
            params,
            "organizationId",
            filters.organizationId
        );

        addValue(
            params,
            "page",
            filters.page
        );

        addValue(
            params,
            "pageSize",
            filters.pageSize
        );

        const response = await axiosClient.get(
            "/api/jobs",
            {
                params
            }
        );

        return response.data;
    },

    async getJobById(jobId) {
        validateJobId(jobId);

        const response = await axiosClient.get(
            `/api/jobs/${jobId}`
        );

        return response.data;
    },

    async getMyJobs() {
        const response = await axiosClient.get(
            "/api/jobs/mine"
        );

        return response.data;
    },

    async createJob(payload) {
        const response = await axiosClient.post(
            "/api/jobs",
            payload
        );

        return response.data;
    },

    async updateJob(jobId, payload) {
        validateJobId(jobId);

        const response = await axiosClient.put(
            `/api/jobs/${jobId}`,
            payload
        );

        return response.data;
    },

    async updateJobStatus(jobId, status) {
        validateJobId(jobId);

        if (!status) {
            throw new Error("A job status is required.");
        }

        const response = await axiosClient.put(
            `/api/jobs/${jobId}/status`,
            {
                status
            }
        );

        return response.data;
    },

    async deleteJob(jobId) {
        validateJobId(jobId);

        const response = await axiosClient.delete(
            `/api/jobs/${jobId}`
        );

        return response.data;
    }
};

export default jobService;