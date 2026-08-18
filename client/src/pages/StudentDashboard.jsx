import MainLayout from "../layouts/MainLayout";
import StatCard from "../components/StatCard";
import RecentNotice from "../components/RecentNotice";
import "../styles/Dashboard.css";

function StudentDashboard({ stats }) {

    if (!stats) {
        return <h2>Loading...</h2>;
    }

    const student = stats.student;
    const attendance = stats.attendance;
    const marks = stats.marks || [];

    return (
        <MainLayout>

            <div className="dashboard">

                {/* WELCOME */}

                <div className="student-welcome-card">

                    <h2>
                        🎓 Welcome, {student?.name || "Student"}!
                    </h2>

                    <p>
                        {student?.department} •
                        Semester {student?.semester} •
                        Section {student?.section}
                    </p>

                </div>


                {/* STUDENT STATISTICS */}

                <div className="stats-container">

                    <StatCard
                        title="Attendance"
                        value={`${attendance?.percentage || 0}%`}
                        color="#0891b2"
                    />

                    <StatCard
                        title="Classes Attended"
                        value={attendance?.present || 0}
                        color="#16a34a"
                    />

                    <StatCard
                        title="Total Classes"
                        value={attendance?.total || 0}
                        color="#f97316"
                    />

                    <StatCard
                        title="Marks Records"
                        value={marks.length}
                        color="#9333ea"
                    />

                </div>


                {/* LOWER DASHBOARD */}

                <div className="dashboard-lower">

                    {/* RECENT NOTICES */}

                    <RecentNotice
                        notices={stats.recentNotices || []}
                    />


                    {/* MY MARKS */}

                    <div className="quick-actions">

                        <div className="quick-actions-header">

                            <h2>
                                📝 My Recent Marks
                            </h2>

                            <p>
                                Your latest examination records
                            </p>

                        </div>

                        <div className="student-marks-list">

                            {marks.length === 0 ? (

                                <p>
                                    No marks available yet.
                                </p>

                            ) : (

                                marks.map((mark) => (

                                    <div
                                        key={mark._id}
                                        className="student-mark-item"
                                    >

                                        <div>

                                            <strong>
                                                {mark.subject}
                                            </strong>

                                            <small>
                                                {mark.examType}
                                            </small>

                                        </div>

                                        <strong>
                                            {mark.marksObtained} /{" "}
                                            {mark.maximumMarks}
                                        </strong>

                                    </div>

                                ))

                            )}

                        </div>

                    </div>


                    {/* MY ACADEMICS */}

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

                </div>

            </div>

        </MainLayout>
    );
}

export default StudentDashboard;