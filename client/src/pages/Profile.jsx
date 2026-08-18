import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../services/api";
import "../styles/Profile.css";

function Profile() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const response = await API.get("/auth/profile");

                setData(response.data);

            } catch (error) {

                console.log("PROFILE ERROR:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load profile"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchProfile();

    }, []);

    if (loading) {
        return (
            <MainLayout>
                <div className="profile-message">
                    Loading profile...
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className="profile-message error">
                    {error}
                </div>
            </MainLayout>
        );
    }

    const user = data?.user;
    const profile = data?.profile;

    return (
        <MainLayout>

            <div className="profile-page">

                {/* HEADER */}

                <div className="profile-header">

                    <div className="profile-avatar">
                        👤
                    </div>

                    <div>

                        <h1>
                            {profile?.name || user?.name}
                        </h1>

                        <p>
                            {user?.email}
                        </p>

                        <span className="profile-role">
                            {user?.role}
                        </span>

                    </div>

                </div>


                {/* PROFILE INFORMATION */}

                <div className="profile-card">

                    <h2>
                        Personal Information
                    </h2>

                    <div className="profile-grid">

                        <div className="profile-item">
                            <span>Full Name</span>
                            <strong>
                                {profile?.name || user?.name || "-"}
                            </strong>
                        </div>

                        <div className="profile-item">
                            <span>Email</span>
                            <strong>
                                {profile?.email || user?.email || "-"}
                            </strong>
                        </div>

                        <div className="profile-item">
                            <span>Phone</span>
                            <strong>
                                {profile?.phone || "-"}
                            </strong>
                        </div>

                        <div className="profile-item">
                            <span>Gender</span>
                            <strong>
                                {profile?.gender || "-"}
                            </strong>
                        </div>

                        <div className="profile-item">
                            <span>Department</span>
                            <strong>
                                {profile?.department || "-"}
                            </strong>
                        </div>


                        {/* STUDENT DETAILS */}

                        {user?.role === "student" && (
                            <>
                                <div className="profile-item">
                                    <span>Student ID</span>
                                    <strong>
                                        {profile?.studentId || "-"}
                                    </strong>
                                </div>

                                <div className="profile-item">
                                    <span>Semester</span>
                                    <strong>
                                        {profile?.semester || "-"}
                                    </strong>
                                </div>

                                <div className="profile-item">
                                    <span>Section</span>
                                    <strong>
                                        {profile?.section || "-"}
                                    </strong>
                                </div>
                            </>
                        )}


                        {/* FACULTY DETAILS */}

                        {user?.role === "faculty" && (
                            <>
                                <div className="profile-item">
                                    <span>Faculty ID</span>
                                    <strong>
                                        {profile?.facultyId || "-"}
                                    </strong>
                                </div>

                                <div className="profile-item">
                                    <span>Designation</span>
                                    <strong>
                                        {profile?.designation || "-"}
                                    </strong>
                                </div>
                            </>
                        )}

                    </div>

                </div>

            </div>

        </MainLayout>
    );
}

export default Profile;