import axiosClient from "../api/axiosClient";

const BASE_URL = "/admin/analytics";

function buildQueryParams(filters = {}) {
    const params = {};

    Object.entries(filters).forEach(
        ([key, value]) => {
            if (
                value !== undefined &&
                value !== null &&
                value !== ""
            ) {
                params[key] = value;
            }
        }
    );

    return params;
}

async function getAnalytics(
    filters = {},
    signal
) {
    const response =
        await axiosClient.get(
            BASE_URL,
            {
                params:
                    buildQueryParams(
                        filters
                    ),
                signal,
            }
        );

    return response.data;
}

const adminAnalyticsService = {
    getAnalytics,
};

export default adminAnalyticsService;
