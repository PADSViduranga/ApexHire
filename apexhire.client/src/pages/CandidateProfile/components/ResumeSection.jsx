import {
    useRef,
    useState
} from "react";

import candidateProfileService
    from "../../../services/candidateProfileService";

import getErrorMessage
    from "../../../utils/getErrorMessage";

export default function ResumeSection({
    profile,
    reload
}) {
    const fileInputRef =
        useRef(null);

    const [uploading, setUploading] =
        useState(false);

    const [
        downloading,
        setDownloading
    ] = useState(false);

    async function handleUpload(event) {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        const allowedExtensions = [
            ".pdf",
            ".doc",
            ".docx"
        ];

        const lowerFileName =
            file.name.toLowerCase();

        const hasValidExtension =
            allowedExtensions.some(
                extension =>
                    lowerFileName.endsWith(
                        extension
                    )
            );

        if (!hasValidExtension) {
            alert(
                "Please select a PDF, DOC, or DOCX file."
            );

            event.target.value = "";
            return;
        }

        if (
            file.size >
            10 * 1024 * 1024
        ) {
            alert(
                "The resume must be smaller than 10 MB."
            );

            event.target.value = "";
            return;
        }

        try {
            setUploading(true);

            await candidateProfileService
                .uploadResume(file);

            await reload();
        }
        catch (error) {
            console.error(
                "Resume upload failed:",
                error.response?.status,
                error.response?.data,
                error
            );

            alert(
                getErrorMessage(
                    error,
                    "Failed to upload resume."
                )
            );
        }
        finally {
            setUploading(false);
            event.target.value = "";
        }
    }

    async function handleDownload() {
        try {
            setDownloading(true);

            await candidateProfileService
                .downloadResume();
        }
        catch (error) {
            console.error(
                "Resume download failed:",
                error.response?.status,
                error.response?.data,
                error
            );

            alert(
                getErrorMessage(
                    error,
                    "Failed to download resume."
                )
            );
        }
        finally {
            setDownloading(false);
        }
    }

    return (
        <section className="profile-card">
            <div className="card-header">
                <h2>Resume</h2>

                <button
                    type="button"
                    className="primary-btn"
                    disabled={uploading}
                    onClick={() =>
                        fileInputRef.current
                            ?.click()
                    }
                >
                    {uploading
                        ? "Uploading..."
                        : profile
                            ?.resumeFileName
                            ? "Replace Resume"
                            : "Upload Resume"}
                </button>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleUpload}
            />

            {profile?.resumeFileName ? (
                <div className="resume-card">
                    <div>
                        <h3>
                            {
                                profile
                                    .resumeFileName
                            }
                        </h3>

                        {profile
                            .resumeUploadedAt && (
                                <p>
                                    Uploaded on{" "}
                                    {new Date(
                                        profile
                                            .resumeUploadedAt
                                    )
                                        .toLocaleDateString()}
                                </p>
                            )}
                    </div>

                    <button
                        type="button"
                        className="primary-btn"
                        disabled={downloading}
                        onClick={
                            handleDownload
                        }
                    >
                        {downloading
                            ? "Downloading..."
                            : "Download"}
                    </button>
                </div>
            ) : (
                <div className="resume-empty">
                    <p>
                        You have not uploaded
                        a resume yet.
                    </p>
                </div>
            )}
        </section>
    );
}