import PropTypes from "prop-types";

import InsightsIcon
    from "@mui/icons-material/Insights";

import {
    Box,
    Button,
    Paper,
    Typography,
} from "@mui/material";

import "./EmptyAnalyticsState.css";

export default function EmptyAnalyticsState({
    title = "No analytics data found",
    description = "There is no analytics data available for the selected filters.",
    onReset,
}) {
    return (
        <Paper
            elevation={0}
            className="hm-empty-analytics"
        >
            <Box className="hm-empty-analytics-content">
                <Box className="hm-empty-analytics-icon">
                    <InsightsIcon />
                </Box>

                <Typography className="hm-empty-analytics-eyebrow">
                    Analytics Overview
                </Typography>

                <Typography className="hm-empty-analytics-title">
                    {title}
                </Typography>

                <Typography className="hm-empty-analytics-description">
                    {description}
                </Typography>

                {onReset && (
                    <Button
                        variant="contained"
                        onClick={onReset}
                        className="hm-empty-analytics-button"
                    >
                        Reset Filters
                    </Button>
                )}
            </Box>
        </Paper>
    );
}

EmptyAnalyticsState.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    onReset: PropTypes.func,
};
