import axiosClient from "../api/axiosClient";

function createFormData(file) {
    const formData = new FormData();

    formData.append("file", file);

    return formData;
}

function unwrapResponse(response) {
    const responseBody = response.data;

    if (responseBody?.success === false) {
        throw new Error(
            responseBody.message || "The request failed."
        );
    }

    return responseBody?.data ?? responseBody;
}

function getFileName(disposition) {
    if (!disposition) {
        return "resume";
    }

    const encodedMatch = disposition.match(
        /filename\*=UTF-8''([^;]+)/i
    );

    if (encodedMatch?.[1]) {
        try {
            return decodeURIComponent(
                encodedMatch[1].replace(/["']/g, "")
            );
        }
        catch {
            return encodedMatch[1].replace(/["']/g, "");
        }
    }

    const normalMatch = disposition.match(
        /filename="?([^";]+)"?/i
    );

    return normalMatch?.[1]?.trim() || "resume";
}

const candidateProfileService = {
    async getProfile() {
        const response = await axiosClient.get(
            "/api/candidate-profile"
        );

        return unwrapResponse(response);
    },

    async updateProfile(profileData) {
        const response = await axiosClient.put(
            "/api/candidate-profile",
            profileData
        );

        return unwrapResponse(response);
    },

    async uploadProfilePhoto(file) {
        const response = await axiosClient.post(
            "/api/candidate-profile/profile-photo",
            createFormData(file)
        );

        return unwrapResponse(response);
    },

    async uploadCoverPhoto(file) {
        const response = await axiosClient.post(
            "/api/candidate-profile/cover-photo",
            createFormData(file)
        );

        return unwrapResponse(response);
    },

    async uploadResume(file) {
        const response = await axiosClient.post(
            "/api/candidate-profile/resume",
            createFormData(file)
        );

        return unwrapResponse(response);
    },

    async downloadResume() {
        const response = await axiosClient.get(
            "/api/candidate-profile/resume",
            {
                responseType: "blob"
            }
        );

        const disposition =
            response.headers["content-disposition"];

        const fileName = getFileName(disposition);

        const fileUrl = window.URL.createObjectURL(
            response.data
        );

        const link = document.createElement("a");

        try {
            link.href = fileUrl;
            link.download = fileName;

            document.body.appendChild(link);
            link.click();
        }
        finally {
            link.remove();
            window.URL.revokeObjectURL(fileUrl);
        }
    },

    async getEducations() {
        const response = await axiosClient.get(
            "/api/candidate-education"
        );

        return unwrapResponse(response);
    },

    async createEducation(educationData) {
        const response = await axiosClient.post(
            "/api/candidate-education",
            educationData
        );

        return unwrapResponse(response);
    },

    async updateEducation(id, educationData) {
        const response = await axiosClient.put(
            `/api/candidate-education/${id}`,
            educationData
        );

        return unwrapResponse(response);
    },

    async deleteEducation(id) {
        await axiosClient.delete(
            `/api/candidate-education/${id}`
        );
    },

    async getExperiences() {
        const response = await axiosClient.get(
            "/api/candidate-experience"
        );

        return unwrapResponse(response);
    },

    async createExperience(experienceData) {
        const response = await axiosClient.post(
            "/api/candidate-experience",
            experienceData
        );

        return unwrapResponse(response);
    },

    async updateExperience(id, experienceData) {
        const response = await axiosClient.put(
            `/api/candidate-experience/${id}`,
            experienceData
        );

        return unwrapResponse(response);
    },

    async deleteExperience(id) {
        await axiosClient.delete(
            `/api/candidate-experience/${id}`
        );
    }
};

export default candidateProfileService;