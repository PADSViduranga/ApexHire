import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    InputAdornment,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";

import CalendarMonthIcon
    from "@mui/icons-material/CalendarMonth";

import CheckCircleIcon
    from "@mui/icons-material/CheckCircle";

import CloseIcon
    from "@mui/icons-material/Close";

import EventRepeatIcon
    from "@mui/icons-material/EventRepeat";

import RefreshIcon
    from "@mui/icons-material/Refresh";

import SearchIcon
    from "@mui/icons-material/Search";

import VisibilityIcon
    from "@mui/icons-material/Visibility";

import hiringManagerService
    from "../../services/hiringManagerService";

import "../../styles/HiringManagerInterviews.css";

export default function Interviews() {
    const [interviews, setInterviews] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [
        selectedInterview,
        setSelectedInterview
    ] = useState(null);

    const [viewOpen, setViewOpen] =
        useState(false);

    const [
        rescheduleOpen,
        setRescheduleOpen
    ] = useState(false);

    const [newDate, setNewDate] =
        useState("");

    const [newLocation, setNewLocation] =
        useState("");

    function getInterviewId(interview) {
        return (
            interview?.id ??
            interview?.interviewId ??
            null
        );
    }

    function getCandidateName(interview) {
        return (
            interview?.candidateName ??
            interview?.candidateFullName ??
            interview?.candidate?.fullName ??
            interview?.candidate?.name ??
            "-"
        );
    }

    function getJobTitle(interview) {
        return (
            interview?.jobTitle ??
            interview?.position ??
            interview?.job?.title ??
            "-"
        );
    }

    function getInterviewDate(interview) {
        return (
            interview?.scheduledAt ??
            interview?.interviewDate ??
            interview?.startTime ??
            interview?.date ??
            null
        );
    }

    function getLocation(interview) {
        return (
            interview?.location ??
            interview?.meetingLocation ??
            interview?.venue ??
            "-"
        );
    }

    function getStatus(interview) {
        return interview?.status ?? "Unknown";
    }

    const loadInterviews =
        useCallback(async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await hiringManagerService
                        .getDepartmentInterviews();

                setInterviews(
                    Array.isArray(data)
                        ? data
                        : []
                );
            }
            catch (err) {
                setError(
                    err?.response?.data?.message ??
                    err?.response?.data?.errors?.[0] ??
                    err?.message ??
                    "Unable to load interviews."
                );
            }
            finally {
                setLoading(false);
            }
        }, []);

    useEffect(() => {
        loadInterviews();
    }, [loadInterviews]);

    const filteredInterviews =
        useMemo(() => {
            const normalizedSearch =
                search.trim().toLowerCase();

            return interviews.filter(
                interview => {
                    const candidate =
                        getCandidateName(
                            interview
                        ).toLowerCase();

                    const job =
                        getJobTitle(
                            interview
                        ).toLowerCase();

                    const location =
                        getLocation(
                            interview
                        ).toLowerCase();

                    const status =
                        getStatus(interview);

                    const matchesSearch =
                        !normalizedSearch ||
                        candidate.includes(
                            normalizedSearch
                        ) ||
                        job.includes(
                            normalizedSearch
                        ) ||
                        location.includes(
                            normalizedSearch
                        );

                    const matchesStatus =
                        statusFilter === "All" ||
                        status.toLowerCase() ===
                        statusFilter.toLowerCase();

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );
        }, [
            interviews,
            search,
            statusFilter
        ]);

    function formatDate(value) {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return String(value);
        }

        return date.toLocaleString(
            undefined,
            {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }

    function toDateTimeLocal(value) {
        if (!value) {
            return "";
        }

        const date = new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "";
        }

        const offset =
            date.getTimezoneOffset() *
            60000;

        return new Date(
            date.getTime() - offset
        )
            .toISOString()
            .slice(0, 16);
    }

    function getStatusColor(status) {
        switch (
            String(status).toLowerCase()
        ) {
            case "scheduled":
                return "primary";

            case "rescheduled":
                return "warning";

            case "completed":
                return "success";

            case "cancelled":
            case "canceled":
                return "error";

            default:
                return "default";
        }
    }

    function openView(interview) {
        setSelectedInterview(interview);
        setViewOpen(true);
        setError("");
        setSuccessMessage("");
    }

    function openReschedule(interview) {
        setSelectedInterview(interview);

        setNewDate(
            toDateTimeLocal(
                getInterviewDate(interview)
            )
        );

        const currentLocation =
            getLocation(interview);

        setNewLocation(
            currentLocation === "-"
                ? ""
                : currentLocation
        );

        setRescheduleOpen(true);
        setError("");
        setSuccessMessage("");
    }

    function closeView() {
        if (actionLoading) {
            return;
        }

        setViewOpen(false);
        setSelectedInterview(null);
    }

    function closeReschedule() {
        if (actionLoading) {
            return;
        }

        setRescheduleOpen(false);
        setSelectedInterview(null);
        setNewDate("");
        setNewLocation("");
    }

    async function updateStatus(status) {
        const interviewId =
            getInterviewId(
                selectedInterview
            );

        if (!interviewId) {
            setError(
                "Interview ID is missing."
            );

            return;
        }

        try {
            setActionLoading(true);
            setError("");
            setSuccessMessage("");

            await hiringManagerService
                .updateInterviewStatus(
                    interviewId,
                    status
                );

            setSuccessMessage(
                `Interview marked as ${status}.`
            );

            setViewOpen(false);
            setSelectedInterview(null);

            await loadInterviews();
        }
        catch (err) {
            setError(
                err?.response?.data?.message ??
                err?.response?.data?.errors?.[0] ??
                err?.message ??
                "Unable to update interview status."
            );
        }
        finally {
            setActionLoading(false);
        }
    }

    async function saveReschedule() {
        const interviewId =
            getInterviewId(
                selectedInterview
            );

        if (!interviewId) {
            setError(
                "Interview ID is missing."
            );

            return;
        }

        if (!newDate) {
            setError(
                "Select a new interview date."
            );

            return;
        }

        if (!newLocation.trim()) {
            setError(
                "Enter the interview location."
            );

            return;
        }

        try {
            setActionLoading(true);
            setError("");
            setSuccessMessage("");

            await hiringManagerService
                .rescheduleInterview(
                    interviewId,
                    {
                        scheduledAt:
                            new Date(
                                newDate
                            ).toISOString(),

                        location:
                            newLocation.trim()
                    }
                );

            setSuccessMessage(
                "Interview rescheduled successfully."
            );

            setRescheduleOpen(false);
            setSelectedInterview(null);
            setNewDate("");
            setNewLocation("");

            await loadInterviews();
        }
        catch (err) {
            setError(
                err?.response?.data?.message ??
                err?.response?.data?.errors?.[0] ??
                err?.message ??
                "Unable to reschedule interview."
            );
        }
        finally {
            setActionLoading(false);
        }
    }

    const statistics =
        useMemo(() => {
            const countStatus = status =>
                interviews.filter(
                    interview =>
                        getStatus(interview)
                            .toLowerCase() ===
                        status.toLowerCase()
                ).length;

            return {
                total:
                    interviews.length,

                scheduled:
                    countStatus(
                        "Scheduled"
                    ),

                completed:
                    countStatus(
                        "Completed"
                    ),

                cancelled:
                    interviews.filter(
                        interview => {
                            const status =
                                getStatus(
                                    interview
                                ).toLowerCase();

                            return (
                                status ===
                                    "cancelled" ||
                                status ===
                                    "canceled"
                            );
                        }
                    ).length
            };
        }, [interviews]);

    return (
        <Box className="hm-page">

            <Stack
                direction={{
                    xs: "column",
                    sm: "row"
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: "stretch",
                    sm: "center"
                }}
                spacing={2}
                mb={3}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        Department Interviews
                    </Typography>

                    <Typography
                        color="text.secondary"
                        mt={0.5}
                    >
                        View and manage scheduled
                        candidate interviews.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={
                        loading
                            ? (
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                            )
                            : (
                                <RefreshIcon />
                            )
                    }
                    onClick={
                        loadInterviews
                    }
                    disabled={loading}
                >
                    Refresh
                </Button>
            </Stack>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() =>
                        setError("")
                    }
                >
                    {error}
                </Alert>
            )}

            {successMessage && (
                <Alert
                    severity="success"
                    sx={{ mb: 3 }}
                    onClose={() =>
                        setSuccessMessage("")
                    }
                >
                    {successMessage}
                </Alert>
            )}

            <Grid
                container
                spacing={2}
                mb={3}
            >
                <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={3}
                >
                    <Card className="hm-stat-card">
                        <CardContent>
                            <Typography
                                color="text.secondary"
                                gutterBottom
                            >
                                Total Interviews
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight={700}
                            >
                                {statistics.total}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={3}
                >
                    <Card className="hm-stat-card">
                        <CardContent>
                            <Typography
                                color="text.secondary"
                                gutterBottom
                            >
                                Scheduled
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight={700}
                            >
                                {statistics.scheduled}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={3}
                >
                    <Card className="hm-stat-card">
                        <CardContent>
                            <Typography
                                color="text.secondary"
                                gutterBottom
                            >
                                Completed
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight={700}
                            >
                                {statistics.completed}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={3}
                >
                    <Card className="hm-stat-card">
                        <CardContent>
                            <Typography
                                color="text.secondary"
                                gutterBottom
                            >
                                Cancelled
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight={700}
                            >
                                {statistics.cancelled}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Card className="hm-filter-card">
                <CardContent>
                    <Stack
                        direction={{
                            xs: "column",
                            md: "row"
                        }}
                        spacing={2}
                    >
                        <TextField
                            fullWidth
                            label="Search interviews"
                            placeholder="Candidate, job or location"
                            value={search}
                            onChange={event =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment
                                        position="start"
                                    >
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            select
                            label="Status"
                            value={statusFilter}
                            onChange={event =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                            sx={{
                                minWidth: {
                                    xs: "100%",
                                    md: 220
                                }
                            }}
                        >
                            <MenuItem value="All">
                                All Statuses
                            </MenuItem>

                            <MenuItem value="Scheduled">
                                Scheduled
                            </MenuItem>

                            <MenuItem value="Rescheduled">
                                Rescheduled
                            </MenuItem>

                            <MenuItem value="Completed">
                                Completed
                            </MenuItem>

                            <MenuItem value="Cancelled">
                                Cancelled
                            </MenuItem>
                        </TextField>
                    </Stack>
                </CardContent>
            </Card>


            <TableContainer
                component={Card}
                sx={{ mt: 3 }}
            >
                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>Candidate</TableCell>

                            <TableCell>Job</TableCell>

                            <TableCell>Date</TableCell>

                            <TableCell>Location</TableCell>

                            <TableCell>Status</TableCell>

                            <TableCell align="right">
                                Actions
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {loading ? (

                            <TableRow>

                                <TableCell
                                    align="center"
                                    colSpan={6}
                                    sx={{ py: 6 }}
                                >
                                    <CircularProgress />
                                </TableCell>

                            </TableRow>

                        ) : filteredInterviews.length === 0 ? (

                            <TableRow>

                                <TableCell
                                    align="center"
                                    colSpan={6}
                                    sx={{ py: 6 }}
                                >
                                    No interviews found.
                                </TableCell>

                            </TableRow>

                        ) : (

                            filteredInterviews.map(
                                interview => (

                                    <TableRow
                                        hover
                                        key={
                                            getInterviewId(
                                                interview
                                            )
                                        }
                                    >

                                        <TableCell>
                                            {getCandidateName(
                                                interview
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {getJobTitle(
                                                interview
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {formatDate(
                                                getInterviewDate(
                                                    interview
                                                )
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {getLocation(
                                                interview
                                            )}
                                        </TableCell>

                                        <TableCell>

                                            <Chip
                                                size="small"
                                                label={getStatus(
                                                    interview
                                                )}
                                                color={getStatusColor(
                                                    getStatus(
                                                        interview
                                                    )
                                                )}
                                            />

                                        </TableCell>

                                        <TableCell
                                            align="right"
                                        >

                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                justifyContent="flex-end"
                                            >

                                                <Button
                                                    size="small"
                                                    startIcon={
                                                        <VisibilityIcon />
                                                    }
                                                    onClick={() =>
                                                        openView(
                                                            interview
                                                        )
                                                    }
                                                >
                                                    View
                                                </Button>

                                                <Button
                                                    size="small"
                                                    startIcon={
                                                        <EventRepeatIcon />
                                                    }
                                                    onClick={() =>
                                                        openReschedule(
                                                            interview
                                                        )
                                                    }
                                                >
                                                    Reschedule
                                                </Button>

                                            </Stack>

                                        </TableCell>

                                    </TableRow>

                                )
                            )

                        )}

                    </TableBody>

                </Table>

            </TableContainer>

            <Dialog
                open={viewOpen}
                onClose={closeView}
                fullWidth
                maxWidth="sm"
            >

                <DialogTitle>
                    Interview Details
                </DialogTitle>

                <DialogContent dividers>

                    {selectedInterview && (

                        <Stack spacing={2}>

                            <Typography>
                                <strong>Candidate:</strong>{" "}
                                {getCandidateName(
                                    selectedInterview
                                )}
                            </Typography>

                            <Typography>
                                <strong>Job:</strong>{" "}
                                {getJobTitle(
                                    selectedInterview
                                )}
                            </Typography>

                            <Typography>
                                <strong>Date:</strong>{" "}
                                {formatDate(
                                    getInterviewDate(
                                        selectedInterview
                                    )
                                )}
                            </Typography>

                            <Typography>
                                <strong>Location:</strong>{" "}
                                {getLocation(
                                    selectedInterview
                                )}
                            </Typography>

                            <Typography>
                                <strong>Status:</strong>{" "}
                                {getStatus(
                                    selectedInterview
                                )}
                            </Typography>

                        </Stack>

                    )}

                </DialogContent>

                <DialogActions>

                    <Button
                        color="success"
                        variant="contained"
                        startIcon={
                            <CheckCircleIcon />
                        }
                        disabled={actionLoading}
                        onClick={() =>
                            updateStatus(
                                "Completed"
                            )
                        }
                    >
                        Complete
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        startIcon={
                            <CloseIcon />
                        }
                        disabled={actionLoading}
                        onClick={() =>
                            updateStatus(
                                "Cancelled"
                            )
                        }
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={closeView}
                    >
                        Close
                    </Button>

                </DialogActions>

            </Dialog>


            <Dialog
                open={rescheduleOpen}
                onClose={closeReschedule}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Reschedule Interview
                </DialogTitle>

                <DialogContent dividers>
                    <Stack
                        spacing={2}
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            label="New Interview Date"
                            type="datetime-local"
                            value={newDate}
                            onChange={event =>
                                setNewDate(
                                    event.target.value
                                )
                            }
                            InputLabelProps={{
                                shrink: true
                            }}
                            fullWidth
                        />

                        <TextField
                            label="Interview Location"
                            value={newLocation}
                            onChange={event =>
                                setNewLocation(
                                    event.target.value
                                )
                            }
                            fullWidth
                        />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={closeReschedule}
                        disabled={actionLoading}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={
                            actionLoading
                                ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                )
                                : (
                                    <CalendarMonthIcon />
                                )
                        }
                        onClick={saveReschedule}
                        disabled={actionLoading}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}
