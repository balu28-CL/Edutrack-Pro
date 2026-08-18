import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Faculty from "./pages/Faculty";
import Attendance from "./pages/Attendance";
import Marks from "./pages/Marks";
import Notices from "./pages/Notices";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Courses from "./pages/Courses";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* PUBLIC */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* PROTECTED */}

                <Route
    path="/profile"
    element={
        <ProtectedRoute>
            <Profile />
        </ProtectedRoute>
    }
/>

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="/dashboard" element={<ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>} />


                <Route
                    path="/students"
                    element={
                        <ProtectedRoute>
                            <Students />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/faculty"
                    element={
                        <ProtectedRoute>
                            <Faculty />
                        </ProtectedRoute>
                    }
                />

                <Route
    path="/courses"
    element={
        <ProtectedRoute>
            <Courses />
        </ProtectedRoute>
    }
/>


                <Route
                    path="/attendance"
                    element={
                        <ProtectedRoute>
                            <Attendance />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/marks"
                    element={
                        <ProtectedRoute>
                            <Marks />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/notices"
                    element={
                        <ProtectedRoute>
                            <Notices />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    );
}

export default App;