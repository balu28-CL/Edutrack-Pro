import { useEffect, useState } from "react";

import {
    getMarks,
    addMarks,
    updateMarks,
    deleteMarks
} from "../services/marksService";

import { getStudents } from "../services/studentService";
import { getFaculty } from "../services/facultyService";

import MainLayout from "../layouts/MainLayout";

import "../styles/Marks.css";
import { getUserRole } from "../utils/auth";


function Marks() {

    const [marks, setMarks] = useState([]);
    const [students, setStudents] = useState([]);
    const [faculty, setFaculty] = useState([]);

    const [popup, setPopup] = useState({
        show: false,
        type: "success",
        title: "",
        message: ""
    });

    const [deleteId, setDeleteId] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);

    const role = getUserRole();


    const [formData, setFormData] = useState({
        student: "",
        faculty: "",
        subject: "",
        examType: "Mid-1",
        marksObtained: "",
        maximumMarks: "",
        remarks: ""
    });


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
    // FETCH DATA
    // =========================

    const fetchData = async () => {

        try {

            const [
                marksData,
                studentsData,
                facultyData
            ] = await Promise.all([
                getMarks(),
                getStudents(),
                getFaculty()
            ]);

            setMarks(marksData);
            setStudents(studentsData);
            setFaculty(facultyData);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchData();

    }, []);


    // =========================
    // HANDLE FORM CHANGE
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
            student: "",
            faculty: "",
            subject: "",
            examType: "Mid-1",
            marksObtained: "",
            maximumMarks: "",
            remarks: ""
        });

        setEditingId(null);

    };


    // =========================
    // OPEN ADD FORM
    // =========================

    const handleAddMarksClick = () => {

        if (showForm) {

            resetForm();
            setShowForm(false);

            return;

        }

        resetForm();
        setShowForm(true);

    };


    // =========================
    // SAVE / UPDATE MARKS
    // =========================

    const handleSaveMarks = async (e) => {

        e.preventDefault();

        const marksObtained = Number(
            formData.marksObtained
        );

        const maximumMarks = Number(
            formData.maximumMarks
        );


        // Invalid marks

        if (marksObtained > maximumMarks) {

            showPopup(
                "error",
                "Invalid Marks",
                "Marks obtained cannot be greater than maximum marks."
            );

            return;

        }


        try {

            // =========================
            // UPDATE
            // =========================

            if (editingId) {

                await updateMarks(
                    editingId,
                    {
                        ...formData,
                        marksObtained,
                        maximumMarks
                    }
                );

                await fetchData();

                resetForm();

                setShowForm(false);

                showPopup(
                    "success",
                    "Marks Updated",
                    "Student marks have been updated successfully."
                );

            }

            // =========================
            // ADD
            // =========================

            else {

                await addMarks({
                    ...formData,
                    marksObtained,
                    maximumMarks
                });

                await fetchData();

                resetForm();

                setShowForm(false);

                showPopup(
                    "success",
                    "Marks Added",
                    "Student marks have been added successfully."
                );

            }

        } catch (error) {

            console.log(error);

            showPopup(
                "error",
                "Operation Failed",
                error.response?.data?.message ||
                "Failed to save marks."
            );

        }

    };


    // =========================
    // EDIT MARKS
    // =========================

    const handleEdit = (record) => {

        setEditingId(record._id);

        setFormData({
            student: record.student?._id || "",
            faculty: record.faculty?._id || "",
            subject: record.subject || "",
            examType: record.examType || "Mid-1",
            marksObtained: record.marksObtained ?? "",
            maximumMarks: record.maximumMarks ?? "",
            remarks: record.remarks || ""
        });

        setShowForm(true);

    };


    // =========================
    // CANCEL EDIT
    // =========================

    const handleCancel = () => {

        resetForm();

        setShowForm(false);

    };


    // =========================
    // DELETE BUTTON
    // =========================

    const handleDelete = (id) => {

        setDeleteId(id);

        showPopup(
            "delete",
            "Delete Marks?",
            "Are you sure you want to delete this marks record? This action cannot be undone."
        );

    };


    // =========================
    // CONFIRM DELETE
    // =========================

    const confirmDelete = async () => {

        try {

            await deleteMarks(deleteId);

            setMarks(
                marks.filter(
                    record => record._id !== deleteId
                )
            );

            setDeleteId(null);

            showPopup(
                "success",
                "Marks Deleted",
                "The marks record has been deleted successfully."
            );

        } catch (error) {

            console.log(error);

            setDeleteId(null);

            showPopup(
                "error",
                "Delete Failed",
                error.response?.data?.message ||
                "Failed to delete marks."
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


    return (

        <MainLayout>

            <div className="marks-page">


                {/* ========================= */}
                {/* HEADER */}
                {/* ========================= */}

                <div className="marks-header">

                    <div>

                        <h1>Marks</h1>

                        <p>
                            Manage student examination marks
                        </p>

                    </div>


                    {(role === "admin" || role === "faculty") && (

                        <button
                            className="add-marks-btn"
                            onClick={handleAddMarksClick}
                        >

                            {showForm
                                ? "✕ Close"
                                : "+ Add Marks"}

                        </button>

                    )}

                </div>


                {/* ========================= */}
                {/* ADD / EDIT FORM */}
                {/* ========================= */}

                {showForm && (

                    <form
                        className="marks-form"
                        onSubmit={handleSaveMarks}
                    >

                        <h2>

                            {editingId
                                ? "Edit Student Marks"
                                : "Add Student Marks"}

                        </h2>


                        <div className="marks-form-grid">


                            {/* STUDENT */}

                            <select
                                name="student"
                                value={formData.student}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Student
                                </option>

                                {students.map(student => (

                                    <option
                                        key={student._id}
                                        value={student._id}
                                    >

                                        {student.studentId} - {student.name}

                                    </option>

                                ))}

                            </select>


                            {/* FACULTY */}

                            <select
                                name="faculty"
                                value={formData.faculty}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Faculty
                                </option>

                                {faculty.map(member => (

                                    <option
                                        key={member._id}
                                        value={member._id}
                                    >

                                        {member.facultyId} - {member.name}

                                    </option>

                                ))}

                            </select>


                            {/* SUBJECT */}

                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />


                            {/* EXAM TYPE */}

                            <select
                                name="examType"
                                value={formData.examType}
                                onChange={handleChange}
                                required
                            >

                                <option value="Mid-1">
                                    Mid-1
                                </option>

                                <option value="Mid-2">
                                    Mid-2
                                </option>

                                <option value="Assignment">
                                    Assignment
                                </option>

                                <option value="Final">
                                    Final
                                </option>

                            </select>


                            {/* MARKS OBTAINED */}

                            <input
                                type="number"
                                name="marksObtained"
                                placeholder="Marks Obtained"
                                min="0"
                                value={formData.marksObtained}
                                onChange={handleChange}
                                required
                            />


                            {/* MAXIMUM MARKS */}

                            <input
                                type="number"
                                name="maximumMarks"
                                placeholder="Maximum Marks"
                                min="1"
                                value={formData.maximumMarks}
                                onChange={handleChange}
                                required
                            />


                            {/* REMARKS */}

                            <input
                                type="text"
                                name="remarks"
                                placeholder="Remarks (optional)"
                                value={formData.remarks}
                                onChange={handleChange}
                            />

                        </div>


                        {/* FORM BUTTONS */}

                        <div className="marks-form-actions">

                            <button
                                type="submit"
                                className="save-marks-btn"
                            >

                                {editingId
                                    ? "Update Marks"
                                    : "Save Marks"}

                            </button>


                            {editingId && (

                                <button
                                    type="button"
                                    className="cancel-marks-btn"
                                    onClick={handleCancel}
                                >

                                    Cancel

                                </button>

                            )}

                        </div>

                    </form>

                )}


                {/* ========================= */}
                {/* MARKS TABLE */}
                {/* ========================= */}

                <div className="marks-card">

                    {loading ? (

                        <div className="marks-message">

                            Loading marks...

                        </div>

                    ) : marks.length === 0 ? (

                        <div className="marks-message">

                            <div className="marks-empty-icon">
                                📝
                            </div>

                            <h2>
                                No Marks Records
                            </h2>

                            <p>
                                No student marks have been recorded yet.
                            </p>

                        </div>

                    ) : (

                        <div className="marks-table-wrapper">

                            <table className="marks-table">

                                <thead>

                                    <tr>

                                        <th>Student</th>
                                        <th>Faculty</th>
                                        <th>Subject</th>
                                        <th>Exam</th>
                                        <th>Marks</th>
                                        <th>Percentage</th>
                                        <th>Remarks</th>

                                        {(role === "admin" ||
                                            role === "faculty") && (

                                            <th>Action</th>

                                        )}

                                    </tr>

                                </thead>


                                <tbody>

                                    {marks.map(record => {

                                        const percentage =
                                            (
                                                (record.marksObtained /
                                                    record.maximumMarks) *
                                                100
                                            ).toFixed(1);


                                        return (

                                            <tr
                                                key={record._id}
                                            >

                                                <td className="marks-student">

                                                    {record.student?.name}

                                                </td>


                                                <td>

                                                    {record.faculty?.name}

                                                </td>


                                                <td>

                                                    {record.subject}

                                                </td>


                                                <td>

                                                    <span className="exam-badge">

                                                        {record.examType}

                                                    </span>

                                                </td>


                                                <td className="marks-value">

                                                    {record.marksObtained}
                                                    {" / "}
                                                    {record.maximumMarks}

                                                </td>


                                                <td>

                                                    <span className="percentage-badge">

                                                        {percentage}%

                                                    </span>

                                                </td>


                                                <td>

                                                    {record.remarks || "-"}

                                                </td>


                                                {(role === "admin" ||
                                                    role === "faculty") && (

                                                    <td>

                                                        <button
                                                            className="edit-marks-btn"
                                                            onClick={() =>
                                                                handleEdit(record)
                                                            }
                                                        >
                                                            Edit
                                                        </button>


                                                        <button
                                                            className="delete-marks-btn"
                                                            onClick={() =>
                                                                handleDelete(record._id)
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </td>

                                                )}

                                            </tr>

                                        );

                                    })}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>
</div>

                {/* ========================= */}
                {/* POPUP */}
                {/* ========================= */}

                {popup.show && (

                    <div className="marks-popup-overlay">

                        <div className={`marks-popup ${popup.type}`}>

                            <div className="marks-popup-icon">

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


                            {/* DELETE CONFIRMATION */}

                            {popup.type === "delete" ? (

                                <div className="marks-popup-actions">

                                    <button
                                        className="marks-popup-cancel"
                                        onClick={cancelDelete}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="marks-popup-confirm"
                                        onClick={confirmDelete}
                                    >
                                        Delete
                                    </button>

                                </div>

                            ) : (

                                <button
                                    className="marks-popup-ok"
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


export default Marks;