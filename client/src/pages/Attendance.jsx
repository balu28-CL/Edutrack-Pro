import { useEffect, useState } from "react";

import {
    getAttendance,
    addAttendance,
    updateAttendance,
    deleteAttendance
} from "../services/attendanceService";

import { getStudents } from "../services/studentService";
import { getFaculty } from "../services/facultyService";

import MainLayout from "../layouts/MainLayout";

import "../styles/Attendance.css";
import { getUserRole } from "../utils/auth";

function Attendance() {

    const [attendance, setAttendance] = useState([]);
    const [students, setStudents] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);

const [showErrorModal, setShowErrorModal] = useState(false);
const [errorMessage, setErrorMessage] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const role = getUserRole();

    const [formData, setFormData] = useState({
        student: "",
        faculty: "",
        subject: "",
        date: "",
        status: "Present",
        remarks: ""
    });


    const fetchData = async () => {

        try {

            const [
                attendanceData,
                studentsData,
                facultyData
            ] = await Promise.all([
                getAttendance(),
                getStudents(),
                getFaculty()
            ]);

            setAttendance(attendanceData);
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


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleMarkAttendance = () => {

    if (showForm) {
        // Close the form
        setShowForm(false);
        setEditingId(null);
        return;
    }

    // Open a fresh form
    setEditingId(null);

    setFormData({
        student: "",
        faculty: "",
        subject: "",
        date: "",
        status: "Present",
        remarks: ""
    });

    setShowForm(true);
};


    const handleAddAttendance = async (e) => {

    e.preventDefault();

    try {

        if (editingId) {

            await updateAttendance(
                editingId,
                formData
            );

        } else {

            await addAttendance(formData);

        }

        await fetchData();

        setFormData({
            student: "",
            faculty: "",
            subject: "",
            date: "",
            status: "Present",
            remarks: ""
        });

        setEditingId(null);
        setShowForm(false);

    } catch (error) {

    console.log(error);

    setErrorMessage(
        error.response?.data?.message ||
        "Failed to save attendance"
    );

    setShowErrorModal(true);

}
};

const handleEdit = (record) => {

    setEditingId(record._id);

    setFormData({
        student: record.student?._id || "",
        faculty: record.faculty?._id || "",
        subject: record.subject || "",
        date: record.date
            ? new Date(record.date).toISOString().split("T")[0]
            : "",
        status: record.status || "Present",
        remarks: record.remarks || ""
    });

    setShowForm(true);
};


    const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
};

const confirmDeleteAttendance = async () => {

    try {

        await deleteAttendance(deleteId);

        setAttendance(
            attendance.filter(
                record => record._id !== deleteId
            )
        );

        setShowDeleteModal(false);
        setDeleteId(null);

    } catch (error) {

        console.log(error);

        setShowDeleteModal(false);
        setDeleteId(null);

        setErrorMessage(
            error.response?.data?.message ||
            "Failed to delete attendance"
        );

        setShowErrorModal(true);
    }
};

    return (

        <MainLayout>

            <div className="attendance-page">

                <div className="attendance-header">

                    <div>

                        <h1>Attendance</h1>

                        <p>
    {role === "student"
        ? "View your attendance records"
        : "Manage student attendance records"}
</p>

                    </div>

{(role === "admin" || role === "faculty") && (
                    <button
                        className="add-attendance-btn"
                        onClick={handleMarkAttendance}
                    >

                        {showForm
                            ? "✕ Close"
                            : "+ Mark Attendance"}

                    </button>)}

                </div>


                {showForm && (

                    <form
                        className="attendance-form"
                        onSubmit={handleAddAttendance}
                    >

                        <h2>
    {editingId
        ? "Edit Attendance"
        : "Mark Attendance"}
</h2>


                        <div className="attendance-form-grid">

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


                            <input
                                name="subject"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />


                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />


                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >

                                <option value="Present">
                                    Present
                                </option>

                                <option value="Absent">
                                    Absent
                                </option>

                            </select>


                            <input
                                name="remarks"
                                placeholder="Remarks (optional)"
                                value={formData.remarks}
                                onChange={handleChange}
                            />

                        </div>


                        <button
                            type="submit"
                            className="save-attendance-btn"
                        >
                           {editingId
    ? "Update Attendance"
    : "Save Attendance"}
                        </button>

                    </form>

                )}


                <div className="attendance-card">

                    {loading ? (

                        <div className="attendance-message">
                            Loading attendance...
                        </div>

                    ) : attendance.length === 0 ? (

                        <div className="attendance-message">

                            <div className="attendance-empty-icon">
                                📅
                            </div>

                            <h2>
                                No Attendance Records
                            </h2>

                            <p>
                                No attendance has been recorded yet.
                            </p>

                        </div>

                    ) : (

                        <div className="attendance-table-wrapper">

                            <table className="attendance-table">

                                <thead>
    <tr>

        {/* Student column only for Admin / Faculty */}
        {(role === "admin" || role === "faculty") && (
            <th>Student</th>
        )}

        {/* Faculty column only for Admin / Faculty */}
        {(role === "admin" || role === "faculty") && (
            <th>Faculty</th>
        )}

        <th>Subject</th>
        <th>Date</th>
        <th>Status</th>
        <th>Remarks</th>

        {/* Action only for Admin / Faculty */}
        {(role === "admin" || role === "faculty") && (
            <th>Action</th>
        )}

    </tr>

                                </thead>


                                <tbody>

    {attendance.map(record => (

        <tr key={record._id}>

            {/* Student */}
            {(role === "admin" || role === "faculty") && (
                <td className="attendance-student">
                    {record.student?.name}
                </td>
            )}

            {/* Faculty */}
            {(role === "admin" || role === "faculty") && (
                <td>
                    {record.faculty?.name}
                </td>
            )}

            <td>
                {record.subject}
            </td>

            <td>
                {new Date(
                    record.date
                ).toLocaleDateString()}
            </td>

            <td>
                <span
                    className={
                        record.status === "Present"
                            ? "status-present"
                            : "status-absent"
                    }
                >
                    {record.status}
                </span>
            </td>

            <td>
                {record.remarks || "-"}
            </td>

            {/* Delete */}
            {(role === "admin" || role === "faculty") && (
                <td>

    <button
        className="edit-attendance-btn"
        onClick={() =>
            handleEdit(record)
        }
    >
        Edit
    </button>

    <button
        className="delete-attendance-btn"
        onClick={() =>
            handleDelete(record._id)
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

            {/* DELETE CONFIRMATION MODAL */}

{showDeleteModal && (

    <div className="attendance-modal-overlay">

        <div className="attendance-confirm-modal">

            <div className="attendance-modal-icon delete-icon">
                🗑️
            </div>

            <h2>Delete Attendance?</h2>

            <p>
                Are you sure you want to delete this attendance
                record? This action cannot be undone.
            </p>

            <div className="attendance-modal-actions">

                <button
                    type="button"
                    className="attendance-cancel-btn"
                    onClick={() => {
                        setShowDeleteModal(false);
                        setDeleteId(null);
                    }}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="attendance-confirm-delete-btn"
                    onClick={confirmDeleteAttendance}
                >
                    Delete
                </button>

            </div>

        </div>

    </div>

)}


{/* ERROR MODAL */}

{showErrorModal && (

    <div className="attendance-modal-overlay">

        <div className="attendance-confirm-modal">

            <div className="attendance-modal-icon error-icon">
                ⚠️
            </div>

            <h2>Something went wrong</h2>

            <p>
                {errorMessage}
            </p>

            <div className="attendance-modal-actions">

                <button
                    type="button"
                    className="attendance-error-ok-btn"
                    onClick={() => setShowErrorModal(false)}
                >
                    OK
                </button>

            </div>

        </div>

    </div>

)}

        </MainLayout>

    );
}


export default Attendance;