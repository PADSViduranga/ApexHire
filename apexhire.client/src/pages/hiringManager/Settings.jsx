import {
    useState
} from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    FormControlLabel,
    Grid,
    Stack,
    Switch,
    TextField,
    Typography
} from "@mui/material";

import LockIcon
    from "@mui/icons-material/Lock";

import NotificationsIcon
    from "@mui/icons-material/Notifications";

import PaletteIcon
    from "@mui/icons-material/Palette";

import SecurityIcon
    from "@mui/icons-material/Security";

import SaveIcon
    from "@mui/icons-material/Save";

import "../../styles/HiringManagerSettings.css";

export default function Settings() {

    const storedUser = (() => {
        try {
            return JSON.parse(
                localStorage.getItem(
                    "apexhire_user"
                )
            ) ?? {};
        }
        catch {
            return {};
        }
    })();

    const [passwords, setPasswords] =
        useState({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });

    const [settings, setSettings] =
        useState({
            emailNotifications: true,
            applicationNotifications: true,
            interviewNotifications: true,
            darkMode: false
        });

    const [message, setMessage] =
        useState("");

    function handlePasswordChange(e) {
        const {
            name,
            value
        } = e.target;

        setPasswords(previous => ({
            ...previous,
            [name]: value
        }));
    }

    function handleSwitch(e) {
        const {
            name,
            checked
        } = e.target;

        setSettings(previous => ({
            ...previous,
            [name]: checked
        }));
    }

    function handleSave() {

        if (
            passwords.newPassword &&
            passwords.newPassword !==
            passwords.confirmPassword
        ) {
            setMessage(
                "New passwords do not match."
            );
            return;
        }

        localStorage.setItem(
            "apexhire_settings",
            JSON.stringify(settings)
        );

        setPasswords({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });

        setMessage(
            "Settings saved successfully."
        );
    }

    return (

        <Box className="hm-page">

            <Typography
                variant="h4"
                fontWeight={700}
                mb={3}
            >
                Settings
            </Typography>

            {message && (

                <Alert
                    severity="success"
                    sx={{ mb: 3 }}
                    onClose={() => setMessage("")}
                >
                    {message}
                </Alert>

            )}

            <Grid
                container
                spacing={3}
            >

                <Grid
                    item
                    xs={12}
                    lg={6}
                >

                    <Card className="hm-settings-card">

                        <CardContent>

                            <Stack
                                direction="row"
                                spacing={1}
                                mb={2}
                                alignItems="center"
                            >

                                <LockIcon />

                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    Change Password
                                </Typography>

                            </Stack>

                            <TextField
                                fullWidth
                                type="password"
                                margin="normal"
                                label="Current Password"
                                name="currentPassword"
                                value={passwords.currentPassword}
                                onChange={handlePasswordChange}
                            />

                            <TextField
                                fullWidth
                                type="password"
                                margin="normal"
                                label="New Password"
                                name="newPassword"
                                value={passwords.newPassword}
                                onChange={handlePasswordChange}
                            />

                            <TextField
                                fullWidth
                                type="password"
                                margin="normal"
                                label="Confirm Password"
                                name="confirmPassword"
                                value={passwords.confirmPassword}
                                onChange={handlePasswordChange}
                            />

                        </CardContent>

                    </Card>

                </Grid>

                <Grid
                    item
                    xs={12}
                    lg={6}
                >

                    <Card className="hm-settings-card">

                        <CardContent>

                            <Stack
                                direction="row"
                                spacing={1}
                                mb={2}
                                alignItems="center"
                            >

                                <NotificationsIcon />

                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    Notifications
                                </Typography>

                            </Stack>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={
                                            settings.emailNotifications
                                        }
                                        name="emailNotifications"
                                        onChange={handleSwitch}
                                    />
                                }
                                label="Email Notifications"
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={
                                            settings.applicationNotifications
                                        }
                                        name="applicationNotifications"
                                        onChange={handleSwitch}
                                    />
                                }
                                label="Application Notifications"
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={
                                            settings.interviewNotifications
                                        }
                                        name="interviewNotifications"
                                        onChange={handleSwitch}
                                    />
                                }
                                label="Interview Notifications"
                            />

                            <Divider sx={{ my: 3 }} />

                            <Stack
                                direction="row"
                                spacing={1}
                                mb={2}
                                alignItems="center"
                            >

                                <PaletteIcon />

                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    Appearance
                                </Typography>

                            </Stack>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={
                                            settings.darkMode
                                        }
                                        name="darkMode"
                                        onChange={handleSwitch}
                                    />
                                }
                                label="Dark Mode"
                            />

                            <Divider sx={{ my: 3 }} />

                            <Stack
                                direction="row"
                                spacing={1}
                                mb={2}
                                alignItems="center"
                            >

                                <SecurityIcon />

                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    Account
                                </Typography>

                            </Stack>

                            <Typography
                                color="text.secondary"
                                mb={1}
                            >
                                Logged in as
                            </Typography>

                            <Typography
                                fontWeight={700}
                                mb={3}
                            >
                                {storedUser?.email ??
                                    "Unknown User"}
                            </Typography>

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                startIcon={<SaveIcon />}
                                onClick={handleSave}
                            >
                                Save Settings
                            </Button>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>

        </Box>

    );
}
