import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {

    const navigate = useNavigate();

    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) {
        greeting = "Good Morning";
    } else if (hour < 17) {
        greeting = "Good Afternoon";
    }

    // Get currently logged-in user
    const storedUser = sessionStorage.getItem("user");

    let user = null;

    try {
        user = storedUser
            ? JSON.parse(storedUser)
            : null;
    } catch (error) {
        user = null;
    }

    return (

        <header className="navbar">

            <div>

                <div className="welcome-text">

                    <h1>
                        {greeting} <span>👋</span>
                    </h1>

                    <p>
                        Here's what's happening in EduTrack Pro today.
                    </p>

                </div>

            </div>


            {/* PROFILE BUTTON */}

            <button
                className="admin-info"
                onClick={() => navigate("/profile")}
            >
                👤 {user?.name || user?.role || "User"}
            </button>

        </header>

    );
}

export default Navbar;