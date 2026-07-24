import PropTypes from "prop-types";
import {
    Grid,
} from "@mui/material";

import TopJobsTable from "./TopJobsTable";
import TopOrganizationsTable from "./TopOrganizationsTable";
import TopRecruitersTable from "./TopRecruitersTable";

export default function ReportTables({
    topJobs = [],
    topRecruiters = [],
    topOrganizations = [],
    isLoading = false,
}) {
    return (
        <Grid
            container
            spacing={2}
            sx={{
                mb: 3,
            }}
        >
            <Grid
                item
                xs={12}
            >
                <TopJobsTable
                    data={topJobs}
                    isLoading={isLoading}
                />
            </Grid>

            <Grid
                item
                xs={12}
                xl={6}
            >
                <TopRecruitersTable
                    data={topRecruiters}
                    isLoading={isLoading}
                />
            </Grid>

            <Grid
                item
                xs={12}
                xl={6}
            >
                <TopOrganizationsTable
                    data={topOrganizations}
                    isLoading={isLoading}
                />
            </Grid>
        </Grid>
    );
}

ReportTables.propTypes = {
    topJobs:
        PropTypes.array,

    topRecruiters:
        PropTypes.array,

    topOrganizations:
        PropTypes.array,

    isLoading:
        PropTypes.bool,
};
