import {
    Alert,
    Container,
    Snackbar,
    Stack,
} from "@mui/material";

import useSystemSettings from "../../hooks/useSystemSettings";

import {
    EmailSettingsCard,
    GeneralSettingsCard,
    MaintenanceSettingsCard,
    NotificationSettingsCard,
    OrganizationSettingsCard,
    SecurityPolicyCard,
    SettingsErrorState,
    SettingsFormActions,
    SettingsLoadingState,
    SystemInformationCard,
    SystemSettingsHeader,
} from "../../components/Admin/systemSettings";

export default function SystemSettings() {
    const {
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

        reload,

        clearMessages,
    } = useSystemSettings();

    if (isLoading) {
        return (
            <Container
                maxWidth="xl"
                sx={{ py: 4 }}
            >
                <SettingsLoadingState />
            </Container>
        );
    }

    if (error && !settings.siteName) {
        return (
            <Container
                maxWidth="xl"
                sx={{ py: 4 }}
            >
                <SettingsErrorState
                    message={error}
                    onRetry={reload}
                />
            </Container>
        );
    }

    return (
        <>
            <Container
                maxWidth="xl"
                sx={{ py: 4 }}
            >
                <Stack spacing={3}>
                    <SystemSettingsHeader
                        environment={
                            systemInformation.environment
                        }
                        version={
                            systemInformation.applicationVersion
                        }
                        onReload={
                            reload
                        }
                    />

                    <GeneralSettingsCard
                        settings={
                            settings
                        }
                        errors={
                            validationErrors
                        }
                        disabled={
                            isSaving
                        }
                        onChange={
                            updateField
                        }
                    />

                    <OrganizationSettingsCard
                        settings={
                            settings
                        }
                        errors={
                            validationErrors
                        }
                        disabled={
                            isSaving
                        }
                        onChange={
                            updateField
                        }
                    />

                    <EmailSettingsCard
                        settings={
                            settings
                        }
                        errors={
                            validationErrors
                        }
                        disabled={
                            isSaving
                        }
                        isTesting={
                            isTestingEmail
                        }
                        onChange={
                            updateField
                        }
                        onTest={
                            testEmail
                        }
                    />

                    <NotificationSettingsCard
                        settings={
                            settings
                        }
                        disabled={
                            isSaving
                        }
                        onChange={
                            updateField
                        }
                    />

                    <SecurityPolicyCard
                        settings={
                            settings
                        }
                        errors={
                            validationErrors
                        }
                        disabled={
                            isSaving
                        }
                        onChange={
                            updateField
                        }
                    />

                    <MaintenanceSettingsCard
                        settings={
                            settings
                        }
                        disabled={
                            isSaving
                        }
                        isCreatingBackup={
                            isCreatingBackup
                        }
                        isClearingCache={
                            isClearingCache
                        }
                        onChange={
                            updateField
                        }
                        onCreateBackup={
                            createBackup
                        }
                        onClearCache={
                            clearCache
                        }
                    />

                    <SystemInformationCard
                        information={
                            systemInformation
                        }
                    />

                    <SettingsFormActions
                        hasChanges={
                            hasChanges
                        }
                        isSaving={
                            isSaving
                        }
                        onSave={
                            save
                        }
                        onReset={
                            reset
                        }
                    />
                </Stack>
            </Container>

            <Snackbar
                open={
                    Boolean(
                        successMessage
                    )
                }
                autoHideDuration={
                    4000
                }
                onClose={
                    clearMessages
                }
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={
                        clearMessages
                    }
                >
                    {successMessage}
                </Alert>
            </Snackbar>

            <Snackbar
                open={
                    Boolean(
                        error
                    )
                }
                autoHideDuration={
                    5000
                }
                onClose={
                    clearMessages
                }
            >
                <Alert
                    severity="error"
                    variant="filled"
                    onClose={
                        clearMessages
                    }
                >
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
}
