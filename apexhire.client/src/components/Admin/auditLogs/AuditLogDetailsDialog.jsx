import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import AuditLogActionChip from "./AuditLogActionChip";
import AuditLogAvatar from "./AuditLogAvatar";
import {
    getHttpStatusColor,
    getSeverityColor,
    getStatusColor,
} from "../../../utils/auditLogHelpers";

function DetailItem({
    label,
    value,
    children,
}) {
    return (
        <Box>
            <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
            >
                {label}
            </Typography>

            {children || (
                <Typography
                    variant="body2"
                    sx={{
                        mt: 0.5,
                        wordBreak: "break-word",
                    }}
                >
                    {value || "—"}
                </Typography>
            )}
        </Box>
    );
}

DetailItem.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    children: PropTypes.node,
};

function JsonPanel({
    title,
    value,
}) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                height: "100%",
                borderRadius: 2,
            }}
        >
            <Typography
                variant="subtitle2"
                fontWeight={700}
                mb={1}
            >
                {title}
            </Typography>

            <Box
                component="pre"
                sx={{
                    m: 0,
                    p: 1.5,
                    maxHeight: 320,
                    overflow: "auto",
                    borderRadius: 1,
                    bgcolor: "background.default",
                    fontFamily: "monospace",
                    fontSize: "0.78rem",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                }}
            >
                {value || "—"}
            </Box>
        </Paper>
    );
}

JsonPanel.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.string,
};

export default function AuditLogDetailsDialog({
    auditLog,
    open = false,
    isLoading = false,
    error = "",
    onClose,
}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            scroll="paper"
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",
                    gap: 2,
                }}
            >
                <Box>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Audit Log Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Record ID:{" "}
                        {auditLog?.id || "—"}
                    </Typography>
                </Box>

                <IconButton
                    onClick={onClose}
                    aria-label="Close audit log details"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            <DialogContent>
                {isLoading ? (
                    <Box
                        sx={{
                            minHeight: 300,
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                                "center",
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error">
                        {error}
                    </Alert>
                ) : auditLog ? (
                    <Stack spacing={3}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                borderRadius: 2,
                            }}
                        >
                            <Grid
                                container
                                spacing={2}
                                alignItems="center"
                            >
                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >
                                    <AuditLogAvatar
                                        userName={
                                            auditLog.userName
                                        }
                                        email={
                                            auditLog.email
                                        }
                                        initials={
                                            auditLog.userInitials
                                        }
                                        size={48}
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={2}
                                >
                                    <AuditLogActionChip
                                        action={
                                            auditLog.action
                                        }
                                        size="medium"
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={2}
                                >
                                    <Chip
                                        label={
                                            auditLog.severity
                                        }
                                        color={getSeverityColor(
                                            auditLog.severity
                                        )}
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={2}
                                >
                                    <Chip
                                        label={
                                            auditLog.status
                                        }
                                        color={getStatusColor(
                                            auditLog.status
                                        )}
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={2}
                                >
                                    <Chip
                                        label={
                                            auditLog.responseStatusCode
                                                ? `HTTP ${auditLog.responseStatusCode}`
                                                : "No HTTP status"
                                        }
                                        color={getHttpStatusColor(
                                            auditLog.responseStatusCode
                                        )}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                mb={2}
                            >
                                Activity
                            </Typography>

                            <Grid
                                container
                                spacing={2}
                            >
                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >
                                    <DetailItem
                                        label="Module"
                                        value={
                                            auditLog.module
                                        }
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >
                                    <DetailItem
                                        label="Entity"
                                        value={
                                            auditLog.entityLabel
                                        }
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >
                                    <DetailItem
                                        label="Date and time"
                                        value={
                                            auditLog.formattedCreatedAt
                                        }
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                >
                                    <DetailItem
                                        label="Description"
                                        value={
                                            auditLog.description
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                mb={2}
                            >
                                Request Information
                            </Typography>

                            <Grid
                                container
                                spacing={2}
                            >
                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >
                                    <DetailItem
                                        label="HTTP method"
                                        value={
                                            auditLog.httpMethod
                                        }
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >
                                    <DetailItem
                                        label="Request path"
                                        value={
                                            auditLog.requestPath
                                        }
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >
                                    <DetailItem
                                        label="Execution time"
                                        value={
                                            auditLog.formattedExecutionTime
                                        }
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >
                                    <DetailItem
                                        label="IP address"
                                        value={
                                            auditLog.ipAddress
                                        }
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >
                                    <DetailItem
                                        label="Browser"
                                        value={
                                            auditLog.browser
                                        }
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >
                                    <DetailItem
                                        label="Device"
                                        value={
                                            auditLog.device
                                        }
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                >
                                    <DetailItem
                                        label="User agent"
                                        value={
                                            auditLog.userAgent
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                mb={2}
                            >
                                Tracking Information
                            </Typography>

                            <Grid
                                container
                                spacing={2}
                            >
                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >
                                    <DetailItem
                                        label="User ID"
                                        value={
                                            auditLog.userId
                                        }
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >
                                    <DetailItem
                                        label="Trace ID"
                                        value={
                                            auditLog.traceId
                                        }
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                >
                                    <DetailItem
                                        label="Correlation ID"
                                        value={
                                            auditLog.correlationId
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                mb={2}
                            >
                                Changed Values
                            </Typography>

                            <Grid
                                container
                                spacing={2}
                            >
                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                >
                                    <JsonPanel
                                        title="Previous Values"
                                        value={
                                            auditLog.formattedOldValues
                                        }
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={6}
                                >
                                    <JsonPanel
                                        title="New Values"
                                        value={
                                            auditLog.formattedNewValues
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Stack>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}

AuditLogDetailsDialog.propTypes = {
    auditLog: PropTypes.object,
    open: PropTypes.bool,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};
