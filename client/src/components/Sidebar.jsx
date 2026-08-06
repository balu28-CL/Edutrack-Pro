import {
    LayoutDashboard,
    GraduationCap,
    Users,
    CalendarCheck,
    FileText,
    Bell,
    LogOut
} from "lucide-react";

function Sidebar() {

    return (

        <aside className="sidebar">

            <div className="logo">

                <h2>EduTrack Pro</h2>

            </div>

            <nav>

                <a href="#">
                    <LayoutDashboard size={20}/>
                    Dashboard
                </a>

                <a href="#">
                    <GraduationCap size={20}/>
                    Students
                </a>

                <a href="#">
                    <Users size={20}/>
                    Faculty
                </a>

                <a href="#">
                    <CalendarCheck size={20}/>
                    Attendance
                </a>

                <a href="#">
                    <FileText size={20}/>
                    Marks
                </a>

                <a href="#">
                    <Bell size={20}/>
                    Notices
                </a>

            </nav>

            <div className="logout">

                <a href="#">
                    <LogOut size={20}/>
                    Logout
                </a>

            </div>

        </aside>

    );

}

export default Sidebar;