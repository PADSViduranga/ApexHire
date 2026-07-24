import axiosClient from "../api/axiosClient";

const BASE_URL = "/admin/profile";

async function getProfile(signal) {
    const response =
        await axiosClient.get(
            BASE_URL,
            {
                signal,
            }
        );

    return response.data;
}

async function updateProfile(
    payload
) {
    const response =
        await axiosClient.put(
            BASE_URL,
            payload
        );

    return response.data;
}

async function uploadProfileImage(
    file,
    onUploadProgress
) {
    const formData =
        new FormData();

    formData.append(
        "file",
        file
    );

    const response =
        await axiosClient.post(
            `${BASE_URL}/image`,
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data",
                },
                onUploadProgress,
            }
        );

    return response.data;
}

async function removeProfileImage() {
    const response =
        await axiosClient.delete(
            `${BASE_URL}/image`
        );

    return response.data;
}

async function changePassword(
    payload
) {
    const response =
        await axiosClient.put(
            `${BASE_URL}/password`,
            payload
        );

    return response.data;
}

async function getActiveSessions(
    signal
) {
    const response =
        await axiosClient.get(
            `${BASE_URL}/sessions`,
            {
                signal,
            }
        );

    return response.data;
}

async function revokeSession(
    sessionId
) {
    const response =
        await axiosClient.delete(
            `${BASE_URL}/sessions/${encodeURIComponent(
                sessionId
            )}`
        );

    return response.data;
}

async function revokeOtherSessions() {
    const response =
        await axiosClient.delete(
            `${BASE_URL}/sessions`
        );

    return response.data;
}

async function getRecentActivity(
    limit,
    signal
) {
    const response =
        await axiosClient.get(
            `${BASE_URL}/activity`,
            {
                params: {
                    limit,
                },
                signal,
            }
        );

    return response.data;
}

const adminProfileService = {
    getProfile,
    updateProfile,
    uploadProfileImage,
    removeProfileImage,
    changePassword,
    getActiveSessions,
    revokeSession,
    revokeOtherSessions,
    getRecentActivity,
};

export default adminProfileService;
