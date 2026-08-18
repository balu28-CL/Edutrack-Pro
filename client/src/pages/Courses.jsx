import { useEffect, useState } from "react";
import API from "../services/api";
import { getUserRole } from "../utils/auth";
import "../styles/Courses.css";
import MainLayout from "../layouts/MainLayout";

function Courses() {

    const role = getUserRole();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
const [editingId, setEditingId] = useState(null);

const [popup, setPopup] = useState({
    show: false,
    type: "success",
    title: "",
    message: ""
});

const [deleteId, setDeleteId] = useState(null);
    const [formData, setFormData] = useState({
        courseCode: "",
        courseName: "",
        department: "",
        semester: "",
        section: "",
        faculty: "",
        credits: ""
    });

    const [facultyList, setFacultyList] = useState([]);

// =========================
// POPUP FUNCTIONS
// =========================

const showPopup = (type, title, message) => {

    setPopup({
        show: true,
        type,
        title,
        message
    });

};

const closePopup = () => {

    setPopup({
        show: false,
        type: "success",
        title: "",
        message: ""
    });

};

    // =========================
    // FETCH FACULTY
    // =========================

    const fetchFaculty = async () => {

        try {

            const response = await API.get("/faculty");

            setFacultyList(response.data);

        } catch (error) {

            console.log("GET FACULTY ERROR:", error);

            alert("Faculty API error");

        }

    };


    // =========================
    // FETCH COURSES
    // =========================

    const fetchCourses = async () => {

        try {

            const response = await API.get("/courses");

            setCourses(response.data);

        } catch (error) {

            console.log("GET COURSES ERROR:", error);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchCourses();

        if (role === "admin" || role === "faculty") {
            fetchFaculty();
        }

    }, [role]);


    // =========================
    // FORM CHANGE
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {

        setFormData({
            courseCode: "",
            courseName: "",
            department: "",
            semester: "",
            section: "",
            faculty: "",
            credits: ""
        });

        setEditingId(null);

    };


    // =========================
    // SUBMIT FORM
    // =========================

    const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        const courseData = {
            ...formData,
            semester: Number(formData.semester),
            credits: Number(formData.credits)
        };

        if (editingId) {

            await API.put(
                `/courses/${editingId}`,
                courseData
            );

            await fetchCourses();

            resetForm();
            setShowForm(false);

            showPopup(
                "success",
                "Course Updated",
                "The course has been updated successfully."
            );

        } else {

            await API.post(
                "/courses",
                courseData
            );

            await fetchCourses();

            resetForm();
            setShowForm(false);

            showPopup(
                "success",
                "Course Added",
                "The course has been added successfully."
            );

        }

    } catch (error) {

        console.log("COURSE SAVE ERROR:", error);

        showPopup(
            "error",
            "Operation Failed",
            error.response?.data?.message ||
            "Failed to save course."
        );

    }

};


    // =========================
    // EDIT COURSE
    // =========================

    const handleEdit = (course) => {

        setEditingId(course._id);

        setFormData({
            courseCode: course.courseCode || "",
            courseName: course.courseName || "",
            department: course.department || "",
            semester: course.semester || "",
            section: course.section || "",
            faculty: course.faculty?._id || "",
            credits: course.credits || ""
        });

        setShowForm(true);

    };


    // =========================
    // CANCEL
    // =========================

    const handleCancel = () => {

        resetForm();

        setShowForm(false);

    };


    // =========================
    // DELETE COURSE
    // =========================

const handleDelete = (id) => {

    setDeleteId(id);

    showPopup(
        "delete",
        "Delete Course?",
        "Are you sure you want to delete this course? This action cannot be undone."
    );

};

// =========================
// CONFIRM DELETE
// =========================

const confirmDelete = async () => {

    try {

        await API.delete(
            `/courses/${deleteId}`
        );

        await fetchCourses();

        setDeleteId(null);

        showPopup(
            "success",
            "Course Deleted",
            "The course has been deleted successfully."
        );

    } catch (error) {

        console.log("DELETE COURSE ERROR:", error);

        setDeleteId(null);

        showPopup(
            "error",
            "Delete Failed",
            error.response?.data?.message ||
            "Failed to delete course."
        );

    }

};

// =========================
// CANCEL DELETE
// =========================

const cancelDelete = () => {

    setDeleteId(null);

    closePopup();

};


    if (loading) {

        return (
            <MainLayout>
                <p className="courses-loading">
                    Loading courses...
                </p>
            </MainLayout>
        );

    }


    return (

        <MainLayout>

            <div className="courses-page">

                {/* ========================= */}
                {/* HEADER */}
                {/* ========================= */}

                <div className="courses-header">

                    <div>

                        <h1>Courses</h1>

                        <p>
                            Manage college courses and faculty assignments
                        </p>

                    </div>


                    {(role === "admin" || role === "faculty") && (

                        <button
                            className="course-add-btn"
                            onClick={() => {

                                if (showForm) {
                                    handleCancel();
                                } else {
                                    resetForm();
                                    setShowForm(true);
                                }

                            }}
                        >

                            {showForm
                                ? "✕ Close"
                                : "+ Add Course"}

                        </button>

                    )}

                </div>


                {/* ========================= */}
                {/* COURSE FORM */}
                {/* ========================= */}

                {showForm && (

                    <form
                        className="course-form"
                        onSubmit={handleSubmit}
                    >

                        <h2>
                            {editingId
                                ? "Edit Course"
                                : "Add New Course"}
                        </h2>


                        <div className="course-form-grid">

                            <input
                                type="text"
                                name="courseCode"
                                placeholder="Course Code"
                                value={formData.courseCode}
                                onChange={handleChange}
                                required
                            />


                            <input
                                type="text"
                                name="courseName"
                                placeholder="Course Name"
                                value={formData.courseName}
                                onChange={handleChange}
                                required
                            />


                            <input
                                type="text"
                                name="department"
                                placeholder="Department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            />


                            <input
                                type="number"
                                name="semester"
                                placeholder="Semester"
                                value={formData.semester}
                                onChange={handleChange}
                                required
                            />


                            <input
                                type="text"
                                name="section"
                                placeholder="Section"
                                value={formData.section}
                                onChange={handleChange}
                                required
                            />


                            <select
                                name="faculty"
                                value={formData.faculty}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Faculty
                                </option>

                                {facultyList.map((faculty) => (

                                    <option
                                        key={faculty._id}
                                        value={faculty._id}
                                    >
                                        {faculty.name}
                                    </option>

                                ))}

                            </select>


                            <input
                                type="number"
                                name="credits"
                                placeholder="Credits"
                                value={formData.credits}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* ONLY ONE SET OF BUTTONS */}

                        <div className="course-form-actions">

                            <button
                                type="submit"
                                className="course-save-btn"
                            >
                                {editingId
                                    ? "Update Course"
                                    : "Save Course"}
                            </button>


                            <button
                                type="button"
                                className="course-cancel-btn"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                )}


                {/* ========================= */}
                {/* COURSE TABLE */}
                {/* ========================= */}

                {courses.length === 0 ? (

                    <p className="no-courses">
                        No courses found.
                    </p>

                ) : (

                    <div className="courses-table-container">

                        <table className="courses-table">

                            <thead>

                                <tr>

                                    <th>Course Code</th>
                                    <th>Course Name</th>
                                    <th>Department</th>
                                    <th>Semester</th>
                                    <th>Section</th>
                                    <th>Faculty</th>
                                    <th>Credits</th>
                                    {(role === "admin" || role === "faculty") && (
    <th>Actions</th>
)}

                                </tr>

                            </thead>


                            <tbody>

                                {courses.map((course) => (

                                    <tr key={course._id}>

                                        <td>
                                            {course.courseCode}
                                        </td>

                                        <td>
                                            {course.courseName}
                                        </td>

                                        <td>
                                            {course.department}
                                        </td>

                                        <td>
                                            {course.semester}
                                        </td>

                                        <td>
                                            {course.section}
                                        </td>

                                        <td>
                                            {course.faculty?.name || "N/A"}
                                        </td>

                                        <td>
                                            {course.credits}
                                        </td>


                                      {(role === "admin" || role === "faculty") && (
    <td>
        <div className="course-actions">

            <button
                className="course-edit-btn"
                onClick={() => handleEdit(course)}
            >
                Edit
            </button>

            <button
                className="course-delete-btn"
                onClick={() => handleDelete(course._id)}
            >
                Delete
            </button>

        </div>
    </td>
)}

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* ========================= */}
            {/* POPUP */}
            {/* ========================= */}

            {popup.show && (

                <div className="courses-popup-overlay">

                    <div className={`courses-popup ${popup.type}`}>

                        <div className="courses-popup-icon">

                            {popup.type === "success" && "✓"}

                            {popup.type === "error" && "!"}

                            {popup.type === "delete" && "🗑"}

                        </div>


                        <h2>
                            {popup.title}
                        </h2>


                        <p>
                            {popup.message}
                        </p>


                        {popup.type === "delete" ? (

                            <div className="courses-popup-actions">

                                <button
                                    className="courses-popup-cancel"
                                    onClick={cancelDelete}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="courses-popup-confirm"
                                    onClick={confirmDelete}
                                >
                                    Delete
                                </button>

                            </div>

                        ) : (

                            <button
                                className="courses-popup-ok"
                                onClick={closePopup}
                            >
                                OK
                            </button>

                        )}

                    </div>

                </div>

            )}

        </MainLayout>

    );

}

export default Courses;