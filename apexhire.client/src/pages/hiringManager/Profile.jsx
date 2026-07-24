import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import AccountCircleIcon
    from "@mui/icons-material/AccountCircle";

import BadgeIcon
    from "@mui/icons-material/Badge";

import BusinessIcon
    from "@mui/icons-material/Business";

import EditIcon
    from "@mui/icons-material/Edit";

import EmailIcon
    from "@mui/icons-material/Email";

import PersonIcon
    from "@mui/icons-material/Person";


import RestartAltIcon
    from "@mui/icons-material/RestartAlt";

import SaveIcon
    from "@mui/icons-material/Save";

import WorkIcon
    from "@mui/icons-material/Work";

import { useAuth }
    from "../../context/AuthContext";

import "../../styles/HiringManagerProfile.css";

function getStoredUser() {
    try {
        const stored =
            localStorage.getItem(
                "apexhire_user"
            );

        return stored
            ? JSON.parse(stored)
            : null;
    }
    catch {
        return null;
    }
}

function getInitials(name) {
    if (!name) {
        return "HM";
    }

    return String(name)
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part =>
            part.charAt(0).toUpperCase()
        )
        .join("");
}

function getUserName(user) {
    return (
        user?.fullName ??
        user?.name ??
        [
            user?.firstName,
            user?.lastName
        ]
            .filter(Boolean)
            .join(" ") ??
        "Hiring Manager"
    );
}

export default function Profile() {
    const auth = useAuth();

    const contextUser =
        auth?.user ?? null;

    const storedUser =
        useMemo(
            () => getStoredUser(),
            []
        );

    const currentUser =
        contextUser ??
        storedUser ??
        {};

    const [editing, setEditing] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [form, setForm] =
        useState({
            fullName: "",
            email: "",
            phoneNumber: "",
            departmentName: "",
            organizationName: "",
            position: "",
            role: ""
        });

    useEffect(() => {
        setForm({
            fullName:
                getUserName(currentUser),

            email:
                currentUser?.email ??
                "",

            phoneNumber:
                currentUser?.phoneNumber ??
                currentUser?.phone ??
                "",

            departmentName:
                currentUser?.departmentName ??
                currentUser?.department?.name ??
                "",

            organizationName:
                currentUser?.organizationName ??
                currentUser?.organization?.name ??
                "",

            position:
                currentUser?.position ??
                currentUser?.jobTitle ??
                "Hiring Manager",

            role:
                currentUser?.role ??
                "HiringManager"
        });
    }, [currentUser]);

    function handleChange(event) {
        const {
            name,
            value
        } = event.target;

        setForm(previous => ({
            ...previous,
            [name]: value
        }));

        setMessage("");
    }

    function handleEdit() {
        setEditing(true);
        setMessage("");
    }

    function handleCancel() {
        setForm({
            fullName:
                getUserName(currentUser),

            email:
                currentUser?.email ??
                "",

            phoneNumber:
                currentUser?.phoneNumber ??
                currentUser?.phone ??
                "",

            departmentName:
                currentUser?.departmentName ??
                currentUser?.department?.name ??
                "",

            organizationName:
                currentUser?.organizationName ??
                currentUser?.organization?.name ??
                "",

            position:
                currentUser?.position ??
                currentUser?.jobTitle ??
                "Hiring Manager",

            role:
                currentUser?.role ??
                "HiringManager"
        });

        setEditing(false);
        setMessage("");
    }

    function handleSave() {
        const updatedUser = {
            ...currentUser,
            fullName:
                form.fullName.trim(),

            name:
                form.fullName.trim(),

            phoneNumber:
                form.phoneNumber.trim(),

            departmentName:
                form.departmentName.trim(),

            organizationName:
                form.organizationName.trim(),

            position:
                form.position.trim()
        };

        localStorage.setItem(
            "apexhire_user",
            JSON.stringify(updatedUser)
        );

        setEditing(false);

        setMessage(
            "Profile information was saved in this browser."
        );
    }


    return (
        <Box className="hm-page">

            <Typography
                variant="h4"
                fontWeight={700}
                mb={3}
            >
                My Profile
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
                    md={4}
                >

                    <Card className="hm-profile-card">

                        <CardContent>

                            <Stack
                                spacing={2}
                                alignItems="center"
                            >

                                <Avatar
                                    sx={{
                                        width: 110,
                                        height: 110,
                                        fontSize: 36
                                    }}
                                >
                                    {getInitials(
                                        form.fullName
                                    )}
                                </Avatar>

                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                >
                                    {form.fullName}
                                </Typography>

                                <Chip
                                    color="primary"
                                    icon={<BadgeIcon />}
                                    label={form.role}
                                />

                                <Divider
                                    flexItem
                                />

                                <Stack
                                    spacing={2}
                                    width="100%"
                                >

                                    <Stack
                                        direction="row"
                                        spacing={1.5}
                                        alignItems="center"
                                    >
                                        <EmailIcon
                                            color="primary"
                                        />

                                        <Typography>
                                            {form.email}
                                        </Typography>
                                    </Stack>

                                    <Stack
                                        direction="row"
                                        spacing={1.5}
                                        alignItems="center"
                                    >
                                        <BusinessIcon
                                            color="primary"
                                        />

                                        <Typography>
                                            {form.organizationName || "-"}
                                        </Typography>
                                    </Stack>

                                    <Stack
                                        direction="row"
                                        spacing={1.5}
                                        alignItems="center"
                                    >
                                        <WorkIcon
                                            color="primary"
                                        />

                                        <Typography>
                                            {form.departmentName || "-"}
                                        </Typography>
                                    </Stack>

                                </Stack>

                            </Stack>

                        </CardContent>

                    </Card>

                </Grid>

                <Grid
                    item
                    xs={12}
                    md={8}
                >

                    <Card className="hm-profile-card">

                        <CardContent>

                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                mb={3}
                            >

                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    Personal Information
                                </Typography>

                                {!editing ? (
                                    <Button
                                        variant="contained"
                                        startIcon={<EditIcon />}
                                        onClick={handleEdit}
                                    >
                                        Edit
                                    </Button>
                                ) : (
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                    >

                                        <Button
                                            color="inherit"
                                            startIcon={<RestartAltIcon />}
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            variant="contained"
                                            startIcon={<SaveIcon />}
                                            onClick={handleSave}
                                        >
                                            Save
                                        </Button>

                                    </Stack>
                                )}

                            </Stack>

                            <Grid
                                container
                                spacing={2}
                            >

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                >

                                    <TextField
                                        fullWidth
                                        name="fullName"
                                        label="Full Name"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        InputProps={{
                                            startAdornment:
                                                <PersonIcon
                                                    sx={{ mr: 1 }}
                                                />
                                        }}
                                    />

                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                >

                                    <TextField
                                        fullWidth
                                        disabled
                                        label="Email"
                                        value={form.email}
                                    />

                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                >

                                    <TextField
                                        fullWidth
                                        name="phoneNumber"
                                        label="Phone Number"
                                        value={form.phoneNumber}
                                        onChange={handleChange}
                                        disabled={!editing}
                                    />

                                </Grid>


                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                >
                                    <TextField
                                        fullWidth
                                        name="position"
                                        label="Position"
                                        value={form.position}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        InputProps={{
                                            startAdornment:
                                                <AccountCircleIcon
                                                    sx={{ mr: 1 }}
                                                />
                                        }}
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                >
                                    <TextField
                                        fullWidth
                                        name="departmentName"
                                        label="Department"
                                        value={form.departmentName}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        InputProps={{
                                            startAdornment:
                                                <WorkIcon
                                                    sx={{ mr: 1 }}
                                                />
                                        }}
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                >
                                    <TextField
                                        fullWidth
                                        name="organizationName"
                                        label="Organization"
                                        value={form.organizationName}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        InputProps={{
                                            startAdornment:
                                                <BusinessIcon
                                                    sx={{ mr: 1 }}
                                                />
                                        }}
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                >
                                    <TextField
                                        fullWidth
                                        disabled
                                        label="Account Role"
                                        value={form.role}
                                    />
                                </Grid>

                            </Grid>

                            <Alert
                                severity="info"
                                sx={{ mt: 3 }}
                            >
                                Profile changes are currently saved
                                only in this browser.
                            </Alert>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>

        </Box>
    );
}
