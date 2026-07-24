import axiosClient from "../api/axiosClient";

const BASE_URL = "/admin/reports";

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

async function getReports(
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

async function exportReport(
    format,
    filters = {}
) {
    const normalizedFormat =
        String(format || "")
            .trim()
            .toLowerCase();

    const response =
        await axiosClient.get(
            `${BASE_URL}/export`,
            {
                params: {
                    ...buildQueryParams(
                        filters
                    ),
                    format:
                        normalizedFormat,
                },
                responseType: "blob",
            }
        );

    const contentDisposition =
        response.headers[
            "content-disposition"
        ];

    const matchedFileName =
        contentDisposition?.match(
            /filename="?([^"]+)"?/i
        );

    const defaultExtension =
        normalizedFormat === "excel"
            ? "xlsx"
            : normalizedFormat;

    const fileName =
        matchedFileName?.[1] ||
        `apexhire-report.${defaultExtension}`;

    const downloadUrl =
        window.URL.createObjectURL(
            response.data
        );

    const link =
        document.createElement("a");

    link.href = downloadUrl;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(
        downloadUrl
    );
}

const adminReportService = {
    getReports,
    exportReport,
};

export default adminReportService;
