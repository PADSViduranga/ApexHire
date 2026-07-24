import {
    useRef,
    useState,
} from "react";

import candidateProfileService
    from "../../../services/candidateProfileService";

import getErrorMessage
    from "../../../utils/getErrorMessage";

import "./CoverPhotoUpload.css";

export default function CoverPhotoUpload({
    reload,
}) {
    const fileInputRef = useRef(null);

    const [uploading, setUploading] =
        useState(false);

    async function handleFileChange(event) {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert(
                "Please select a JPG, PNG, or WEBP image."
            );

            event.target.value = "";
            return;
        }

        if (file.size > 8 * 1024 * 1024) {
            alert(
                "The cover photo must be smaller than 8 MB."
            );

            event.target.value = "";
            return;
        }

        try {
            setUploading(true);

            await candidateProfileService
                .uploadCoverPhoto(file);

            await reload?.();
        }
        catch (error) {
            console.error(
                "Cover photo upload failed:",
                error.response?.status,
                error.response?.data,
                error
            );

            alert(
                getErrorMessage(
                    error,
                    "Failed to upload cover photo."
                )
            );
        }
        finally {
            setUploading(false);
            event.target.value = "";
        }
    }

    function openFilePicker() {
        if (!uploading) {
            fileInputRef.current?.click();
        }
    }

    return (
        <div className="cover-upload">
            <input
                ref={fileInputRef}
                className="cover-upload__input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploading}
                onChange={handleFileChange}
            />

            <button
                type="button"
                className="cover-upload-btn"
                disabled={uploading}
                aria-busy={uploading}
                onClick={openFilePicker}
            >
                {uploading ? (
                    <span
                        className="cover-upload__spinner"
                        aria-hidden="true"
                    />
                ) : (
                    <span
                        className="cover-upload__icon"
                        aria-hidden="true"
                    >
                        📷
                    </span>
                )}

                <span className="cover-upload__text">
                    {uploading
                        ? "Uploading..."
                        : "Change Cover"}
                </span>
            </button>
        </div>
    );
}
