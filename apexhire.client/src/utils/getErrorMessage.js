export default function getErrorMessage(
    error,
    fallbackMessage =
        "Something went wrong."
) {
    const responseData =
        error?.response?.data;

    if (typeof responseData === "string") {
        return responseData;
    }

    if (responseData?.message) {
        return responseData.message;
    }

    if (responseData?.title) {
        const validationErrors =
            responseData.errors;

        if (validationErrors) {
            const messages =
                Object.values(
                    validationErrors
                )
                    .flat()
                    .join("\n");

            return messages ||
                responseData.title;
        }

        return responseData.title;
    }

    if (
        error instanceof Error &&
        error.message
    ) {
        return error.message;
    }

    return fallbackMessage;
}