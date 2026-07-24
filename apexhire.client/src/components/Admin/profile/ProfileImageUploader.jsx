import PropTypes from "prop-types";
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import {
    getInitials,
} from "../../../utils/adminProfileHelpers";

export default function ProfileImageUploader({
    profile,
    isUploading = false,
    isRemoving = false,
    uploadProgress = 0,
    onUpload,
    onRemove,
}) {
    function handleFileChange(
        event
    ) {
        const file =
            event.target.files?.[0];

        if (file) {
            onUpload(file);
        }

        event.target.value = "";
    }

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
            }}
        >
            <Typography
                variant="h6"
                fontWeight={700}
                gutterBottom
            >
                Profile Image
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
            >
                Upload a professional profile picture.
            </Typography>

            <Stack
                spacing={3}
                alignItems="center"
            >
                <Avatar
                    src={
                        profile.profileImageUrl ||
                        undefined
                    }
                    sx={{
                        width: 140,
                        height: 140,
                        fontSize: 42,
                        fontWeight: 700,
                    }}
                >
                    {getInitials(
                        profile.firstName,
                        profile.lastName
                    )}
                </Avatar>

                {isUploading && (
                    <Box
                        sx={{
                            width: "100%",
                            textAlign: "center",
                        }}
                    >
                        <CircularProgress
                            variant="determinate"
                            value={
                                uploadProgress
                            }
                            size={48}
                        />

                        <Typography
                            variant="body2"
                            sx={{ mt: 1 }}
                        >
                            Uploading...
                            {" "}
                            {uploadProgress}
                            %
                        </Typography>
                    </Box>
                )}

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={2}
                    width="100%"
                >
                    <Button
                        fullWidth
                        component="label"
                        variant="contained"
                        startIcon={
                            <CloudUploadOutlinedIcon />
                        }
                        disabled={
                            isUploading
                        }
                    >
                        Upload Image

                        <input
                            hidden
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={
                                handleFileChange
                            }
                        />
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={
                            <DeleteOutlineOutlinedIcon />
                        }
                        disabled={
                            isUploading ||
                            isRemoving ||
                            !profile.profileImageUrl
                        }
                        onClick={
                            onRemove
                        }
                    >
                        {isRemoving
                            ? "Removing..."
                            : "Remove"}
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
}

ProfileImageUploader.propTypes = {
    profile: PropTypes.shape({
        firstName:
            PropTypes.string,
        lastName:
            PropTypes.string,
        profileImageUrl:
            PropTypes.string,
    }).isRequired,

    isUploading:
        PropTypes.bool,

    isRemoving:
        PropTypes.bool,

    uploadProgress:
        PropTypes.number,

    onUpload:
        PropTypes.func.isRequired,

    onRemove:
        PropTypes.func.isRequired,
};
