import {
    FormControl,
    IconButton,
    InputAdornment,
    MenuItem,
    Select,
    Stack,
    TextField,
    Tooltip
} from "@mui/material";

import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import {
    ROLE_SORT_OPTIONS
} from "../../../utils/roleConstants";

export default function RoleToolbar({
    search = "",
    sortBy = "value",
    refreshing = false,
    onSearchChange,
    onSortChange,
    onRefresh,
    onReset
}) {
    const hasActiveFilters =
        Boolean(search) ||
        sortBy !== "value";

    return (
        <Stack
            direction={{
                xs: "column",
                md: "row"
            }}
            spacing={2}
            alignItems={{
                xs: "stretch",
                md: "center"
            }}
            justifyContent="space-between"
        >
            <TextField
                fullWidth
                value={search}
                onChange={event =>
                    onSearchChange?.(
                        event.target.value
                    )
                }
                placeholder="Search roles"
                inputProps={{
                    "aria-label": "Search roles"
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchOutlinedIcon />
                        </InputAdornment>
                    ),
                    endAdornment: search ? (
                        <InputAdornment position="end">
                            <Tooltip title="Clear search">
                                <IconButton
                                    edge="end"
                                    size="small"
                                    aria-label="Clear role search"
                                    onClick={() =>
                                        onSearchChange?.("")
                                    }
                                >
                                    <ClearOutlinedIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    ) : null
                }}
                sx={{
                    maxWidth: {
                        xs: "100%",
                        md: 520
                    }
                }}
            />

            <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
            >
                <FormControl
                    size="small"
                    sx={{
                        minWidth: 210
                    }}
                >
                    <Select
                        value={sortBy}
                        onChange={event =>
                            onSortChange?.(
                                event.target.value
                            )
                        }
                        inputProps={{
                            "aria-label": "Sort roles"
                        }}
                    >
                        {ROLE_SORT_OPTIONS.map(
                            option => (
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            )
                        )}
                    </Select>
                </FormControl>

                {hasActiveFilters && (
                    <Tooltip title="Reset filters">
                        <IconButton
                            aria-label="Reset role filters"
                            onClick={onReset}
                        >
                            <ClearOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                )}

                <Tooltip title="Refresh roles">
                    <span>
                        <IconButton
                            aria-label="Refresh roles"
                            onClick={onRefresh}
                            disabled={refreshing}
                        >
                            <RefreshOutlinedIcon
                                sx={{
                                    animation: refreshing
                                        ? "role-spin 0.9s linear infinite"
                                        : "none",
                                    "@keyframes role-spin": {
                                        from: {
                                            transform: "rotate(0deg)"
                                        },
                                        to: {
                                            transform: "rotate(360deg)"
                                        }
                                    }
                                }}
                            />
                        </IconButton>
                    </span>
                </Tooltip>
            </Stack>
        </Stack>
    );
}
