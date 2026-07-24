import {
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import RoleAvatar from "./RoleAvatar";
import RoleStatusChip from "./RoleStatusChip";

export default function RoleTable({
    roles = [],
    onView
}) {
    return (
        <TableContainer
            component={Paper}
            elevation={2}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell width={80}>
                            Role
                        </TableCell>

                        <TableCell>
                            Name
                        </TableCell>

                        <TableCell>
                            Display Name
                        </TableCell>

                        <TableCell>
                            Description
                        </TableCell>

                        <TableCell width={170}>
                            Type
                        </TableCell>

                        <TableCell
                            width={110}
                            align="center"
                        >
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {roles.map(role => (
                        <TableRow
                            hover
                            key={role.value}
                        >
                            <TableCell>
                                <RoleAvatar
                                    role={role}
                                />
                            </TableCell>

                            <TableCell>
                                <Typography
                                    fontWeight={600}
                                >
                                    {role.name}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Value: {role.value}
                                </Typography>
                            </TableCell>

                            <TableCell>
                                <Typography
                                    fontWeight={500}
                                >
                                    {role.displayName}
                                </Typography>
                            </TableCell>

                            <TableCell>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {role.description}
                                </Typography>
                            </TableCell>

                            <TableCell>
                                <RoleStatusChip
                                    role={role}
                                />
                            </TableCell>

                            <TableCell
                                align="center"
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="center"
                                >
                                    <Tooltip title="View Details">
                                        <IconButton
                                            color="primary"
                                            onClick={() =>
                                                onView?.(
                                                    role
                                                )
                                            }
                                        >
                                            <VisibilityOutlinedIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}

                    {roles.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                align="center"
                                sx={{
                                    py: 8
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    No roles found.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
