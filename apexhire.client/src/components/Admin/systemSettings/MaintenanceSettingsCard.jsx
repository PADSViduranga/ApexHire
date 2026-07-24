import PropTypes from "prop-types";
import {
    Alert,
    Button,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";

import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import {
    BACKUP_FREQUENCIES,
} from "../../../utils/systemSettingsConstants";

export default function MaintenanceSettingsCard({
    settings,
    disabled = false,
    isCreatingBackup = false,
    isClearingCache = false,
    onChange,
    onCreateBackup,
    onClearCache,
}) {
    function handleChange(
        event
    ) {
        const {
            name,
            type,
            checked,
            value,
        } = event.target;

        onChange(
            name,
            type === "checkbox"
                ? checked
                : value
        );
    }

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
            }}
        >
            <Typography
                variant="h6"
                fontWeight={700}
                gutterBottom
            >
                Maintenance Settings
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
            >
                Control maintenance access, backups, and application cache operations.
            </Typography>

            <Grid
                container
                spacing={3}
            >
                <Grid
                    item
                    xs={12}
                >
                    <Stack
                        spacing={1.5}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    name="maintenanceMode"
                                    checked={Boolean(
                                        settings.maintenanceMode
                                    )}
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        disabled
                                    }
                                />
                            }
                            label="Enable maintenance mode"
                        />

                        {settings.maintenanceMode && (
                            <Alert
                                severity="warning"
                                icon={
                                    <WarningAmberOutlinedIcon />
                                }
                            >
                                Maintenance mode may prevent regular users from accessing the application.
                            </Alert>
                        )}
                    </Stack>
                </Grid>

                <Grid
                    item
                    xs={12}
                >
                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        name="maintenanceMessage"
                        label="Maintenance Message"
                        value={
                            settings.maintenanceMessage
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            disabled
                        }
                        placeholder="The system is temporarily unavailable due to scheduled maintenance."
                        inputProps={{
                            maxLength: 500,
                        }}
                        helperText={`${settings.maintenanceMessage.length}/500`}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <FormControlLabel
                        control={
                            <Switch
                                name="enableAutomaticBackups"
                                checked={Boolean(
                                    settings.enableAutomaticBackups
                                )}
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    disabled
                                }
                            />
                        }
                        label="Enable automatic backups"
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={6}
                >
                    <FormControl
                        fullWidth
                        disabled={
                            disabled ||
                            !settings.enableAutomaticBackups
                        }
                    >
                        <InputLabel id="backup-frequency-label">
                            Backup Frequency
                        </InputLabel>

                        <Select
                            labelId="backup-frequency-label"
                            name="backupFrequency"
                            label="Backup Frequency"
                            value={
                                settings.backupFrequency
                            }
                            onChange={
                                handleChange
                            }
                        >
                            {BACKUP_FREQUENCIES.map(
                                frequency => (
                                    <MenuItem
                                        key={
                                            frequency
                                        }
                                        value={
                                            frequency
                                        }
                                    >
                                        {frequency}
                                    </MenuItem>
                                )
                            )}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid
                    item
                    xs={12}
                >
                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={2}
                    >
                        <Button
                            variant="contained"
                            startIcon={
                                <BackupOutlinedIcon />
                            }
                            onClick={
                                onCreateBackup
                            }
                            disabled={
                                disabled ||
                                isCreatingBackup
                            }
                        >
                            {isCreatingBackup
                                ? "Creating Backup..."
                                : "Create Backup Now"}
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={
                                <CleaningServicesOutlinedIcon />
                            }
                            onClick={
                                onClearCache
                            }
                            disabled={
                                disabled ||
                                isClearingCache
                            }
                        >
                            {isClearingCache
                                ? "Clearing Cache..."
                                : "Clear Application Cache"}
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Paper>
    );
}

MaintenanceSettingsCard.propTypes = {
    settings: PropTypes.shape({
        maintenanceMode:
            PropTypes.bool.isRequired,

        maintenanceMessage:
            PropTypes.string.isRequired,

        enableAutomaticBackups:
            PropTypes.bool.isRequired,

        backupFrequency:
            PropTypes.string.isRequired,
    }).isRequired,

    disabled:
        PropTypes.bool,

    isCreatingBackup:
        PropTypes.bool,

    isClearingCache:
        PropTypes.bool,

    onChange:
        PropTypes.func.isRequired,

    onCreateBackup:
        PropTypes.func.isRequired,

    onClearCache:
        PropTypes.func.isRequired,
};
