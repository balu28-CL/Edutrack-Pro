import { useState } from "react";
import axios from "axios";
import "../styles/Login.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        console.log("LOGIN BUTTON CLICKED");
        console.log("Email:", email);

        try {

            const response = await axios.post(
                "https://edutrack-pro-backend.onrender.com/api/auth/login",
                {
                    email,
                    password
                }
            );

            console.log("LOGIN RESPONSE:", response.data);

            // Store login only for the current browser session
            sessionStorage.setItem(
                "token",
                response.data.token
            );

            sessionStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            console.log(
                "TOKEN SAVED:",
                sessionStorage.getItem("token")
            );

            console.log(
                "USER SAVED:",
                sessionStorage.getItem("user")
            );

            // Go to dashboard
            window.location.href = "/";

        } catch (error) {

            console.log("LOGIN ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Unable to connect to server"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <h1>🎓 EduTrack Pro</h1>

                <p>College ERP System</p>

                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;