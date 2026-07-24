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
    Rating,
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

import DeleteIcon
    from "@mui/icons-material/Delete";

import RefreshIcon
    from "@mui/icons-material/Refresh";

import SearchIcon
    from "@mui/icons-material/Search";

import VisibilityIcon
    from "@mui/icons-material/Visibility";

import hiringManagerService
    from "../../services/hiringManagerService";

import "../../styles/HiringManagerFeedback.css";

export default function Feedback() {
    const [feedback, setFeedback] =
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

    const [ratingFilter, setRatingFilter] =
        useState("All");

    const [
        selectedFeedback,
        setSelectedFeedback
    ] = useState(null);

    const [viewOpen, setViewOpen] =
        useState(false);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    function getFeedbackId(item) {
        return (
            item?.id ??
            item?.feedbackId ??
            null
        );
    }

    function getCandidateName(item) {
        return (
            item?.candidateName ??
            item?.candidateFullName ??
            item?.candidate?.fullName ??
            item?.candidate?.name ??
            "-"
        );
    }

    function getJobTitle(item) {
        return (
            item?.jobTitle ??
            item?.position ??
            item?.job?.title ??
            "-"
        );
    }

    function getComments(item) {
        return (
            item?.comments ??
            item?.comment ??
            "-"
        );
    }

    function getOverallRating(item) {
        return Number(
            item?.overallExperienceRating ??
            item?.overallRating ??
            0
        );
    }

    function getProfessionalismRating(item) {
        return Number(
            item?.interviewerProfessionalismRating ??
            item?.professionalismRating ??
            0
        );
    }

    function getClarityRating(item) {
        return Number(
            item?.processClarityRating ??
            item?.clarityRating ??
            0
        );
    }

    function getCreatedDate(item) {
        return (
            item?.createdAt ??
            item?.submittedAt ??
            item?.date ??
            null
        );
    }

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

        return date.toLocaleString();
    }

    const loadFeedback =
        useCallback(async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await hiringManagerService
                        .getCandidateFeedback();

                setFeedback(
                    Array.isArray(data)
                        ? data
                        : []
                );
            }
            catch (err) {
                setError(
                    err?.response?.data?.message ??
                    err?.message ??
                    "Unable to load candidate feedback."
                );
            }
            finally {
                setLoading(false);
            }
        }, []);

    useEffect(() => {
        loadFeedback();
    }, [loadFeedback]);

    const filteredFeedback =
        useMemo(() => {
            const keyword =
                search.trim().toLowerCase();

            return feedback.filter(item => {
                const candidate =
                    getCandidateName(item)
                        .toLowerCase();

                const job =
                    getJobTitle(item)
                        .toLowerCase();

                const comments =
                    getComments(item)
                        .toLowerCase();

                const rating =
                    getOverallRating(item);

                const searchMatch =
                    !keyword ||
                    candidate.includes(keyword) ||
                    job.includes(keyword) ||
                    comments.includes(keyword);

                const ratingMatch =
                    ratingFilter === "All" ||
                    rating === Number(
                        ratingFilter
                    );

                return (
                    searchMatch &&
                    ratingMatch
                );
            });
        }, [
            feedback,
            search,
            ratingFilter
        ]);

    function openView(item) {
        setSelectedFeedback(item);
        setViewOpen(true);
        setError("");
        setSuccessMessage("");
    }

    function openDelete(item) {
        setSelectedFeedback(item);
        setDeleteOpen(true);
        setError("");
        setSuccessMessage("");
    }

    function closeView() {
        if (actionLoading) {
            return;
        }

        setViewOpen(false);
        setSelectedFeedback(null);
    }

    function closeDelete() {
        if (actionLoading) {
            return;
        }

        setDeleteOpen(false);
        setSelectedFeedback(null);
    }

    async function deleteFeedback() {

        const feedbackId =
            getFeedbackId(
                selectedFeedback
            );

        if (!feedbackId) {
            setError(
                "Feedback ID not found."
            );
            return;
        }

        try {

            setActionLoading(true);
            setError("");
            setSuccessMessage("");

            await hiringManagerService
                .deleteCandidateFeedback(
                    feedbackId
                );

            setSuccessMessage(
                "Feedback deleted successfully."
            );

            setDeleteOpen(false);
            setSelectedFeedback(null);

            await loadFeedback();

        }
        catch (err) {

            setError(
                err?.response?.data?.message ??
                err?.message ??
                "Unable to delete feedback."
            );

        }
        finally {

            setActionLoading(false);

        }

    }

    const totalFeedback =
        feedback.length;

    const averageRating =
        feedback.length
            ? (
                feedback.reduce(
                    (sum, item) =>
                        sum +
                        getOverallRating(item),
                    0
                ) / feedback.length
            ).toFixed(1)
            : 0;

    return (

        <Box className="hm-page">

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >

                <Typography
                    variant="h4"
                    fontWeight={700}
                >
                    Candidate Feedback
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={loadFeedback}
                >
                    Refresh
                </Button>

            </Stack>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}

            {successMessage && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                >
                    {successMessage}
                </Alert>
            )}

            <Grid
                container
                spacing={2}
                mb={3}
            >

                <Grid item xs={12} md={6}>
                    <Card className="hm-stat-card">
                        <CardContent>

                            <Typography color="text.secondary">
                                Total Feedback
                            </Typography>

                            <Typography variant="h4">
                                {totalFeedback}
                            </Typography>

                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card className="hm-stat-card">
                        <CardContent>

                            <Typography color="text.secondary">
                                Average Rating
                            </Typography>

                            <Typography variant="h4">
                                {averageRating}
                            </Typography>

                        </CardContent>
                    </Card>
                </Grid>

            </Grid>

            <Stack
                direction="row"
                spacing={2}
                mb={3}
            >

                <TextField
                    fullWidth
                    label="Search"
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                />

                <TextField
                    select
                    label="Rating"
                    value={ratingFilter}
                    sx={{ width: 180 }}
                    onChange={(e) =>
                        setRatingFilter(
                            e.target.value
                        )
                    }
                >

                    <MenuItem value="All">
                        All
                    </MenuItem>

                    <MenuItem value="5">5 Stars</MenuItem>
                    <MenuItem value="4">4 Stars</MenuItem>
                    <MenuItem value="3">3 Stars</MenuItem>
                    <MenuItem value="2">2 Stars</MenuItem>
                    <MenuItem value="1">1 Star</MenuItem>

                </TextField>

            </Stack>

            <TableContainer component={Card}>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                Candidate
                            </TableCell>

                            <TableCell>
                                Job
                            </TableCell>

                            <TableCell>
                                Rating
                            </TableCell>

                            <TableCell>
                                Date
                            </TableCell>

                            <TableCell align="right">
                                Actions
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>


                        {loading ? (

                            <TableRow>

                                <TableCell
                                    colSpan={5}
                                    align="center"
                                    sx={{ py: 6 }}
                                >
                                    <CircularProgress />
                                </TableCell>

                            </TableRow>

                        ) : filteredFeedback.length === 0 ? (

                            <TableRow>

                                <TableCell
                                    colSpan={5}
                                    align="center"
                                    sx={{ py: 6 }}
                                >
                                    No feedback found.
                                </TableCell>

                            </TableRow>

                        ) : (

                            filteredFeedback.map(item => (

                                <TableRow
                                    hover
                                    key={getFeedbackId(item)}
                                >

                                    <TableCell>
                                        {getCandidateName(item)}
                                    </TableCell>

                                    <TableCell>
                                        {getJobTitle(item)}
                                    </TableCell>

                                    <TableCell>

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                        >

                                            <Rating
                                                value={getOverallRating(item)}
                                                readOnly
                                                size="small"
                                            />

                                            <Chip
                                                size="small"
                                                label={`${getOverallRating(item)}/5`}
                                            />

                                        </Stack>

                                    </TableCell>

                                    <TableCell>
                                        {formatDate(
                                            getCreatedDate(item)
                                        )}
                                    </TableCell>

                                    <TableCell align="right">

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
                                                    openView(item)
                                                }
                                            >
                                                View
                                            </Button>

                                            <Button
                                                size="small"
                                                color="error"
                                                startIcon={
                                                    <DeleteIcon />
                                                }
                                                onClick={() =>
                                                    openDelete(item)
                                                }
                                            >
                                                Delete
                                            </Button>

                                        </Stack>

                                    </TableCell>

                                </TableRow>

                            ))

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
                    Feedback Details
                </DialogTitle>

                <DialogContent dividers>

                    {selectedFeedback && (

                        <Stack spacing={2}>

                            <Typography>
                                <strong>Candidate:</strong>{" "}
                                {getCandidateName(
                                    selectedFeedback
                                )}
                            </Typography>

                            <Typography>
                                <strong>Job:</strong>{" "}
                                {getJobTitle(
                                    selectedFeedback
                                )}
                            </Typography>

                            <Box>
                                <Typography fontWeight={600}>
                                    Overall Experience
                                </Typography>

                                <Rating
                                    value={getOverallRating(
                                        selectedFeedback
                                    )}
                                    readOnly
                                />
                            </Box>

                            <Box>
                                <Typography fontWeight={600}>
                                    Interviewer Professionalism
                                </Typography>

                                <Rating
                                    value={getProfessionalismRating(
                                        selectedFeedback
                                    )}
                                    readOnly
                                />
                            </Box>

                            <Box>
                                <Typography fontWeight={600}>
                                    Process Clarity
                                </Typography>

                                <Rating
                                    value={getClarityRating(
                                        selectedFeedback
                                    )}
                                    readOnly
                                />
                            </Box>

                            <Typography>
                                <strong>Comments:</strong>
                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{
                                    whiteSpace: "pre-wrap"
                                }}
                            >
                                {getComments(
                                    selectedFeedback
                                )}
                            </Typography>

                            <Typography>
                                <strong>Submitted:</strong>{" "}
                                {formatDate(
                                    getCreatedDate(
                                        selectedFeedback
                                    )
                                )}
                            </Typography>

                        </Stack>

                    )}

                </DialogContent>

                <DialogActions>

                    <Button onClick={closeView}>
                        Close
                    </Button>

                </DialogActions>

            </Dialog>


            <Dialog
                open={deleteOpen}
                onClose={closeDelete}
                fullWidth
                maxWidth="xs"
            >

                <DialogTitle>
                    Delete Feedback
                </DialogTitle>

                <DialogContent>

                    <Typography>
                        Are you sure you want to delete this candidate feedback?
                    </Typography>

                    {selectedFeedback && (

                        <Box mt={2}>

                            <Typography fontWeight={600}>
                                {getCandidateName(selectedFeedback)}
                            </Typography>

                            <Typography
                                color="text.secondary"
                            >
                                {getJobTitle(selectedFeedback)}
                            </Typography>

                        </Box>

                    )}

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={closeDelete}
                        disabled={actionLoading}
                    >
                        Cancel
                    </Button>

                    <Button
                        color="error"
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
                                    <DeleteIcon />
                                )
                        }
                        onClick={deleteFeedback}
                        disabled={actionLoading}
                    >
                        Delete
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>

    );

}
