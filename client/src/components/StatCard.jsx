import {
    GraduationCap,
    Users,
    CalendarCheck,
    FileText,
    Bell
} from "lucide-react";
import "../styles/StatCard.css";

function StatCard({ title, value,color }) {

    let Icon = Users;

    if (title === "Students") {
        Icon = GraduationCap;
    }
    else if (title === "Faculty") {
        Icon = Users;
    }
   else if (title === "Attendance") {
    Icon = CalendarCheck;
}
else if (title === "Attendance %") {
    Icon = CalendarCheck;
}
    else if (title === "Marks") {
        Icon = FileText;
    }
    else if (title === "Active Notices") {
        Icon = Bell;
    }

    return (

    <div className="stat-card">

        <div className="stat-header">

          <div
    className="icon-box"
    style={{ backgroundColor: color }}
>
                <Icon size={24} />
            </div>

            <h3>{title}</h3>

        </div>

       <h1 style={{ color }}>{value}</h1>

    </div>

    );

}

export default StatCard;