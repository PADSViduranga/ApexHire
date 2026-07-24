import axiosClient from "../api/axiosClient";

const recruiterProfileService = {

    // =========================
    // Recruiter Profile
    // =========================

    async getProfile() {
        const response = await axiosClient.get(
            "/api/recruiter-profile"
        );

        return response.data.data ?? response.data;
    },

    async updateProfile(profile) {
        const response = await axiosClient.put(
            "/api/recruiter-profile",
            profile
        );

        return response.data.data ?? response.data;
    },

    // =========================
    // Applications
    // =========================

    async getDepartmentApplications() {
        const response = await axiosClient.get(
            "/api/job-applications/department"
        );

        return response.data.data ?? response.data;
    },

    async updateApplicationStatus(
        applicationId,
        status
    ) {
        const response = await axiosClient.put(
            `/api/job-applications/${applicationId}/status`,
            {
                status
            }
        );

        return response.data.data ?? response.data;
    },

    // =========================
    // Candidate Applications
    // =========================

    async getMyApplications() {
        const response = await axiosClient.get(
            "/api/job-applications/mine"
        );

        return response.data.data ?? response.data;
    },

    async withdrawApplication(
        applicationId
    ) {
        const response = await axiosClient.put(
            `/api/job-applications/${applicationId}/withdraw`
        );

        return response.data.data ?? response.data;
    },

    async applyForJob(
        jobPostId,
        coverLetter
    ) {
        const response = await axiosClient.post(
            "/api/job-applications",
            {
                jobPostId,
                coverLetter
            }
        );

        return response.data.data ?? response.data;
    },

    // =========================
    // Candidate Interview Feedback
    // =========================

    async getCandidateInterviewFeedback() {
        const response = await axiosClient.get(
            "/api/candidate-interview-feedback"
        );

        return response.data.data ?? response.data;
    },

    async getCandidateInterviewFeedbackById(
        feedbackId
    ) {
        const response = await axiosClient.get(
            `/api/candidate-interview-feedback/${feedbackId}`
        );

        return response.data.data ?? response.data;
    },

    async deleteCandidateInterviewFeedback(
        feedbackId
    ) {
        const response = await axiosClient.delete(
            `/api/candidate-interview-feedback/${feedbackId}`
        );

        return response.data.data ?? response.data;
    }
};

export default recruiterProfileService;