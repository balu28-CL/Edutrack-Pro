import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";

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

        <div>

            <h1>EduTrack Pro Dashboard</h1>

            <h2>Total Students : {stats.totalStudents}</h2>

            <h2>Total Faculty : {stats.totalFaculty}</h2>

            <h2>Total Attendance : {stats.totalAttendanceRecords}</h2>

            <h2>Total Marks : {stats.totalMarksRecords}</h2>

            <h2>Active Notices : {stats.activeNotices}</h2>

            <h2>Attendance % : {stats.attendancePercentage}</h2>

        </div>

    );

}

export default Dashboard;