import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import StatCard from "../components/StatCard";
import "../styles/Dashboard.css";
import RecentNotice from "../components/RecentNotice";
import MainLayout from "../layouts/MainLayout";
import { getCurrentUser, getUserRole } from "../utils/auth";
import StudentDashboard from "./StudentDashboard";

function Dashboard() {

    const user = getCurrentUser();
    const role = getUserRole();

    console.log("CURRENT USER:", user);
    console.log("CURRENT ROLE:", role);

    const [stats, setStats] = useState(null);

    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const data = await getDashboardStats();

                setStats(data);

            } catch (error) {

                console.log(error);

            }

        };

        fetchDashboard();

    }, []);


    if (!stats) {
        return <h2>Loading...</h2>;
    }


    const isAdmin = role === "admin";
    const isFaculty = role === "faculty";
    const isStudent = role === "student";
    if (isStudent) {
    return <StudentDashboard stats={stats} />;
}


    return (

        <MainLayout>

            <div className="dashboard">


                {/* ============================= */}
                {/* ADMIN / FACULTY STATISTICS */}
                {/* ============================= */}

                {!isStudent && (

                    <div className="stats-container">

                        <StatCard
                            title="Students"
                            value={stats.totalStudents}
                            color="#2563eb"
                        />

                        <StatCard
                            title="Faculty"
                            value={stats.totalFaculty}
                            color="#16a34a"
                        />

                        <StatCard
                            title="Attendance"
                            value={stats.totalAttendanceRecords}
                            color="#f97316"
                        />

                        <StatCard
                            title="Marks"
                            value={stats.totalMarksRecords}
                            color="#9333ea"
                        />

                        <StatCard
                            title="Active Notices"
                            value={stats.activeNotices}
                            color="#ef4444"
                        />

                        <StatCard
                            title="Attendance %"
                            value={stats.attendancePercentage}
                            color="#0891b2"
                        />

                    </div>

                )}


                {/* ============================= */}
                {/* STUDENT WELCOME */}
                {/* ============================= */}
{isStudent && (

    <>
        {/* STUDENT WELCOME */}

        <div className="student-welcome-card">

            <div>
                <h2>
                    🎓 Welcome, {stats.student?.name || user?.name || "Student"}!
                </h2>

                <p>
                    Here's your academic overview.
                </p>
            </div>

            <div className="student-info">

                <span>
                    {stats.student?.studentId || "Student"}
                </span>

                <span>
                    {stats.student?.department || "Department"}
                </span>

                <span>
                    Semester {stats.student?.semester || "-"}
                </span>

                <span>
                    Section {stats.student?.section || "-"}
                </span>

            </div>

        </div>


        {/* STUDENT STATISTICS */}

        <div className="student-stats-container">

            <div className="student-stat-card attendance-card">

                <div className="student-stat-icon">
                    📅
                </div>

                <div>

                    <p>Attendance</p>

                    <h2>
                        {stats.attendance?.percentage || "0"}%
                    </h2>

                    <small>
                        {stats.attendance?.present || 0} present out of{" "}
                        {stats.attendance?.total || 0}
                    </small>

                </div>

            </div>


            <div className="student-stat-card marks-card">

                <div className="student-stat-icon">
                    📝
                </div>

                <div>

                    <p>Latest Marks</p>

                    <h2>
                        {stats.marks?.length > 0
                            ? `${stats.marks[0].marksObtained}/${stats.marks[0].maximumMarks}`
                            : "N/A"}
                    </h2>

                    <small>
                        {stats.marks?.length > 0
                            ? stats.marks[0].subject
                            : "No marks available"}
                    </small>

                </div>

            </div>


            <div className="student-stat-card notice-card-small">

                <div className="student-stat-icon">
                    📢
                </div>

                <div>

                    <p>Notices</p>

                    <h2>
                        {stats.recentNotices?.length || 0}
                    </h2>

                    <small>
                        Recent notices
                    </small>

                </div>

            </div>

        </div>


        {/* STUDENT ACADEMIC SUMMARY */}

        <div className="student-academic-summary">

            <div className="summary-header">

                <div>
                    <h2>📚 Academic Summary</h2>
                    <p>Your latest examination performance</p>
                </div>

            </div>


            {stats.marks?.length > 0 ? (

                <div className="marks-list">

                    {stats.marks.slice(0, 3).map((mark) => (

                        <div
                            className="student-mark-row"
                            key={mark._id}
                        >

                            <div>

                                <strong>
                                    {mark.subject}
                                </strong>

                                <small>
                                    {mark.examType}
                                </small>

                            </div>


                            <div className="mark-value">

                                <strong>
                                    {mark.marksObtained}
                                </strong>

                                <span>
                                    / {mark.maximumMarks}
                                </span>

                            </div>

                        </div>

                    ))}

                </div>

            ) : (

                <p className="empty-message">
                    No examination marks available yet.
                </p>

            )}

        </div>

    </>

)}


                {/* ============================= */}
                {/* LOWER DASHBOARD */}
                {/* ============================= */}

                <div className="dashboard-lower">


                    {/* RECENT NOTICES */}

                    <RecentNotice
                        notices={stats.recentNotices || []}
                    />


                    {/* ============================= */}
                    {/* ADMIN QUICK ACTIONS */}
                    {/* ============================= */}

                    {isAdmin && (

                        <div className="quick-actions">

                            <div className="quick-actions-header">

                                <h2>
                                    ⚡ Quick Actions
                                </h2>

                                <p>
                                    Common administrative tasks
                                </p>

                            </div>


                            <div className="action-grid">


                                <button
                                    className="action-btn blue"
                                    onClick={() => {
                                        window.location.href =
                                            "/students";
                                    }}
                                >

                                    <span>🎓</span>

                                    <div>

                                        <strong>
                                            Add Student
                                        </strong>

                                        <small>
                                            Register a new student
                                        </small>

                                    </div>

                                </button>


                                <button
                                    className="action-btn green"
                                    onClick={() => {
                                        window.location.href =
                                            "/faculty";
                                    }}
                                >

                                    <span>👨‍🏫</span>

                                    <div>

                                        <strong>
                                            Add Faculty
                                        </strong>

                                        <small>
                                            Add faculty member
                                        </small>

                                    </div>

                                </button>

                                <button
    className="action-btn blue"
    onClick={() => {
        window.location.href = "/courses";
    }}
>
    <span>📚</span>

    <div>
        <strong>
            Courses
        </strong>

        <small>
            Manage courses
        </small>
    </div>
</button>


                                <button
                                    className="action-btn orange"
                                    onClick={() => {
                                        window.location.href =
                                            "/attendance";
                                    }}
                                >

                                    <span>📅</span>

                                    <div>

                                        <strong>
                                            Attendance
                                        </strong>

                                        <small>
                                            Manage attendance
                                        </small>

                                    </div>

                                </button>


                                <button
                                    className="action-btn purple"
                                    onClick={() => {
                                        window.location.href =
                                            "/marks";
                                    }}
                                >

                                    <span>📝</span>

                                    <div>

                                        <strong>
                                            Add Marks
                                        </strong>

                                        <small>
                                            Update student marks
                                        </small>

                                    </div>

                                </button>

                                <button
    className="action-btn blue"
    onClick={() => {
        window.location.href = "/notices";
    }}
>
    <span>📢</span>

    <div>
        <strong>
            Notices
        </strong>

        <small>
            Manage college notices
        </small>
    </div>
</button>


                            </div>

                        </div>

                    )}


                    {/* ============================= */}
                    {/* FACULTY QUICK ACTIONS */}
                    {/* ============================= */}

                    {isFaculty && (

                        <div className="quick-actions">

                            <div className="quick-actions-header">

                                <h2>
                                    ⚡ Quick Actions
                                </h2>

                                <p>
                                    Manage academic records
                                </p>

                            </div>


                            <div className="action-grid">

                                <button
    className="action-btn blue"
    onClick={() => {
        window.location.href = "/courses";
    }}
>
    <span>📚</span>

    <div>
        <strong>
            Courses
        </strong>

        <small>
            Manage your courses
        </small>
    </div>
</button>


                                <button
                                    className="action-btn orange"
                                    onClick={() => {
                                        window.location.href =
                                            "/attendance";
                                    }}
                                >

                                    <span>📅</span>

                                    <div>

                                        <strong>
                                            Attendance
                                        </strong>

                                        <small>
                                            Manage attendance
                                        </small>

                                    </div>

                                </button>


                                <button
                                    className="action-btn purple"
                                    onClick={() => {
                                        window.location.href =
                                            "/marks";
                                    }}
                                >

                                    <span>📝</span>

                                    <div>

                                        <strong>
                                            Marks
                                        </strong>

                                        <small>
                                            Manage student marks
                                        </small>

                                    </div>

                                </button>


                                <button
                                    className="action-btn blue"
                                    onClick={() => {
                                        window.location.href =
                                            "/notices";
                                    }}
                                >

                                    <span>📢</span>

                                    <div>

                                        <strong>
                                            Notices
                                        </strong>

                                        <small>
                                            Manage notices
                                        </small>

                                    </div>

                                </button>


                            </div>

                        </div>

                    )}


                    {/* ============================= */}
                    {/* STUDENT QUICK LINKS */}
                    {/* ============================= */}

                    {isStudent && (

                        <div className="quick-actions">

                            <div className="quick-actions-header">

                                <h2>
                                    📚 My Academics
                                </h2>

                                <p>
                                    View your academic records
                                </p>

                            </div>


                            <div className="action-grid">

                                <button
    className="action-btn blue"
    onClick={() => {
        window.location.href = "/courses";
    }}
>
    <span>📚</span>

    <div>
        <strong>
            Courses
        </strong>

        <small>
            View available courses
        </small>
    </div>
</button>


                                <button
                                    className="action-btn orange"
                                    onClick={() => {
                                        window.location.href =
                                            "/attendance";
                                    }}
                                >

                                    <span>📅</span>

                                    <div>

                                        <strong>
                                            Attendance
                                        </strong>

                                        <small>
                                            View attendance records
                                        </small>

                                    </div>

                                </button>


                                <button
                                    className="action-btn purple"
                                    onClick={() => {
                                        window.location.href =
                                            "/marks";
                                    }}
                                >

                                    <span>📝</span>

                                    <div>

                                        <strong>
                                            Marks
                                        </strong>

                                        <small>
                                            View examination marks
                                        </small>

                                    </div>

                                </button>


                                <button
                                    className="action-btn blue"
                                    onClick={() => {
                                        window.location.href =
                                            "/notices";
                                    }}
                                >

                                    <span>📢</span>

                                    <div>

                                        <strong>
                                            Notices
                                        </strong>

                                        <small>
                                            View college notices
                                        </small>

                                    </div>

                                </button>


                            </div>

                        </div>

                    )}

                </div>

            </div>

        </MainLayout>

    );

}

export default Dashboard;