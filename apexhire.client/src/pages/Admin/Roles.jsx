
import {
    Alert,
    Box,
    Breadcrumbs,
    Button,
    Container,
    Link,
    Paper,
    Skeleton,
    Snackbar,
    Stack,
    Typography
} from "@mui/material";

import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

import useRoles from "../../hooks/useRoles";

import {
    EmptyRoles,
    RoleDetailsDialog,
    RoleStatsCards,
    RoleTable,
    RoleToolbar
} from "../../components/Admin/roles";

function RolesLoadingState() {
    return (
        <Stack spacing={3}>
            <Stack
                direction={{
                    xs: "column",
                    md: "row"
                }}
                spacing={2}
            >
                {[1, 2, 3, 4].map(item => (
                    <Skeleton
                        key={item}
                        variant="rounded"
                        height={120}
                        sx={{
                            flex: 1
                        }}
                    />
                ))}
            </Stack>

            <Skeleton
                variant="rounded"
                height={72}
            />

            <Skeleton
                variant="rounded"
                height={360}
            />
        </Stack>
    );
}

export default function Roles() {
    const {
        visibleRoles,
        statistics,
        filters,
        loading,
        refreshing,
        error,
        selectedRole,
        detailsOpen,
        setSearch,
        setSortBy,
        resetFilters,
        openDetails,
        closeDetails,
        refreshRoles,
        clearError
    } = useRoles();

    const hasFilters =
        Boolean(filters.search) ||
        filters.sortBy !== "value";

    return (
        <Container
            maxWidth="xl"
            sx={{
                py: {
                    xs: 3,
                    md: 4
                }
            }}
        >
            <Stack spacing={3}>
                <Breadcrumbs
                    aria-label="Roles breadcrumb"
                >
                    <Link
                        underline="hover"
                        color="inherit"
                        href="/admin"
                    >
                        Administration
                    </Link>

                    <Typography color="text.primary">
                        Roles
                    </Typography>
                </Breadcrumbs>

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
                    spacing={2}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                    >
                        <Box
                            sx={{
                                display: "grid",
                                placeItems: "center",
                                width: 52,
                                height: 52,
                                borderRadius: 2,
                                bgcolor: "primary.main",
                                color: "primary.contrastText"
                            }}
                        >
                            <SecurityOutlinedIcon />
                        </Box>

                        <Box>
                            <Typography
                                variant="h4"
                                fontWeight={700}
                            >
                                Roles
                            </Typography>

                            <Typography
                                color="text.secondary"
                            >
                                View the predefined system roles used by ApexHire.
                            </Typography>
                        </Box>
                    </Stack>

                    <Button
                        variant="outlined"
                        startIcon={
                            <RefreshOutlinedIcon />
                        }
                        onClick={refreshRoles}
                        disabled={refreshing}
                    >
                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </Button>
                </Stack>

                {loading ? (
                    <RolesLoadingState />
                ) : (
                    <>
                        <RoleStatsCards
                            statistics={statistics}
                        />

                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2
                            }}
                        >
                            <RoleToolbar
                                search={filters.search}
                                sortBy={filters.sortBy}
                                refreshing={refreshing}
                                onSearchChange={setSearch}
                                onSortChange={setSortBy}
                                onRefresh={refreshRoles}
                                onReset={resetFilters}
                            />
                        </Paper>

                        {visibleRoles.length > 0 ? (
                            <RoleTable
                                roles={visibleRoles}
                                onView={openDetails}
                            />
                        ) : (
                            <EmptyRoles
                                hasFilters={hasFilters}
                                onReset={resetFilters}
                            />
                        )}
                    </>
                )}
            </Stack>

            <RoleDetailsDialog
                open={detailsOpen}
                role={selectedRole}
                onClose={closeDetails}
            />

            <Snackbar
                open={Boolean(error)}
                autoHideDuration={6000}
                onClose={clearError}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    onClose={clearError}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={refreshRoles}
                        >
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
}
