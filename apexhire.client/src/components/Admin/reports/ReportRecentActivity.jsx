import PropTypes from "prop-types";
import {
    Avatar,
    Box,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Skeleton,
    Typography,
} from "@mui/material";

function getInitials(value) {
    if (!value) {
        return "S";
    }

    return value
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part.charAt(0))
        .join("")
        .toUpperCase();
}

export default function ReportRecentActivity({
    data = [],
    isLoading = false,
}) {
    return (
        <Paper
            elevation={0}
            sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    p: 2.5,
                    borderBottom: 1,
                    borderColor: "divider",
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    Recent Activity
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Latest recruitment and administrative activity.
                </Typography>
            </Box>

            {isLoading ? (
                <Box p={2.5}>
                    {Array.from({
                        length: 5,
                    }).map((_, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                gap: 2,
                                mb: 2,
                            }}
                        >
                            <Skeleton
                                variant="circular"
                                width={40}
                                height={40}
                            />

                            <Box sx={{ flex: 1 }}>
                                <Skeleton width="65%" />
                                <Skeleton width="40%" />
                            </Box>
                        </Box>
                    ))}
                </Box>
            ) : data.length === 0 ? (
                <Box
                    sx={{
                        minHeight: 240,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 3,
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        No recent activity available.
                    </Typography>
                </Box>
            ) : (
                <List disablePadding>
                    {data.map((activity, index) => (
                        <Box
                            key={
                                activity.id ??
                                `${activity.type}-${activity.createdAt}-${index}`
                            }
                        >
                            <ListItem
                                alignItems="flex-start"
                                sx={{
                                    px: 2.5,
                                    py: 2,
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        {getInitials(
                                            activity.userName
                                        )}
                                    </Avatar>
                                </ListItemAvatar>

                                <ListItemText
                                    primary={
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",
                                                gap: 2,
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                            >
                                                {activity.title}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {
                                                    activity.formattedCreatedAt
                                                }
                                            </Typography>
                                        </Box>
                                    }
                                    secondary={
                                        <Box mt={0.5}>
                                            {activity.description && (
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {
                                                        activity.description
                                                    }
                                                </Typography>
                                            )}

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {activity.userName} ·{" "}
                                                {activity.type}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>

                            {index <
                                data.length - 1 && (
                                <Divider
                                    component="li"
                                />
                            )}
                        </Box>
                    ))}
                </List>
            )}
        </Paper>
    );
}

ReportRecentActivity.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),

            type:
                PropTypes.string,

            title:
                PropTypes.string.isRequired,

            description:
                PropTypes.string,

            userName:
                PropTypes.string,

            createdAt:
                PropTypes.string,

            formattedCreatedAt:
                PropTypes.string,
        })
    ),

    isLoading:
        PropTypes.bool,
};
