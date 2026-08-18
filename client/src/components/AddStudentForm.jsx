import { useState } from "react";
import { addStudent } from "../services/studentService";
import "../styles/AddStudentForm.css";

function AddStudentForm({ onStudentAdded, onClose }) {

    const [form, setForm] = useState({
        studentId: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        semester: "",
        section: "",
        gender: ""
    });

    const [successData, setSuccessData] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await addStudent({

                ...form,

                semester: Number(form.semester)

            });


            // Add the newly created student to the table
            onStudentAdded(response.student);


            // Show custom success modal
            setSuccessData({
                email: response.loginCredentials.email,
                password: response.loginCredentials.password
            });

        } catch (error) {

            console.log("ADD STUDENT ERROR:", error);

            setErrorMessage(
                error.response?.data?.message ||
                "Failed to add student"
            );

        }

    };


    const handleSuccessClose = () => {

        setSuccessData(null);

        onClose();

    };


    const handleErrorClose = () => {

        setErrorMessage("");

    };


    return (

        <>

            {/* ========================= */}
            {/* ADD STUDENT FORM */}
            {/* ========================= */}

            <div className="student-form-overlay">

                <div className="student-form-card">


                    {/* HEADER */}

                    <div className="student-form-header">

                        <div>

                            <h2>
                                🎓 Add Student
                            </h2>

                            <p>
                                Register a new student
                            </p>

                        </div>


                        <button
                            type="button"
                            className="close-form-btn"
                            onClick={onClose}
                        >
                            ✕
                        </button>

                    </div>


                    {/* FORM */}

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">


                            {/* STUDENT ID */}

                            <input
                                name="studentId"
                                placeholder="Student ID"
                                value={form.studentId}
                                onChange={handleChange}
                                required
                            />


                            {/* NAME */}

                            <input
                                name="name"
                                placeholder="Full Name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />


                            {/* EMAIL */}

                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />


                            {/* PHONE */}

                            <input
                                name="phone"
                                placeholder="Phone"
                                value={form.phone}
                                onChange={handleChange}
                                required
                            />


                            {/* DEPARTMENT */}

                            <input
                                name="department"
                                placeholder="Department"
                                value={form.department}
                                onChange={handleChange}
                                required
                            />


                            {/* SEMESTER */}

                            <input
                                name="semester"
                                type="number"
                                min="1"
                                placeholder="Semester"
                                value={form.semester}
                                onChange={handleChange}
                                required
                            />


                            {/* SECTION */}

                            <input
                                name="section"
                                placeholder="Section"
                                value={form.section}
                                onChange={handleChange}
                                required
                            />


                            {/* GENDER */}

                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Gender
                                </option>

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>


                        {/* ACTIONS */}

                        <div className="form-actions">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={onClose}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="save-student-btn"
                            >
                                Add Student
                            </button>

                        </div>

                    </form>

                </div>

            </div>


            {/* ========================= */}
            {/* SUCCESS MODAL */}
            {/* ========================= */}

            {successData && (

                <div className="credentials-overlay">

                    <div className="credentials-modal">

                        {/* SUCCESS ICON */}

                        <div className="success-icon">
                            ✓
                        </div>


                        {/* TITLE */}

                        <h2>
                            Student Added Successfully!
                        </h2>

                        <p className="success-subtitle">
                            The student account has been created.
                        </p>


                        {/* CREDENTIALS */}

                        <div className="credentials-box">

                            <div className="credential-item">

                                <span>
                                    Login Email
                                </span>

                                <strong>
                                    {successData.email}
                                </strong>

                            </div>


                            <div className="credential-item">

                                <span>
                                    Initial Password
                                </span>

                                <strong>
                                    {successData.password}
                                </strong>

                            </div>

                        </div>


                        {/* WARNING */}

                        <div className="credential-warning">

                            <span>⚠️</span>

                            <p>
                                Please provide these credentials
                                to the student securely.
                            </p>

                        </div>


                        {/* BUTTON */}

                        <button
                            className="credentials-close-btn"
                            onClick={handleSuccessClose}
                        >
                            Continue
                        </button>

                    </div>

                </div>

            )}


            {/* ========================= */}
            {/* ERROR MODAL */}
            {/* ========================= */}

            {errorMessage && (

                <div className="credentials-overlay">

                    <div className="error-modal">

                        <div className="error-icon">
                            !
                        </div>

                        <h2>
                            Unable to Add Student
                        </h2>

                        <p>
                            {errorMessage}
                        </p>

                        <button
                            className="error-close-btn"
                            onClick={handleErrorClose}
                        >
                            Try Again
                        </button>

                    </div>

                </div>

            )}

        </>

    );

}

export default AddStudentForm;