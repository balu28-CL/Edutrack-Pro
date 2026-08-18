import {
    LayoutDashboard,
    GraduationCap,
    Users,
    CalendarCheck,
    FileText,
    BookOpen,
    Bell,
    UserRound,
    LogOut
} from "lucide-react";
import "../styles/Sidebar.css";
import { getUserRole } from "../utils/auth";
import { useLocation } from "react-router-dom";

function Sidebar() {

    const location = useLocation();
const role = getUserRole();
    return (

        <aside className="sidebar">

            <div className="logo">

    <h2>🎓 EduTrack Pro</h2>

    <p>College ERP System</p>

</div>
            <nav>

                <a
    href="/dashboard"
    className={location.pathname === "/dashboard" ? "active" : ""}
>
                    <LayoutDashboard size={20}/>
                    Dashboard
                </a>

                {(role === "admin" || role === "faculty") && (
    <a href="/students">
        <GraduationCap size={20}/>
        Students
    </a>
)}
                {(role === "admin" || role === "faculty") && (
    <a
    href="/faculty"
    className={location.pathname === "/faculty" ? "active" : ""}
>
        <Users size={20}/>
        Faculty
    </a>
)}

                <a
    href="/attendance"
    className={location.pathname === "/attendance" ? "active" : ""}
>
                    <CalendarCheck size={20}/>
                    Attendance
                </a>

                <a
    href="/marks"
    className={location.pathname === "/marks" ? "active" : ""}
>
                    <FileText size={20}/>
                    Marks
                </a>

                <a
    href="/courses"
    className={location.pathname === "/courses" ? "active" : ""}
>
    <BookOpen size={20} />
    Courses
</a>

                <a
    href="/notices"
    className={location.pathname === "/notices" ? "active" : ""}
>
                    <Bell size={20}/>
                    Notices
                </a>

                <a
    href="/profile"
    className={location.pathname === "/profile" ? "active" : ""}
>
    <UserRound size={20}/>
    Profile
</a>

            </nav>

            <div className="logout">

                <a
    href="/login"
    onClick={(e) => {
        e.preventDefault();

         sessionStorage.removeItem("token");
         sessionStorage.removeItem("user");

        window.location.href = "/login";
    }}
>
    <LogOut size={20}/>
    Logout
</a>

            </div>

        </aside>

    );

}

export default Sidebar;