import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import systemSettingsService from "../services/systemSettingsService";

import {
    DEFAULT_SYSTEM_SETTINGS,
    EMPTY_SYSTEM_INFORMATION,
} from "../utils/systemSettingsConstants";

import {
    mapSystemSettings,
} from "../utils/systemSettingsMapper";

import {
    normalizeSystemSettings,
} from "../utils/systemSettingsHelpers";

import {
    hasSystemSettingsErrors,
    validateSystemSettings,
} from "../utils/systemSettingsValidation";

function getErrorMessage(
    error,
    fallback
) {
    if (
        error?.name === "CanceledError" ||
        error?.code === "ERR_CANCELED"
    ) {
        return "";
    }

    return (
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        error?.message ||
        fallback
    );
}

export default function useSystemSettings() {
    const abortControllerRef =
        useRef(null);

    const [
        settings,
        setSettings,
    ] = useState({
        ...DEFAULT_SYSTEM_SETTINGS,
    });

    const [
        systemInformation,
        setSystemInformation,
    ] = useState({
        ...EMPTY_SYSTEM_INFORMATION,
    });

    const [
        originalSettings,
        setOriginalSettings,
    ] = useState({
        ...DEFAULT_SYSTEM_SETTINGS,
    });

    const [
        validationErrors,
        setValidationErrors,
    ] = useState({});

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        isSaving,
        setIsSaving,
    ] = useState(false);

    const [
        isTestingEmail,
        setIsTestingEmail,
    ] = useState(false);

    const [
        isCreatingBackup,
        setIsCreatingBackup,
    ] = useState(false);

    const [
        isClearingCache,
        setIsClearingCache,
    ] = useState(false);

    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");

    const [
        error,
        setError,
    ] = useState("");

    const loadSettings =
        useCallback(async () => {
            abortControllerRef.current?.abort();

            const controller =
                new AbortController();

            abortControllerRef.current =
                controller;

            setIsLoading(true);
            setError("");

            try {
                const [
                    settingsResponse,
                    informationResponse,
                ] = await Promise.all([
                    systemSettingsService.getSettings(
                        controller.signal
                    ),
                    systemSettingsService.getSystemInformation(
                        controller.signal
                    ),
                ]);

                if (
                    controller.signal.aborted
                ) {
                    return;
                }

                const mapped =
                    mapSystemSettings({
                        settings:
                            settingsResponse,
                        systemInformation:
                            informationResponse,
                    });

                const normalized =
                    normalizeSystemSettings(
                        mapped.settings
                    );

                setSettings(
                    normalized
                );

                setOriginalSettings(
                    normalized
                );

                setSystemInformation(
                    mapped.systemInformation
                );
            } catch (requestError) {
                if (
                    controller.signal.aborted
                ) {
                    return;
                }

                setError(
                    getErrorMessage(
                        requestError,
                        "Unable to load system settings."
                    )
                );
            } finally {
                if (
                    !controller.signal.aborted
                ) {
                    setIsLoading(
                        false
                    );
                }
            }
        }, []);

    useEffect(() => {
        loadSettings();

        return () =>
            abortControllerRef.current?.abort();
    }, [loadSettings]);

    const updateField =
        useCallback(
            (
                name,
                value
            ) => {
                setSettings(
                    current => ({
                        ...current,
                        [name]:
                            value,
                    })
                );

                setValidationErrors(
                    current => {
                        if (
                            !current[
                                name
                            ]
                        ) {
                            return current;
                        }

                        const updated =
                            {
                                ...current,
                            };

                        delete updated[
                            name
                        ];

                        return updated;
                    }
                );

                setError("");
                setSuccessMessage(
                    ""
                );
            },
            []
        );

    const save =
        useCallback(async () => {
            const normalized =
                normalizeSystemSettings(
                    settings
                );

            const errors =
                validateSystemSettings(
                    normalized
                );

            setValidationErrors(
                errors
            );

            if (
                hasSystemSettingsErrors(
                    errors
                )
            ) {
                return false;
            }

            setIsSaving(true);

            try {
                const response =
                    await systemSettingsService.updateSettings(
                        normalized
                    );

                const mapped =
                    mapSystemSettings(
                        {
                            settings:
                                response,
                            systemInformation,
                        }
                    );

                setSettings(
                    mapped.settings
                );

                setOriginalSettings(
                    mapped.settings
                );

                setSuccessMessage(
                    "System settings updated successfully."
                );

                return true;
            } catch (requestError) {
                setError(
                    getErrorMessage(
                        requestError,
                        "Unable to save system settings."
                    )
                );

                return false;
            } finally {
                setIsSaving(
                    false
                );
            }
        }, [
            settings,
            systemInformation,
        ]);

    const reset =
        useCallback(() => {
            setSettings(
                originalSettings
            );

            setValidationErrors(
                {}
            );

            setError("");

            setSuccessMessage(
                ""
            );
        }, [
            originalSettings,
        ]);

    const testEmail =
        useCallback(async () => {
            setIsTestingEmail(
                true
            );

            try {
                await systemSettingsService.testEmailConfiguration(
                    settings
                );

                setSuccessMessage(
                    "Email configuration test completed successfully."
                );

                return true;
            } catch (requestError) {
                setError(
                    getErrorMessage(
                        requestError,
                        "Unable to test email configuration."
                    )
                );

                return false;
            } finally {
                setIsTestingEmail(
                    false
                );
            }
        }, [
            settings,
        ]);

    const createBackup =
        useCallback(async () => {
            setIsCreatingBackup(
                true
            );

            try {
                await systemSettingsService.createBackup();

                setSuccessMessage(
                    "Backup created successfully."
                );
            } catch (requestError) {
                setError(
                    getErrorMessage(
                        requestError,
                        "Unable to create backup."
                    )
                );
            } finally {
                setIsCreatingBackup(
                    false
                );
            }
        }, []);

    const clearCache =
        useCallback(async () => {
            setIsClearingCache(
                true
            );

            try {
                await systemSettingsService.clearApplicationCache();

                setSuccessMessage(
                    "Application cache cleared successfully."
                );
            } catch (requestError) {
                setError(
                    getErrorMessage(
                        requestError,
                        "Unable to clear application cache."
                    )
                );
            } finally {
                setIsClearingCache(
                    false
                );
            }
        }, []);

    const hasChanges =
        useMemo(
            () =>
                JSON.stringify(
                    settings
                ) !==
                JSON.stringify(
                    originalSettings
                ),
            [
                settings,
                originalSettings,
            ]
        );

    const clearMessages =
        useCallback(() => {
            setError("");

            setSuccessMessage(
                ""
            );
        }, []);

    return {
        settings,
        systemInformation,

        validationErrors,

        isLoading,
        isSaving,
        isTestingEmail,
        isCreatingBackup,
        isClearingCache,

        hasChanges,

        successMessage,
        error,

        updateField,

        save,
        reset,

        testEmail,
        createBackup,
        clearCache,

        reload:
            loadSettings,

        clearMessages,
    };
}
