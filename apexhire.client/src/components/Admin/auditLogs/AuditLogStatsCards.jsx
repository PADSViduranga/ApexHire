import PropTypes from "prop-types";

import {
    Card,
    CardContent,
    Grid,
    Stack,
    Typography,
} from "@mui/material";

import "./AuditLogStatsCards.css";

function StatCard({
    title,
    value,
    colorClass,
    index,
}) {
    return (
        <Card
            elevation={0}
            className={`hm-audit-stat-card ${colorClass}`}
            style={{
                animationDelay: `${index * 80}ms`,
            }}
        >
            <CardContent className="hm-audit-stat-content">

                <span className="hm-audit-stat-number">
                    {String(index + 1).padStart(2, "0")}
                </span>

                <Stack spacing={1}>

                    <Typography
                        className="hm-audit-stat-title"
                    >
                        {title}
                    </Typography>

                    <Typography
                        className="hm-audit-stat-value"
                    >
                        {value.toLocaleString()}
                    </Typography>

                </Stack>

                <span className="hm-audit-stat-line" />

            </CardContent>
        </Card>
    );
}

StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    colorClass: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
};

export default function AuditLogStatsCards({
    auditLogs = [],
}) {

    const totalLogs =
        auditLogs.length;

    const successCount =
        auditLogs.filter(
            log =>
                String(log.status)
                    .toLowerCase() ===
                "success"
        ).length;

    const failureCount =
        auditLogs.filter(
            log =>
                String(log.status)
                    .toLowerCase() ===
                "failure"
        ).length;

    const warningCount =
        auditLogs.filter(
            log =>
                String(log.severity)
                    .toLowerCase() ===
                "warning"
        ).length;

    const errorCount =
        auditLogs.filter(
            log =>
                String(log.severity)
                    .toLowerCase() ===
                "error"
        ).length;

    const cards = [
        {
            title: "Total Logs",
            value: totalLogs,
            color: "primary",
        },
        {
            title: "Successful",
            value: successCount,
            color: "success",
        },
        {
            title: "Failed",
            value: failureCount,
            color: "danger",
        },
        {
            title: "Warnings",
            value: warningCount,
            color: "warning",
        },
        {
            title: "Errors",
            value: errorCount,
            color: "error",
        },
    ];

    return (
        <Grid
            container
            spacing={3}
            className="hm-audit-stat-grid"
        >
            {cards.map(
                (
                    card,
                    index
                ) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={2.4}
                        key={card.title}
                    >
                        <StatCard
                            title={card.title}
                            value={card.value}
                            colorClass={card.color}
                            index={index}
                        />
                    </Grid>
                )
            )}
        </Grid>
    );
}

AuditLogStatsCards.propTypes = {
    auditLogs: PropTypes.array,
};
