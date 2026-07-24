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
    Grid,
    LinearProgress,
    Stack,
    Typography
} from "@mui/material";

import AnalyticsIcon from "@mui/icons-material/Analytics";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import StarIcon from "@mui/icons-material/Star";

import hiringManagerService
    from "../../services/hiringManagerService";

import "../../styles/HiringManagerAnalytics.css";

const APPLICATION_STATUSES = [
    "Submitted",
    "UnderReview",
    "Shortlisted",
    "InterviewScheduled",
    "Offered",
    "Hired",
    "Rejected"
];

function extractArray(response) {
    const value = response?.data ?? response;

    if (Array.isArray(value)) {
        return value;
    }

    if (Array.isArray(value?.items)) {
        return value.items;
    }

    if (Array.isArray(value?.data)) {
        return value.data;
    }

    return [];
}

function normalizeStatus(value) {
    return String(value ?? "")
        .replace(/[\s_-]+/g, "")
        .toLowerCase();
}

function formatStatus(value) {
    const text = String(value ?? "Unknown")
        .replace(/[_-]+/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2");

    return text
        .replace(/\s+/g, " ")
        .trim();
}

function getRecentDate(item) {
    return (
        item?.updatedAt ??
        item?.createdAt ??
        item?.appliedAt ??
        item?.applicationDate ??
        item?.scheduledAt ??
        item?.scheduledDateTime ??
        item?.interviewDate ??
        null
    );
}

function formatDate(value) {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString();
}

export default function Analytics() {
    const [applications, setApplications] =
        useState([]);

    const [interviews, setInterviews] =
        useState([]);

    const [feedback, setFeedback] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const loadAnalytics =
        useCallback(async () => {
            try {
                setLoading(true);
                setError("");

                const results =
                    await Promise.allSettled([
                        hiringManagerService
                            .getDepartmentApplications(),

                        hiringManagerService
                            .getDepartmentInterviews(),

                        hiringManagerService
                            .getCandidateFeedback()
                    ]);

                const applicationResult =
                    results[0];

                const interviewResult =
                    results[1];

                const feedbackResult =
                    results[2];

                setApplications(
                    applicationResult.status ===
                    "fulfilled"
                        ? extractArray(
                            applicationResult.value
                        )
                        : []
                );

                setInterviews(
                    interviewResult.status ===
                    "fulfilled"
                        ? extractArray(
                            interviewResult.value
                        )
                        : []
                );

                setFeedback(
                    feedbackResult.status ===
                    "fulfilled"
                        ? extractArray(
                            feedbackResult.value
                        )
                        : []
                );

                const failedResults =
                    results.filter(
                        result =>
                            result.status ===
                            "rejected"
                    );

                if (
                    failedResults.length ===
                    results.length
                ) {
                    throw new Error(
                        "Unable to load analytics data."
                    );
                }

                if (failedResults.length > 0) {
                    setError(
                        "Some analytics information could not be loaded."
                    );
                }
            }
            catch (err) {
                setError(
                    err?.response?.data?.message ??
                    err?.response?.data ??
                    err?.message ??
                    "Unable to load analytics."
                );

                setApplications([]);
                setInterviews([]);
                setFeedback([]);
            }
            finally {
                setLoading(false);
            }
        }, []);

    useEffect(() => {
        loadAnalytics();
    }, [loadAnalytics]);

    const statusData =
        useMemo(() => {
            return APPLICATION_STATUSES.map(
                status => {
                    const target =
                        normalizeStatus(status);

                    const count =
                        applications.filter(
                            application =>
                                normalizeStatus(
                                    application?.status
                                ) === target
                        ).length;

                    return {
                        status,
                        count
                    };
                }
            );
        }, [applications]);

    const totalApplications =
        applications.length;

    const totalInterviews =
        interviews.length;

    const completedInterviews =
        useMemo(() => {
            return interviews.filter(
                interview =>
                    normalizeStatus(
                        interview?.status
                    ) === "completed"
            ).length;
        }, [interviews]);

    const hiredApplications =
        useMemo(() => {
            return applications.filter(
                application =>
                    normalizeStatus(
                        application?.status
                    ) === "hired"
            ).length;
        }, [applications]);

    const interviewSuccessRate =
        totalInterviews > 0
            ? Math.round(
                (
                    completedInterviews /
                    totalInterviews
                ) * 100
            )
            : 0;

    const hiringRate =
        totalApplications > 0
            ? Math.round(
                (
                    hiredApplications /
                    totalApplications
                ) * 100
            )
            : 0;

    const averageFeedbackRating =
        useMemo(() => {
            if (feedback.length === 0) {
                return "0.0";
            }

            const validRatings =
                feedback
                    .map(item =>
                        Number(
                            item
                                ?.overallExperienceRating ??
                            item?.overallRating ??
                            item?.rating
                        )
                    )
                    .filter(rating =>
                        Number.isFinite(rating)
                    );

            if (validRatings.length === 0) {
                return "0.0";
            }

            const total =
                validRatings.reduce(
                    (sum, rating) =>
                        sum + rating,
                    0
                );

            return (
                total /
                validRatings.length
            ).toFixed(1);
        }, [feedback]);

    const maximumStatusCount =
        Math.max(
            ...statusData.map(
                item => item.count
            ),
            1
        );

    const recentApplications =
        useMemo(() => {
            return [...applications]
                .sort((first, second) => {
                    const firstTime =
                        new Date(
                            getRecentDate(first) ??
                            0
                        ).getTime();

                    const secondTime =
                        new Date(
                            getRecentDate(second) ??
                            0
                        ).getTime();

                    return secondTime - firstTime;
                })
                .slice(0, 5);
        }, [applications]);

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
                        Hiring Analytics
                    </Typography>

                    <Typography
                        color="text.secondary"
                        mt={0.5}
                    >
                        Department recruitment
                        performance overview.
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
                    onClick={loadAnalytics}
                    disabled={loading}
                >
                    Refresh
                </Button>
            </Stack>

            {error && (
                <Alert
                    severity="warning"
                    sx={{ mb: 3 }}
                    onClose={() =>
                        setError("")
                    }
                >
                    {String(error)}
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
                    <Card className="hm-analytics-card">
                        <CardContent>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Box>
                                    <Typography
                                        color="text.secondary"
                                    >
                                        Applications
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        fontWeight={700}
                                    >
                                        {totalApplications}
                                    </Typography>
                                </Box>

                                <AssignmentIcon
                                    className="hm-analytics-icon"
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={3}
                >
                    <Card className="hm-analytics-card">
                        <CardContent>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Box>
                                    <Typography
                                        color="text.secondary"
                                    >
                                        Interview Success
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        fontWeight={700}
                                    >
                                        {interviewSuccessRate}%
                                    </Typography>
                                </Box>

                                <EventAvailableIcon
                                    className="hm-analytics-icon"
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={3}
                >
                    <Card className="hm-analytics-card">
                        <CardContent>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Box>
                                    <Typography
                                        color="text.secondary"
                                    >
                                        Hiring Rate
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        fontWeight={700}
                                    >
                                        {hiringRate}%
                                    </Typography>
                                </Box>

                                <PersonAddAltIcon
                                    className="hm-analytics-icon"
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={3}
                >
                    <Card className="hm-analytics-card">
                        <CardContent>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Box>
                                    <Typography
                                        color="text.secondary"
                                    >
                                        Average Rating
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        fontWeight={700}
                                    >
                                        {averageFeedbackRating}
                                    </Typography>
                                </Box>

                                <StarIcon
                                    className="hm-analytics-icon"
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {loading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight={300}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        item
                        xs={12}
                        lg={7}
                    >
                        <Card className="hm-analytics-section">
                            <CardContent>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    mb={3}
                                >
                                    <AnalyticsIcon />

                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                    >
                                        Application Status
                                        Distribution
                                    </Typography>
                                </Stack>

                                <Stack spacing={2.5}>
                                    {statusData.map(item => {
                                        const percentage =
                                            Math.round(
                                                (
                                                    item.count /
                                                    maximumStatusCount
                                                ) * 100
                                            );

                                        return (
                                            <Box
                                                key={
                                                    item.status
                                                }
                                            >
                                                <Stack
                                                    direction="row"
                                                    justifyContent="space-between"
                                                    mb={0.75}
                                                >
                                                    <Typography>
                                                        {formatStatus(
                                                            item.status
                                                        )}
                                                    </Typography>

                                                    <Chip
                                                        size="small"
                                                        label={
                                                            item.count
                                                        }
                                                    />
                                                </Stack>

                                                <LinearProgress
                                                    variant="determinate"
                                                    value={
                                                        percentage
                                                    }
                                                    sx={{
                                                        height: 10,
                                                        borderRadius: 5
                                                    }}
                                                />
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        lg={5}
                    >
                        <Card className="hm-analytics-section">
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    mb={3}
                                >
                                    Recent Applications
                                </Typography>

                                {recentApplications.length ===
                                0 ? (
                                    <Typography
                                        color="text.secondary"
                                    >
                                        No recent applications
                                        found.
                                    </Typography>
                                ) : (
                                    <Stack spacing={2}>
                                        {recentApplications.map(
                                            (
                                                application,
                                                index
                                            ) => {
                                                const id =
                                                    application
                                                        ?.id ??
                                                    application
                                                        ?.applicationId ??
                                                    `application-${index}`;

                                                const candidateName =
                                                    application
                                                        ?.candidateName ??
                                                    application
                                                        ?.candidateFullName ??
                                                    application
                                                        ?.candidate
                                                        ?.fullName ??
                                                    application
                                                        ?.candidate
                                                        ?.name ??
                                                    "Unknown Candidate";

                                                const jobTitle =
                                                    application
                                                        ?.jobTitle ??
                                                    application
                                                        ?.job
                                                        ?.title ??
                                                    application
                                                        ?.position ??
                                                    "Unknown Position";

                                                return (
                                                    <Card
                                                        key={id}
                                                        variant="outlined"
                                                    >
                                                        <CardContent>
                                                            <Typography
                                                                fontWeight={
                                                                    700
                                                                }
                                                            >
                                                                {
                                                                    candidateName
                                                                }
                                                            </Typography>

                                                            <Typography
                                                                color="text.secondary"
                                                                mb={1}
                                                            >
                                                                {
                                                                    jobTitle
                                                                }
                                                            </Typography>

                                                            <Stack
                                                                direction={{
                                                                    xs: "column",
                                                                    sm: "row"
                                                                }}
                                                                justifyContent="space-between"
                                                                alignItems={{
                                                                    xs: "flex-start",
                                                                    sm: "center"
                                                                }}
                                                                spacing={1}
                                                            >
                                                                <Chip
                                                                    size="small"
                                                                    color="primary"
                                                                    label={formatStatus(
                                                                        application
                                                                            ?.status
                                                                    )}
                                                                />

                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                >
                                                                    {formatDate(
                                                                        getRecentDate(
                                                                            application
                                                                        )
                                                                    )}
                                                                </Typography>
                                                            </Stack>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            }
                                        )}
                                    </Stack>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
}
