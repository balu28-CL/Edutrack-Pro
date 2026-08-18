import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
    getStudents,
    deleteStudent,
    updateStudent
} from "../services/studentService";
import "../styles/Students.css";
import AddStudentForm from "../components/AddStudentForm";
import { getUserRole } from "../utils/auth";

function Students() {

    const role = getUserRole();

    /* =========================================
       DELETE MODAL
    ========================================= */

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);

const [editSuccessPopup, setEditSuccessPopup] = useState(false);
    /* =========================================
       NOTIFICATION
    ========================================= */

    const [notification, setNotification] = useState(null);


    /* =========================================
       STUDENTS
    ========================================= */

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);


    /* =========================================
       ADD STUDENT
    ========================================= */

    const [showForm, setShowForm] = useState(false);


    /* =========================================
       EDIT STUDENT
    ========================================= */

    const [editingStudent, setEditingStudent] = useState(null);

    const [editForm, setEditForm] = useState({
        studentId: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        semester: "",
        section: "",
        gender: ""
    });


    /* =========================================
       FETCH STUDENTS
    ========================================= */

    const fetchStudents = async () => {

        try {

            const data = await getStudents();

            setStudents(data);

        } catch (error) {

            console.log("FETCH STUDENTS ERROR:", error);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchStudents();

    }, []);


    /* =========================================
       DELETE - OPEN MODAL
    ========================================= */

    const handleDeleteClick = (student) => {

        setStudentToDelete(student);

        setShowDeleteModal(true);

    };


    /* =========================================
       DELETE STUDENT
    ========================================= */

    const handleDelete = async () => {

        if (!studentToDelete) {
            return;
        }

        try {

            await deleteStudent(studentToDelete._id);

            setStudents((prev) =>
                prev.filter(
                    (student) =>
                        student._id !== studentToDelete._id
                )
            );

            // Close delete modal
            setShowDeleteModal(false);

            setStudentToDelete(null);

            // Success notification
            setNotification({
                type: "success",
                message: "Student deleted successfully."
            });

            // Automatically hide notification
            setTimeout(() => {
                setNotification(null);
            }, 3000);

        } catch (error) {

            console.log("DELETE ERROR:", error);

            setShowDeleteModal(false);

            setStudentToDelete(null);

            // Error notification
            setNotification({
                type: "error",
                message:
                    error.response?.data?.message ||
                    "Failed to delete student."
            });

            setTimeout(() => {
                setNotification(null);
            }, 3000);

        }

    };


    /* =========================================
       EDIT - OPEN MODAL
    ========================================= */

    const handleEdit = (student) => {

        setEditingStudent(student);

        setEditForm({
            studentId: student.studentId || "",
            name: student.name || "",
            email: student.email || "",
            phone: student.phone || "",
            department: student.department || "",
            semester: student.semester || "",
            section: student.section || "",
            gender: student.gender || ""
        });

    };


    /* =========================================
       EDIT FORM CHANGE
    ========================================= */

    const handleEditChange = (e) => {

        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });

    };


    /* =========================================
       UPDATE STUDENT
    ========================================= */

  const handleUpdateStudent = async (e) => {

    e.preventDefault();

    try {

        const updatedStudent = await updateStudent(
            editingStudent._id,
            {
                ...editForm,
                semester: Number(editForm.semester)
            }
        );

        setStudents((prev) =>
            prev.map((student) =>
                student._id === editingStudent._id
                    ? updatedStudent
                    : student
            )
        );

        // Close edit modal
        setEditingStudent(null);

        // Show centered success popup
        setEditSuccessPopup(true);

    } catch (error) {

        console.log("UPDATE ERROR:", error);

        setNotification({
            show: true,
            type: "error",
            message:
                error.response?.data?.message ||
                "Failed to update student."
        });

        setTimeout(() => {
            setNotification(null);
        }, 3000);

    }

};

    /* =========================================
       JSX
    ========================================= */

    return (

        <MainLayout>

            <div className="students-page">


                {/* =================================
                    STUDENTS HEADER
                ================================= */}

                <div className="students-header">

                    <div>

                        <h1>
                            🎓 Students
                        </h1>

                        <p>
                            Manage registered students
                        </p>

                    </div>


                    {/* ADD STUDENT BUTTON */}

                    {role === "admin" && (

                        <button
                            className="add-student-btn"
                            onClick={() => setShowForm(true)}
                        >
                            + Add Student
                        </button>

                    )}

                </div>


                {/* =================================
                    STUDENTS TABLE CARD
                ================================= */}

                <div className="students-card">

                    {loading ? (

                        <p>
                            Loading students...
                        </p>

                    ) : students.length === 0 ? (

                        <p>
                            No students found.
                        </p>

                    ) : (

                        <div className="students-table-wrapper">

                            <table
                                className={`students-table ${
                                    role === "admin"
                                        ? "admin-table"
                                        : "view-table"
                                }`}
                            >

                                <thead>

                                    <tr>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            Name
                                        </th>

                                        <th>
                                            Email
                                        </th>

                                        <th>
                                            Department
                                        </th>

                                        <th>
                                            Semester
                                        </th>

                                        <th>
                                            Section
                                        </th>

                                        {role === "admin" && (

                                            <th>
                                                Action
                                            </th>

                                        )}

                                    </tr>

                                </thead>


                                <tbody>

                                    {students.map((student) => (

                                        <tr
                                            key={student._id}
                                        >

                                            <td>
                                                {student.studentId}
                                            </td>

                                            <td>
                                                {student.name}
                                            </td>

                                            <td>
                                                {student.email}
                                            </td>

                                            <td>
                                                {student.department}
                                            </td>

                                            <td>
                                                {student.semester}
                                            </td>

                                            <td>
                                                {student.section}
                                            </td>


                                            {/* ADMIN ACTIONS */}

                                            {role === "admin" && (

                                                <td>

                                                    {/* EDIT */}

                                                    <button
                                                        className="edit-btn"
                                                        onClick={() =>
                                                            handleEdit(student)
                                                        }
                                                    >
                                                        Edit
                                                    </button>


                                                    {/* DELETE */}

                                                    <button
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            handleDeleteClick(student)
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </td>

                                            )}

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>


            {/* =========================================
                ADD STUDENT FORM
            ========================================= */}

            {showForm && (

                <AddStudentForm

                    onClose={() =>
                        setShowForm(false)
                    }

                    onStudentAdded={(newStudent) => {

                        setStudents((prev) => [
                            ...prev,
                            newStudent
                        ]);

                    }}

                />

            )}


            {/* =========================================
                EDIT STUDENT MODAL
            ========================================= */}

            {editingStudent && (

                <div className="edit-modal-overlay">

                    <div className="edit-modal">


                        {/* EDIT HEADER */}

                        <div className="edit-modal-header">

                            <div>

                                <h2>
                                    ✏️ Edit Student
                                </h2>

                                <p>
                                    Update student information
                                </p>

                            </div>


                            {/* CLOSE */}

                            <button
                                type="button"
                                className="close-edit-btn"
                                onClick={() =>
                                    setEditingStudent(null)
                                }
                            >
                                ✕
                            </button>

                        </div>


                        {/* EDIT FORM */}

                        <form
                            className="edit-student-form"
                            onSubmit={handleUpdateStudent}
                        >

                            <div className="edit-form-grid">


                                {/* STUDENT ID */}

                                <div className="form-group">

                                    <label>
                                        Student ID
                                    </label>

                                    <input
                                        name="studentId"
                                        value={editForm.studentId}
                                        disabled
                                    />

                                </div>


                                {/* NAME */}

                                <div className="form-group">

                                    <label>
                                        Name
                                    </label>

                                    <input
                                        name="name"
                                        value={editForm.name}
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>


                                {/* EMAIL */}

                                <div className="form-group">

                                    <label>
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={editForm.email}
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>


                                {/* PHONE */}

                                <div className="form-group">

                                    <label>
                                        Phone
                                    </label>

                                    <input
                                        name="phone"
                                        value={editForm.phone}
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>


                                {/* DEPARTMENT */}

                                <div className="form-group">

                                    <label>
                                        Department
                                    </label>

                                    <input
                                        name="department"
                                        value={editForm.department}
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>


                                {/* SEMESTER */}

                                <div className="form-group">

                                    <label>
                                        Semester
                                    </label>

                                    <input
                                        type="number"
                                        name="semester"
                                        min="1"
                                        value={editForm.semester}
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>


                                {/* SECTION */}

                                <div className="form-group">

                                    <label>
                                        Section
                                    </label>

                                    <input
                                        name="section"
                                        value={editForm.section}
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>


                                {/* GENDER */}

                                <div className="form-group">

                                    <label>
                                        Gender
                                    </label>

                                    <select
                                        name="gender"
                                        value={editForm.gender}
                                        onChange={handleEditChange}
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

                            </div>


                            {/* EDIT ACTIONS */}

                            <div className="edit-modal-actions">

                                <button
                                    type="button"
                                    className="cancel-edit-btn"
                                    onClick={() =>
                                        setEditingStudent(null)
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="save-edit-btn"
                                >
                                    Save Changes
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =========================================
                DELETE CONFIRMATION MODAL
            ========================================= */}

            {showDeleteModal && studentToDelete && (

                <div className="delete-modal-overlay">

                    <div className="delete-modal">


                        {/* DELETE ICON */}

                        <div className="delete-icon">
                            🗑️
                        </div>


                        <h2>
                            Delete Student?
                        </h2>


                        <p>

                            Are you sure you want to delete{" "}

                            <strong>
                                {studentToDelete.name}
                            </strong>
                            ?

                        </p>


                        <p className="delete-warning">
                            This action cannot be undone.
                        </p>


                        {/* DELETE ACTIONS */}

                        <div className="delete-modal-actions">


                            {/* CANCEL */}

                            <button
                                type="button"
                                className="cancel-delete-btn"
                                onClick={() => {

                                    setShowDeleteModal(false);

                                    setStudentToDelete(null);

                                }}
                            >
                                Cancel
                            </button>


                            {/* CONFIRM DELETE */}

                            <button
                                type="button"
                                className="confirm-delete-btn"
                                onClick={handleDelete}
                            >
                                Delete Student
                            </button>

                        </div>

                    </div>

                </div>

            )}

{editSuccessPopup && (

    <div className="edit-success-overlay">

        <div className="edit-success-popup">

            <div className="edit-success-icon">
                ✓
            </div>

            <h2>
                Student Updated
            </h2>

            <p>
                The student information has been updated successfully.
            </p>

            <button
                className="edit-success-btn"
                onClick={() => setEditSuccessPopup(false)}
            >
                OK
            </button>

        </div>

    </div>

)}

            {/* =========================================
                NOTIFICATION
            ========================================= */}

            {notification?.show && (
    <div className={`notification ${notification.type}`}>

        <span>
            {notification.type === "success" ? "✓" : "!"}
        </span>

        <p>{notification.message}</p>

        <button
            onClick={() =>
                setNotification({
                    show: false,
                    type: "",
                    message: ""
                })
            }
        >
            ✕
        </button>

    </div>
)}
        </MainLayout>

    );

}

export default Students;