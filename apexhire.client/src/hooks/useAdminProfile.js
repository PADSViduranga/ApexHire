import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import adminProfileService from "../services/adminProfileService";

import {
    ADMIN_PROFILE_ACTIVITY_LIMIT,
    DEFAULT_ADMIN_PASSWORD_FORM,
    DEFAULT_ADMIN_PROFILE_FORM,
    EMPTY_ADMIN_PROFILE_DATA,
} from "../utils/adminProfileConstants";

import {
    sanitizeProfileForm,
    validateProfileImage,
} from "../utils/adminProfileHelpers";

import {
    mapAdminProfile,
} from "../utils/adminProfileMapper";

import {
    hasAdminProfileErrors,
    validateAdminPasswordForm,
    validateAdminProfileForm,
} from "../utils/adminProfileValidation";

function getErrorMessage(
    error,
    fallbackMessage
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
        fallbackMessage
    );
}

export default function useAdminProfile() {
    const abortControllerRef =
        useRef(null);

    const [profileData, setProfileData] =
        useState({
            ...EMPTY_ADMIN_PROFILE_DATA,
        });

    const [profileForm, setProfileForm] =
        useState({
            ...DEFAULT_ADMIN_PROFILE_FORM,
        });

    const [passwordForm, setPasswordForm] =
        useState({
            ...DEFAULT_ADMIN_PASSWORD_FORM,
        });

    const [profileErrors, setProfileErrors] =
        useState({});

    const [passwordErrors, setPasswordErrors] =
        useState({});

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSavingProfile, setIsSavingProfile] =
        useState(false);

    const [isChangingPassword, setIsChangingPassword] =
        useState(false);

    const [isUploadingImage, setIsUploadingImage] =
        useState(false);

    const [uploadProgress, setUploadProgress] =
        useState(0);

    const [isRemovingImage, setIsRemovingImage] =
        useState(false);

    const [revokingSessionId, setRevokingSessionId] =
        useState(null);

    const [isRevokingOtherSessions, setIsRevokingOtherSessions] =
        useState(false);

    const [error, setError] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    const initializeProfileForm =
        useCallback(profile => {
            setProfileForm({
                firstName:
                    profile.firstName ?? "",
                lastName:
                    profile.lastName ?? "",
                phoneNumber:
                    profile.phoneNumber ?? "",
                jobTitle:
                    profile.jobTitle ?? "",
                location:
                    profile.location ?? "",
                bio:
                    profile.bio ?? "",
            });
        }, []);

    const loadProfile =
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
                    profileResponse,
                    sessionsResponse,
                    activityResponse,
                ] = await Promise.all([
                    adminProfileService.getProfile(
                        controller.signal
                    ),
                    adminProfileService.getActiveSessions(
                        controller.signal
                    ),
                    adminProfileService.getRecentActivity(
                        ADMIN_PROFILE_ACTIVITY_LIMIT,
                        controller.signal
                    ),
                ]);

                if (controller.signal.aborted) {
                    return;
                }

                const mappedData =
                    mapAdminProfile({
                        profile:
                            profileResponse?.profile ??
                            profileResponse,
                        activeSessions:
                            sessionsResponse?.activeSessions ??
                            sessionsResponse?.sessions ??
                            sessionsResponse,
                        recentActivity:
                            activityResponse?.recentActivity ??
                            activityResponse?.activities ??
                            activityResponse,
                    });

                setProfileData(mappedData);
                initializeProfileForm(
                    mappedData.profile
                );
            } catch (requestError) {
                if (controller.signal.aborted) {
                    return;
                }

                setError(
                    getErrorMessage(
                        requestError,
                        "Unable to load admin profile."
                    )
                );
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }, [initializeProfileForm]);

    useEffect(() => {
        loadProfile();

        return () => {
            abortControllerRef.current?.abort();
        };
    }, [loadProfile]);

    const updateProfileField =
        useCallback((name, value) => {
            setProfileForm(current => ({
                ...current,
                [name]: value,
            }));

            setProfileErrors(current => {
                if (!current[name]) {
                    return current;
                }

                const updated = {
                    ...current,
                };

                delete updated[name];

                return updated;
            });

            setError("");
            setSuccessMessage("");
        }, []);

    const updatePasswordField =
        useCallback((name, value) => {
            setPasswordForm(current => ({
                ...current,
                [name]: value,
            }));

            setPasswordErrors(current => {
                if (!current[name]) {
                    return current;
                }

                const updated = {
                    ...current,
                };

                delete updated[name];

                return updated;
            });

            setError("");
            setSuccessMessage("");
        }, []);

    const saveProfile =
        useCallback(async () => {
            const validationErrors =
                validateAdminProfileForm(
                    profileForm
                );

            setProfileErrors(
                validationErrors
            );

            if (
                hasAdminProfileErrors(
                    validationErrors
                )
            ) {
                return false;
            }

            setIsSavingProfile(true);
            setError("");
            setSuccessMessage("");

            try {
                const payload =
                    sanitizeProfileForm(
                        profileForm
                    );

                const response =
                    await adminProfileService
                        .updateProfile(payload);

                const mapped =
                    mapAdminProfile({
                        ...profileData,
                        profile:
                            response?.profile ??
                            response,
                    });

                setProfileData(mapped);
                initializeProfileForm(
                    mapped.profile
                );

                setSuccessMessage(
                    "Profile updated successfully."
                );

                return true;
            } catch (requestError) {
                setError(
                    getErrorMessage(
                        requestError,
                        "Unable to update profile."
                    )
                );

                return false;
            } finally {
                setIsSavingProfile(false);
            }
        }, [
            initializeProfileForm,
            profileData,
            profileForm,
        ]);

    const resetProfileForm =
        useCallback(() => {
            initializeProfileForm(
                profileData.profile
            );

            setProfileErrors({});
            setError("");
            setSuccessMessage("");
        }, [
            initializeProfileForm,
            profileData.profile,
        ]);

    const changePassword =
        useCallback(async () => {
            const validationErrors =
                validateAdminPasswordForm(
                    passwordForm
                );

            setPasswordErrors(
                validationErrors
            );

            if (
                hasAdminProfileErrors(
                    validationErrors
                )
            ) {
                return false;
            }

            setIsChangingPassword(true);
            setError("");
            setSuccessMessage("");

            try {
                await adminProfileService
                    .changePassword({
                        currentPassword:
                            passwordForm.currentPassword,
                        newPassword:
                            passwordForm.newPassword,
                        confirmPassword:
                            passwordForm.confirmPassword,
                    });

                setPasswordForm({
                    ...DEFAULT_ADMIN_PASSWORD_FORM,
                });

                setPasswordErrors({});

                setSuccessMessage(
                    "Password changed successfully."
                );

                return true;
            } catch (requestError) {
                setError(
                    getErrorMessage(
                        requestError,
                        "Unable to change password."
                    )
                );

                return false;
            } finally {
                setIsChangingPassword(false);
            }
        }, [passwordForm]);

    const uploadProfileImage =
        useCallback(async file => {
            const validationError =
                validateProfileImage(file);

            if (validationError) {
                setError(validationError);
                return false;
            }

            setIsUploadingImage(true);
            setUploadProgress(0);
            setError("");
            setSuccessMessage("");

            try {
                const response =
                    await adminProfileService
                        .uploadProfileImage(
                            file,
                            progressEvent => {
                                const total =
                                    progressEvent.total || 0;

                                if (!total) {
                                    return;
                                }

                                setUploadProgress(
                                    Math.round(
                                        (
                                            progressEvent.loaded *
                                            100
                                        ) / total
                                    )
                                );
                            }
                        );

                const mapped =
                    mapAdminProfile({
                        ...profileData,
                        profile: {
                            ...profileData.profile,
                            profileImageUrl:
                                response?.profileImageUrl ??
                                response?.imageUrl ??
                                response?.url ??
                                "",
                        },
                    });

                setProfileData(mapped);

                setSuccessMessage(
                    "Profile image updated successfully."
                );

                return true;
            } catch (requestError) {
                setError(
                    getErrorMessage(
                        requestError,
                        "Unable to upload profile image."
                    )
                );

                return false;
            } finally {
                setIsUploadingImage(false);
                setUploadProgress(0);
            }
        }, [profileData]);

    const removeProfileImage =
        useCallback(async () => {
            setIsRemovingImage(true);
            setError("");
            setSuccessMessage("");

            try {
                await adminProfileService
                    .removeProfileImage();

                const mapped =
                    mapAdminProfile({
                        ...profileData,
                        profile: {
                            ...profileData.profile,
                            profileImageUrl: "",
                        },
                    });

                setProfileData(mapped);

                setSuccessMessage(
                    "Profile image removed successfully."
                );

                return true;
            } catch (requestError) {
                setError(
                    getErrorMessage(
                        requestError,
                        "Unable to remove profile image."
                    )
                );

                return false;
            } finally {
                setIsRemovingImage(false);
            }
        }, [profileData]);

    const revokeSession =
        useCallback(async sessionId => {
            if (!sessionId) {
                return false;
            }

            setRevokingSessionId(sessionId);
            setError("");
            setSuccessMessage("");

            try {
                await adminProfileService
                    .revokeSession(sessionId);

                setProfileData(current => ({
                    ...current,
                    activeSessions:
                        current.activeSessions.filter(
                            session =>
                                session.id !==
                                sessionId
                        ),
                }));

                setSuccessMessage(
                    "Session revoked successfully."
                );

                return true;
            } catch (requestError) {
                setError(
                    getErrorMessage(
                        requestError,
                        "Unable to revoke session."
                    )
                );

                return false;
            } finally {
                setRevokingSessionId(null);
            }
        }, []);

    const revokeOtherSessions =
        useCallback(async () => {
            setIsRevokingOtherSessions(true);
            setError("");
            setSuccessMessage("");

            try {
                await adminProfileService
                    .revokeOtherSessions();

                setProfileData(current => ({
                    ...current,
                    activeSessions:
                        current.activeSessions.filter(
                            session =>
                                session.isCurrent
                        ),
                }));

                setSuccessMessage(
                    "Other sessions revoked successfully."
                );

                return true;
            } catch (requestError) {
                setError(
                    getErrorMessage(
                        requestError,
                        "Unable to revoke other sessions."
                    )
                );

                return false;
            } finally {
                setIsRevokingOtherSessions(false);
            }
        }, []);

    const hasProfileChanges =
        useMemo(() => {
            const current =
                sanitizeProfileForm(
                    profileForm
                );

            const original =
                sanitizeProfileForm(
                    profileData.profile
                );

            return (
                JSON.stringify(current) !==
                JSON.stringify(original)
            );
        }, [
            profileData.profile,
            profileForm,
        ]);

    const clearMessages =
        useCallback(() => {
            setError("");
            setSuccessMessage("");
        }, []);

    return {
        profileData,
        profileForm,
        passwordForm,

        profileErrors,
        passwordErrors,

        isLoading,
        isSavingProfile,
        isChangingPassword,
        isUploadingImage,
        uploadProgress,
        isRemovingImage,
        revokingSessionId,
        isRevokingOtherSessions,

        hasProfileChanges,

        error,
        successMessage,

        updateProfileField,
        updatePasswordField,

        saveProfile,
        resetProfileForm,
        changePassword,

        uploadProfileImage,
        removeProfileImage,

        revokeSession,
        revokeOtherSessions,

        reloadProfile:
            loadProfile,

        clearMessages,
    };
}
