import { Outlet } from "react-router-dom";

import {
    Box,
    Toolbar
} from "@mui/material";

import AdminSidebar
    from "../components/Admin/AdminSidebar";

export default function AdminLayout() {
    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                bgcolor: "background.default"
            }}
        >
            <AdminSidebar />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3
                }}
            >
                <Toolbar />

                <Outlet />
            </Box>
        </Box>
    );
}
