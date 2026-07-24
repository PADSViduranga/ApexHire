import {
    useRef,
    useState
} from "react";

import candidateProfileService
    from "../../../services/candidateProfileService";

import getErrorMessage
    from "../../../utils/getErrorMessage";

export default function ProfilePhotoUpload({
    reload
}) {
    const fileInputRef =
        useRef(null);

    const [uploading, setUploading] =
        useState(false);

    async function handleFileChange(
        event
    ) {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (
            !allowedTypes.includes(file.type)
        ) {
            alert(
                "Please select a JPG, PNG, or WEBP image."
            );

            event.target.value = "";
            return;
        }

        if (
            file.size >
            5 * 1024 * 1024
        ) {
            alert(
                "The profile photo must be smaller than 5 MB."
            );

            event.target.value = "";
            return;
        }

        try {
            setUploading(true);

            await candidateProfileService
                .uploadProfilePhoto(file);

            await reload();
        }
        catch (error) {
            console.error(
                "Profile photo upload failed:",
                error.response?.status,
                error.response?.data,
                error
            );

            alert(
                getErrorMessage(
                    error,
                    "Failed to upload profile photo."
                )
            );
        }
        finally {
            setUploading(false);
            event.target.value = "";
        }
    }

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                hidden
                accept={
                    "image/jpeg," +
                    "image/png," +
                    "image/webp"
                }
                onChange={
                    handleFileChange
                }
            />

            <button
                type="button"
                className="photo-upload-btn"
                disabled={uploading}
                onClick={() =>
                    fileInputRef.current
                        ?.click()
                }
            >
                {uploading
                    ? "Uploading..."
                    : "Change Photo"}
            </button>
        </>
    );
}