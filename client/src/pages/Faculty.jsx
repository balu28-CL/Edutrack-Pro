import { useEffect, useState } from "react";

import {
    getFaculty,
    addFaculty,
    updateFaculty,
    deleteFaculty
} from "../services/facultyService";

import MainLayout from "../layouts/MainLayout";
import "../styles/Faculty.css";
import { getUserRole } from "../utils/auth";

function Faculty() {

    const role = getUserRole();

    const [faculty, setFaculty] = useState([]);

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        facultyId: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        designation: "",
        gender: "Male"
    });

    const [editingFaculty, setEditingFaculty] = useState(null);

    const [editForm, setEditForm] = useState({
        facultyId: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        designation: "",
        gender: "Male"
    });

    const [loading, setLoading] = useState(true);


    // =========================
    // DELETE POPUP STATE
    // =========================

    const [popup, setPopup] = useState({
        show: false,
        type: "success",
        title: "",
        message: ""
    });

    const [deleteId, setDeleteId] = useState(null);


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

            const data = await getFaculty();

            setFaculty(data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchFaculty();

    }, []);


    // =========================
    // ADD FORM CHANGE
    // =========================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    // =========================
    // ADD FACULTY
    // =========================

    const handleAddFaculty = async (e) => {

        e.preventDefault();

        try {

            const newFaculty = await addFaculty(formData);

            setFaculty([
                ...faculty,
                newFaculty
            ]);

            setFormData({
                facultyId: "",
                name: "",
                email: "",
                phone: "",
                department: "",
                designation: "",
                gender: "Male"
            });

            setShowForm(false);

            showPopup(
                "success",
                "Faculty Added",
                "The faculty member has been added successfully."
            );

        } catch (error) {

            console.log(error);

            showPopup(
                "error",
                "Operation Failed",
                error.response?.data?.message ||
                "Failed to add faculty."
            );

        }

    };


    // =========================
    // EDIT FACULTY
    // =========================

    const handleEdit = (member) => {

        setEditingFaculty(member);

        setEditForm({
            facultyId: member.facultyId || "",
            name: member.name || "",
            email: member.email || "",
            phone: member.phone || "",
            department: member.department || "",
            designation: member.designation || "",
            gender: member.gender || "Male"
        });

    };


    // =========================
    // EDIT FORM CHANGE
    // =========================

    const handleEditChange = (e) => {

        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });

    };


    // =========================
    // UPDATE FACULTY
    // =========================

    const handleUpdateFaculty = async (e) => {

        e.preventDefault();

        try {

            const updatedFaculty = await updateFaculty(
                editingFaculty._id,
                editForm
            );

            setFaculty(
                faculty.map((member) =>
                    member._id === editingFaculty._id
                        ? updatedFaculty
                        : member
                )
            );

            setEditingFaculty(null);

            showPopup(
                "success",
                "Faculty Updated",
                "The faculty information has been updated successfully."
            );

        } catch (error) {

            console.log(error);

            showPopup(
                "error",
                "Update Failed",
                error.response?.data?.message ||
                "Failed to update faculty."
            );

        }

    };


    // =========================
    // DELETE BUTTON
    // =========================

    const handleDelete = (id) => {

        setDeleteId(id);

        showPopup(
            "delete",
            "Delete Faculty?",
            "Are you sure you want to delete this faculty member? This action cannot be undone."
        );

    };


    // =========================
    // CONFIRM DELETE
    // =========================

    const confirmDelete = async () => {

        try {

            await deleteFaculty(deleteId);

            setFaculty(
                faculty.filter(
                    (member) => member._id !== deleteId
                )
            );

            setDeleteId(null);

            showPopup(
                "success",
                "Faculty Deleted",
                "The faculty member has been deleted successfully."
            );

        } catch (error) {

            console.log(error);

            setDeleteId(null);

            showPopup(
                "error",
                "Delete Failed",
                error.response?.data?.message ||
                "Failed to delete faculty."
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

            <div className="faculty-page">


                {/* ========================= */}
                {/* HEADER */}
                {/* ========================= */}

                <div className="faculty-header">

                    <div>

                        <h1>
                            Faculty
                        </h1>

                        <p>
                            Manage college faculty members
                        </p>

                    </div>


                    {role === "admin" && (

                        <button
                            className="add-faculty-btn"
                            onClick={() =>
                                setShowForm(!showForm)
                            }
                        >

                            {showForm
                                ? "✕ Close"
                                : "+ Add Faculty"}

                        </button>

                    )}

                </div>


                {/* ========================= */}
                {/* ADD FACULTY FORM */}
                {/* ========================= */}

                {role === "admin" && showForm && (

                    <form
                        className="faculty-form"
                        onSubmit={handleAddFaculty}
                    >

                        <h2>
                            Add New Faculty
                        </h2>


                        <div className="faculty-form-grid">

                            <input
                                name="facultyId"
                                placeholder="Faculty ID"
                                value={formData.facultyId}
                                onChange={handleChange}
                                required
                            />

                            <input
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                            <input
                                name="phone"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />

                            <input
                                name="department"
                                placeholder="Department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            />

                            <input
                                name="designation"
                                placeholder="Designation"
                                value={formData.designation}
                                onChange={handleChange}
                                required
                            />

                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >

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


                        <button
                            type="submit"
                            className="save-faculty-btn"
                        >
                            Add Faculty
                        </button>

                    </form>

                )}


                {/* ========================= */}
                {/* FACULTY TABLE */}
                {/* ========================= */}

                <div className="faculty-card">

                    {loading ? (

                        <p className="faculty-message">
                            Loading faculty...
                        </p>

                    ) : faculty.length === 0 ? (

                        <div className="faculty-message">

                            <div className="empty-icon">
                                👨‍🏫
                            </div>

                            <h2>
                                No Faculty Records
                            </h2>

                            <p>
                                There are currently no faculty
                                members registered.
                            </p>

                        </div>

                    ) : (

                        <div className="faculty-table-wrapper">

                            <table className="faculty-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Faculty ID
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
                                            Designation
                                        </th>

                                        <th>
                                            Phone
                                        </th>

                                        <th>
                                            Gender
                                        </th>

                                        {role === "admin" && (
                                            <th>
                                                Actions
                                            </th>
                                        )}

                                    </tr>

                                </thead>


                                <tbody>

                                    {faculty.map((member) => (

                                        <tr
                                            key={member._id}
                                        >

                                            <td>
                                                {member.facultyId}
                                            </td>

                                            <td className="faculty-name">
                                                {member.name}
                                            </td>

                                            <td>
                                                {member.email}
                                            </td>

                                            <td>
                                                {member.department}
                                            </td>

                                            <td>
                                                {member.designation}
                                            </td>

                                            <td>
                                                {member.phone}
                                            </td>

                                            <td>
                                                {member.gender}
                                            </td>


                                            {role === "admin" && (

                                                <td>

                                                    <button
                                                        className="edit-faculty-btn"
                                                        onClick={() =>
                                                            handleEdit(member)
                                                        }
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        className="delete-faculty-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                member._id
                                                            )
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


            {/* ========================= */}
            {/* EDIT FACULTY MODAL */}
            {/* ========================= */}

            {editingFaculty && (

                <div className="faculty-edit-overlay">

                    <div className="faculty-edit-modal">

                        <div className="faculty-edit-header">

                            <div>

                                <h2>
                                    ✏️ Edit Faculty
                                </h2>

                                <p>
                                    Update faculty information
                                </p>

                            </div>


                            <button
                                type="button"
                                className="close-faculty-edit"
                                onClick={() =>
                                    setEditingFaculty(null)
                                }
                            >
                                ✕
                            </button>

                        </div>


                        <form
                            onSubmit={handleUpdateFaculty}
                            className="faculty-edit-form"
                        >

                            <div className="faculty-edit-grid">


                                <div>

                                    <label>
                                        Faculty ID
                                    </label>

                                    <input
                                        name="facultyId"
                                        value={editForm.facultyId}
                                        disabled
                                    />

                                </div>


                                <div>

                                    <label>
                                        Full Name
                                    </label>

                                    <input
                                        name="name"
                                        value={editForm.name}
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>


                                <div>

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


                                <div>

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


                                <div>

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


                                <div>

                                    <label>
                                        Designation
                                    </label>

                                    <input
                                        name="designation"
                                        value={editForm.designation}
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>


                                <div>

                                    <label>
                                        Gender
                                    </label>

                                    <select
                                        name="gender"
                                        value={editForm.gender}
                                        onChange={handleEditChange}
                                        required
                                    >

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


                            <div className="faculty-edit-actions">

                                <button
                                    type="button"
                                    className="cancel-faculty-edit"
                                    onClick={() =>
                                        setEditingFaculty(null)
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="save-faculty-edit"
                                >
                                    Save Changes
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* ========================= */}
            {/* DELETE / STATUS POPUP */}
            {/* ========================= */}

            {popup.show && (

                <div className="faculty-popup-overlay">

                    <div
                        className={`faculty-popup ${popup.type}`}
                    >

                        <div className="faculty-popup-icon">

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

                            <div className="faculty-popup-actions">

                                <button
                                    className="faculty-popup-cancel"
                                    onClick={cancelDelete}
                                >
                                    Cancel
                                </button>


                                <button
                                    className="faculty-popup-confirm"
                                    onClick={confirmDelete}
                                >
                                    Delete
                                </button>

                            </div>

                        ) : (

                            <button
                                className="faculty-popup-ok"
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

export default Faculty;