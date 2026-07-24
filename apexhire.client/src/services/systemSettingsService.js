import axiosClient from "../api/axiosClient";

const BASE_URL = "/admin/system-settings";

async function getSettings(
    signal
) {
    const response =
        await axiosClient.get(
            BASE_URL,
            {
                signal,
            }
        );

    return response.data;
}

async function updateSettings(
    payload
) {
    const response =
        await axiosClient.put(
            BASE_URL,
            payload
        );

    return response.data;
}

async function testEmailConfiguration(
    payload
) {
    const response =
        await axiosClient.post(
            `${BASE_URL}/email/test`,
            payload
        );

    return response.data;
}

async function createBackup() {
    const response =
        await axiosClient.post(
            `${BASE_URL}/backup`
        );

    return response.data;
}

async function clearApplicationCache() {
    const response =
        await axiosClient.post(
            `${BASE_URL}/cache/clear`
        );

    return response.data;
}

async function getSystemInformation(
    signal
) {
    const response =
        await axiosClient.get(
            `${BASE_URL}/information`,
            {
                signal,
            }
        );

    return response.data;
}

const systemSettingsService = {
    getSettings,
    updateSettings,
    testEmailConfiguration,
    createBackup,
    clearApplicationCache,
    getSystemInformation,
};

export default systemSettingsService;
