import {
    useCallback,
    useEffect,
    useState
} from "react";

import candidateProfileService
    from "../../services/candidateProfileService";

import AboutSection
    from "./components/AboutSection";

import EducationSection
    from "./components/EducationSection";

import EditProfileModal
    from "./components/EditProfileModal";

import ExperienceSection
    from "./components/ExperienceSection";

import ProfileCompletion
    from "./components/ProfileCompletion";

import ProfileHeader
    from "./components/ProfileHeader";

import ResumeSection
    from "./components/ResumeSection";

import SkillsSection
    from "./components/SkillsSection";

import "./CandidateProfile.css";

export default function CandidateProfilePage() {
    const [profile, setProfile] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [editOpen, setEditOpen] =
        useState(false);

    const [error, setError] =
        useState("");

    const loadProfile = useCallback(
        async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await candidateProfileService
                        .getProfile();

                setProfile(data);
            }
            catch (requestError) {
                console.error(
                    "Failed to load candidate profile:",
                    requestError
                );

                const responseData =
                    requestError?.response?.data;

                setError(
                    responseData?.message ||
                    responseData?.title ||
                    requestError?.message ||
                    "Failed to load candidate profile."
                );
            }
            finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    if (loading) {
        return (
            <main className="candidate-profile-page">
                <div className="profile-loading">
                    Loading profile...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="candidate-profile-page">
                <section className="profile-card">
                    <h2>
                        Unable to load profile
                    </h2>

                    <p>{error}</p>

                    <button
                        type="button"
                        className="primary-btn"
                        onClick={loadProfile}
                    >
                        Try Again
                    </button>
                </section>
            </main>
        );
    }

    if (!profile) {
        return (
            <main className="candidate-profile-page">
                <section className="profile-card">
                    <h2>
                        Profile not found
                    </h2>

                    <p>
                        Candidate profile information
                        is not available.
                    </p>

                    <button
                        type="button"
                        className="primary-btn"
                        onClick={loadProfile}
                    >
                        Try Again
                    </button>
                </section>
            </main>
        );
    }

    return (
        <main className="candidate-profile-page">
            <ProfileHeader
                profile={profile}
                reload={loadProfile}
                onEdit={() =>
                    setEditOpen(true)
                }
            />

            <ProfileCompletion
                profile={profile}
            />

            <AboutSection
                profile={profile}
            />

            <SkillsSection
                profile={profile}
            />

            <ExperienceSection
                profile={profile}
                reload={loadProfile}
            />

            <EducationSection
                profile={profile}
                reload={loadProfile}
            />

            <ResumeSection
                profile={profile}
                reload={loadProfile}
            />

            <EditProfileModal
                open={editOpen}
                profile={profile}
                reload={loadProfile}
                onClose={() =>
                    setEditOpen(false)
                }
            />
        </main>
    );
}