import ProfilePhotoUpload from "./ProfilePhotoUpload";
import CoverPhotoUpload from "./CoverPhotoUpload";

export default function ProfileHeader({
    profile,
    reload,
    onEdit
}) {
    return (
        <section className="profile-header">

            <div className="profile-cover">

                <img
                    src={
                        profile.coverImageUrl ||
                        "/default-cover.jpg"
                    }
                    alt="Cover"
                />

                <CoverPhotoUpload
                    reload={reload}
                />

            </div>

            <div className="profile-header-content">

                <div className="profile-avatar-container">

                    <img
                        className="profile-avatar"
                        src={
                            profile.profileImageUrl ||
                            "/default-avatar.png"
                        }
                        alt={profile.fullName}
                    />

                    <ProfilePhotoUpload
                        reload={reload}
                    />

                </div>

                <div className="profile-basic-info">

                    <h1>
                        {profile.fullName}
                    </h1>

                    <h2>
                        {profile.headline || "Add a professional headline"}
                    </h2>

                    <p>
                        {profile.location || "Location not specified"}
                    </p>

                    <div className="profile-links">

                        {profile.linkedInUrl && (
                            <a
                                href={profile.linkedInUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                LinkedIn
                            </a>
                        )}

                        {profile.gitHubUrl && (
                            <a
                                href={profile.gitHubUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                GitHub
                            </a>
                        )}

                        {profile.portfolioUrl && (
                            <a
                                href={profile.portfolioUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Portfolio
                            </a>
                        )}

                    </div>

                </div>

                <div className="profile-actions">

                    <button
                        type="button"
                        className="edit-profile-btn"
                        onClick={onEdit}
                    >
                        Edit Profile
                    </button>

                </div>

            </div>

        </section>
    );
}