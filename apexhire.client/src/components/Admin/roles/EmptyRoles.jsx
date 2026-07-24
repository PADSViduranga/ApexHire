import {
    Box,
    Button,
    Stack,
    Typography
} from "@mui/material";

import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";

export default function EmptyRoles({
    hasFilters = false,
    onReset
}) {
    return (
        <Box
            sx={{
                py: 10,
                px: 3,
                borderRadius: 2,
                border: theme =>
                    `1px dashed ${theme.palette.divider}`,
                textAlign: "center",
                bgcolor: "background.paper"
            }}
        >
            <Stack
                spacing={2}
                alignItems="center"
            >
                <SearchOffOutlinedIcon
                    color="disabled"
                    sx={{
                        fontSize: 72
                    }}
                />

                <Typography
                    variant="h5"
                    fontWeight={700}
                >
                    {hasFilters
                        ? "No matching roles found"
                        : "No roles available"}
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        maxWidth: 520
                    }}
                >
                    {hasFilters
                        ? "Try changing your search text or sorting options to find the role you are looking for."
                        : "There are currently no roles available to display."}
                </Typography>

                {hasFilters && (
                    <Button
                        variant="contained"
                        onClick={onReset}
                    >
                        Reset Filters
                    </Button>
                )}
            </Stack>
        </Box>
    );
}
