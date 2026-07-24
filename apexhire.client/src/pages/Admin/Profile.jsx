import {
    useState,
} from "react";

import {
    Alert,
    Box,
    Container,
    Grid,
    Snackbar,
    Stack,
} from "@mui/material";

import useAdminProfile from "../../hooks/useAdminProfile";

import {
    AccountInformationCard,
    ActiveSessionsCard,
    AdminProfileHeader,
    ChangePasswordForm,
    PersonalInformationCard,
    ProfileActivityCard,
    ProfileErrorState,
    ProfileFormActions,
    ProfileImageUploader,
    ProfileLoadingState,
    SecuritySettingsCard,
} from "../../components/Admin/profile";

import "../../styles/adminProfilePage.css";

export default function Profile() {
    const {
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

        reloadProfile,
        clearMessages,
    } = useAdminProfile();

    const [
        passwordDialogOpen,
        setPasswordDialogOpen,
    ] = useState(false);

    if (isLoading) {
        return (
            <Container
                maxWidth="xl"
                className="hm-profile-page hm-profile-loading-page"
            >
                <ProfileLoadingState />
            </Container>
        );
    }

    if (
        error &&
        !profileData.profile.email
    ) {
        return (
            <Container
                maxWidth="lg"
                className="hm-profile-page"
            >
                <Box className="hm-profile-section hm-profile-error-section">
                    <ProfileErrorState
                        message={error}
                        onRetry={reloadProfile}
                    />
                </Box>
            </Container>
        );
    }

    return (
        <>
            <Container
                maxWidth="xl"
                className="hm-profile-page"
            >
                <Stack
                    spacing={3}
                    className="hm-profile-content"
                >
                    <Box className="hm-profile-header-wrapper">
                        <AdminProfileHeader
                            profile={
                                profileData.profile
                            }
                        />
                    </Box>

                    <Grid
                        container
                        spacing={3}
                        className="hm-profile-grid"
                    >
                        <Grid
                            item
                            xs={12}
                            lg={8}
                        >
                            <Stack spacing={3}>
                                <Box className="hm-profile-section">
                                    <PersonalInformationCard
                                        form={profileForm}
                                        errors={profileErrors}
                                        disabled={
                                            isSavingProfile
                                        }
                                        onChange={
                                            updateProfileField
                                        }
                                    />
                                </Box>

                                <Box className="hm-profile-form-actions">
                                    <ProfileFormActions
                                        hasChanges={
                                            hasProfileChanges
                                        }
                                        isSaving={
                                            isSavingProfile
                                        }
                                        onSave={saveProfile}
                                        onReset={
                                            resetProfileForm
                                        }
                                    />
                                </Box>

                                <Box className="hm-profile-section">
                                    <AccountInformationCard
                                        profile={
                                            profileData.profile
                                        }
                                    />
                                </Box>

                                <Box className="hm-profile-section hm-profile-security-section">
                                    <SecuritySettingsCard
                                        activeSessionCount={
                                            profileData
                                                .activeSessions
                                                .length
                                        }
                                        isChangingPassword={
                                            isChangingPassword
                                        }
                                        isRevokingOtherSessions={
                                            isRevokingOtherSessions
                                        }
                                        onOpenPasswordForm={() =>
                                            setPasswordDialogOpen(
                                                true
                                            )
                                        }
                                        onRevokeOtherSessions={
                                            revokeOtherSessions
                                        }
                                    />
                                </Box>

                                <Box className="hm-profile-section">
                                    <ActiveSessionsCard
                                        sessions={
                                            profileData
                                                .activeSessions
                                        }
                                        revokingSessionId={
                                            revokingSessionId
                                        }
                                        onRevokeSession={
                                            revokeSession
                                        }
                                    />
                                </Box>
                            </Stack>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            lg={4}
                        >
                            <Stack spacing={3}>
                                <Box className="hm-profile-section hm-profile-image-section">
                                    <ProfileImageUploader
                                        profile={
                                            profileData.profile
                                        }
                                        isUploading={
                                            isUploadingImage
                                        }
                                        isRemoving={
                                            isRemovingImage
                                        }
                                        uploadProgress={
                                            uploadProgress
                                        }
                                        onUpload={
                                            uploadProfileImage
                                        }
                                        onRemove={
                                            removeProfileImage
                                        }
                                    />
                                </Box>

                                <Box className="hm-profile-section hm-profile-activity-section">
                                    <ProfileActivityCard
                                        activities={
                                            profileData
                                                .recentActivity
                                        }
                                    />
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
            </Container>

            <ChangePasswordForm
                open={passwordDialogOpen}
                form={passwordForm}
                errors={passwordErrors}
                isSubmitting={
                    isChangingPassword
                }
                onChange={updatePasswordField}
                onSubmit={async () => {
                    const success =
                        await changePassword();

                    if (success) {
                        setPasswordDialogOpen(
                            false
                        );
                    }
                }}
                onClose={() =>
                    setPasswordDialogOpen(
                        false
                    )
                }
            />

            <Snackbar
                open={Boolean(successMessage)}
                autoHideDuration={4000}
                onClose={clearMessages}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    className="hm-profile-snackbar-alert"
                    onClose={clearMessages}
                >
                    {successMessage}
                </Alert>
            </Snackbar>

            <Snackbar
                open={
                    Boolean(error) &&
                    Boolean(
                        profileData.profile.email
                    )
                }
                autoHideDuration={5000}
                onClose={clearMessages}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    className="hm-profile-snackbar-alert"
                    onClose={clearMessages}
                >
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
}
