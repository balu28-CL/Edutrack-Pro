import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import StatCard from "../components/StatCard";
import "../styles/Dashboard.css";
import RecentNotice from "../components/RecentNotice";
import MainLayout from "../layouts/MainLayout";

function Dashboard() {

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

    return (
        <MainLayout>
        <div className="dashboard">

            <div className="stats-container">

    <StatCard
        title="Students"
        value={stats.totalStudents}
    />

    <StatCard
        title="Faculty"
        value={stats.totalFaculty}
    />

    <StatCard
        title="Attendance"
        value={stats.totalAttendanceRecords}
    />

    <StatCard
        title="Marks"
        value={stats.totalMarksRecords}
    />

    <StatCard
        title="Active Notices"
        value={stats.activeNotices}
    />

    <StatCard
        title="Attendance %"
        value={stats.attendancePercentage}
    />

</div>

<RecentNotice
    notices={stats.recentNotices}
/>
        
</div>
</MainLayout>
    );

}

export default Dashboard;