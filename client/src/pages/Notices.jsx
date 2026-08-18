import { useEffect, useState } from "react";

import {
    getNotices,
    addNotice,
    updateNotice,
    deleteNotice
} from "../services/noticeService";

import MainLayout from "../layouts/MainLayout";
import "../styles/Notice.css";

import { getFaculty } from "../services/facultyService";
import { getUserRole } from "../utils/auth";

function Notices() {

    const [notices, setNotices] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [faculty, setFaculty] = useState([]);

    const [popup, setPopup] = useState({
    show: false,
    type: "success",
    title: "",
    message: ""
});

const [deleteId, setDeleteId] = useState(null);

    const role = getUserRole();

    const canManageNotices =
        role === "admin" || role === "faculty";

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        postedBy: "",
        audience: "All",
        priority: "Normal",
        expiryDate: ""
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

    useEffect(() => {

        const fetchData = async () => {

            try {

                const [noticeData, facultyData] =
                    await Promise.all([
                        getNotices(),
                        getFaculty()
                    ]);

                setNotices(noticeData);
                setFaculty(facultyData);

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

        fetchData();

    }, []);


    // =========================
    // FORM CHANGE
    // =========================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {

        setFormData({
            title: "",
            description: "",
            postedBy: "",
            audience: "All",
            priority: "Normal",
            expiryDate: ""
        });

    };


    // =========================
    // ADD / UPDATE
    // =========================

    const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        // =========================
        // UPDATE NOTICE
        // =========================

        if (editingNotice) {

            const updatedNotice =
                await updateNotice(
                    editingNotice._id,
                    formData
                );

            setNotices(
                notices.map((notice) =>
                    notice._id === editingNotice._id
                        ? updatedNotice
                        : notice
                )
            );

            setEditingNotice(null);
            resetForm();

            showPopup(
                "success",
                "Notice Updated",
                "The notice has been updated successfully."
            );

        }

        // =========================
        // ADD NOTICE
        // =========================

        else {

            const newNotice =
                await addNotice(formData);

            setNotices([
                newNotice,
                ...notices
            ]);

            resetForm();
            setShowForm(false);

            showPopup(
                "success",
                "Notice Added",
                "The notice has been added successfully."
            );

        }

    } catch (error) {

        console.log(error);

        showPopup(
            "error",
            "Operation Failed",
            error.response?.data?.message ||
            "Failed to save notice."
        );

    }

};

    // =========================
    // EDIT
    // =========================

    const handleEdit = (notice) => {

        setEditingNotice(notice);

        setFormData({
            title: notice.title || "",

            description:
                notice.description || "",

            postedBy:
                notice.postedBy?._id || "",

            audience:
                notice.audience || "All",

            priority:
                notice.priority || "Normal",

            expiryDate:
                notice.expiryDate
                    ? notice.expiryDate.substring(0, 10)
                    : ""
        });

        setShowForm(false);

    };


    // =========================
    // CANCEL EDIT
    // =========================

    const handleCancelEdit = () => {

        setEditingNotice(null);
        resetForm();

    };


    // =========================
    // DELETE
    // =========================

    // =========================
// DELETE BUTTON
// =========================

const handleDelete = (id) => {

    setDeleteId(id);

    showPopup(
        "delete",
        "Delete Notice?",
        "Are you sure you want to delete this notice? This action cannot be undone."
    );

};


// =========================
// CONFIRM DELETE
// =========================

const confirmDelete = async () => {

    try {

        await deleteNotice(deleteId);

        setNotices(
            notices.filter(
                (notice) =>
                    notice._id !== deleteId
            )
        );

        if (
            editingNotice &&
            editingNotice._id === deleteId
        ) {

            setEditingNotice(null);
            resetForm();

        }

        setDeleteId(null);

        showPopup(
            "success",
            "Notice Deleted",
            "The notice has been deleted successfully."
        );

    } catch (error) {

        console.log(error);

        setDeleteId(null);

        showPopup(
            "error",
            "Delete Failed",
            error.response?.data?.message ||
            "Failed to delete notice."
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

    // =========================
    // ADD NOTICE BUTTON
    // =========================

    const handleAddNotice = () => {

        setEditingNotice(null);
        resetForm();

        setShowForm(!showForm);

    };


    return (

        <MainLayout>

            <div className="dashboard notices-page">


                {/* ========================= */}
                {/* PAGE HEADER */}
                {/* ========================= */}

                <div className="notices-page-header">

                    <div className="notices-page-title">

                        <h1>
                            Notices
                        </h1>

                        <p>
                            View and manage college notices
                        </p>

                    </div>


                    {canManageNotices && (

                        <button
                            type="button"
                            className="add-notice-btn"
                            onClick={handleAddNotice}
                        >

                            {showForm
                                ? "✕ Close"
                                : "+ Add Notice"}

                        </button>

                    )}

                </div>


                {/* ========================= */}
                {/* ADD NOTICE FORM */}
                {/* ========================= */}

                {canManageNotices &&
                    showForm && (

                    <form
                        className="notice-form"
                        onSubmit={handleSubmit}
                    >

                        <h2>
                            📢 Add New Notice
                        </h2>


                        <input
                            name="title"
                            placeholder="Notice Title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />


                        <textarea
                            name="description"
                            placeholder="Notice Description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />


                        <select
                            name="postedBy"
                            value={formData.postedBy}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Faculty
                            </option>

                            {faculty.map((member) => (

                                <option
                                    key={member._id}
                                    value={member._id}
                                >

                                    {member.facultyId}
                                    {" - "}
                                    {member.name}

                                </option>

                            ))}

                        </select>


                        <select
                            name="audience"
                            value={formData.audience}
                            onChange={handleChange}
                        >

                            <option value="All">
                                All
                            </option>

                            <option value="Students">
                                Students
                            </option>

                            <option value="Faculty">
                                Faculty
                            </option>

                        </select>


                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                        >

                            <option value="Normal">
                                Normal
                            </option>

                            <option value="Important">
                                Important
                            </option>

                            <option value="Urgent">
                                Urgent
                            </option>

                        </select>


                        <input
                            type="date"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            required
                        />


                        <button
                            type="submit"
                            className="save-faculty-btn"
                        >
                            Add Notice
                        </button>

                    </form>

                )}


                {/* ========================= */}
                {/* NOTICE SECTION */}
                {/* ========================= */}

                <div className="notice-card">


                    <div className="notice-header">

                        <h2>
                            📢 All Notices
                        </h2>

                    </div>


                    {/* ========================= */}
                    {/* LOADING */}
                    {/* ========================= */}

                    {loading ? (

                        <p className="notice-status">
                            Loading notices...
                        </p>

                    ) : notices.length === 0 ? (

                        <p className="notice-status">
                            No Notices Available
                        </p>

                    ) : (

                        notices.map((notice) => (

                            <div
                                key={notice._id}
                                className="notice-item"
                            >


                                {/* TITLE */}

                                <div className="notice-title-row">

                                    <h3 className="notice-title">

                                        📌 {notice.title}

                                    </h3>


                                    <span
                                        className={`priority-badge ${
                                            notice.priority?.toLowerCase()
                                        }`}
                                    >

                                        {notice.priority || "Normal"}

                                    </span>

                                </div>


                                {/* DESCRIPTION */}

                                <p className="notice-description">

                                    {notice.description}

                                </p>


                                {/* FOOTER */}

                                <div className="notice-footer">

                                    <span className="posted-by">

                                        👤 {notice.postedBy?.name}

                                    </span>


                                    <span className="notice-time">

                                        📅{" "}

                                        {new Date(
                                            notice.createdAt
                                        ).toLocaleDateString()}

                                    </span>

                                </div>


                                {/* ACTIONS */}

                                {canManageNotices && (

                                    <div className="notice-actions">

                                        <button
                                            type="button"
                                            className="edit-notice-btn"
                                            onClick={() =>
                                                handleEdit(notice)
                                            }
                                        >
                                            Edit
                                        </button>


                                        <button
                                            type="button"
                                            className="delete-notice-btn"
                                            onClick={() =>
                                                handleDelete(
                                                    notice._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                )}


                                {/* EDIT FORM */}

                                {canManageNotices &&
                                    editingNotice?._id ===
                                        notice._id && (

                                    <form
                                        className="notice-form"
                                        onSubmit={handleSubmit}
                                    >

                                        <h2>
                                            ✏️ Edit Notice
                                        </h2>


                                        <input
                                            name="title"
                                            placeholder="Notice Title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                        />


                                        <textarea
                                            name="description"
                                            placeholder="Notice Description"
                                            value={
                                                formData.description
                                            }
                                            onChange={handleChange}
                                            required
                                        />


                                        <select
                                            name="postedBy"
                                            value={
                                                formData.postedBy
                                            }
                                            onChange={handleChange}
                                            required
                                        >

                                            <option value="">
                                                Select Faculty
                                            </option>

                                            {faculty.map(
                                                (member) => (

                                                    <option
                                                        key={member._id}
                                                        value={member._id}
                                                    >

                                                        {member.facultyId}
                                                        {" - "}
                                                        {member.name}

                                                    </option>

                                                )
                                            )}

                                        </select>


                                        <select
                                            name="audience"
                                            value={
                                                formData.audience
                                            }
                                            onChange={handleChange}
                                        >

                                            <option value="All">
                                                All
                                            </option>

                                            <option value="Students">
                                                Students
                                            </option>

                                            <option value="Faculty">
                                                Faculty
                                            </option>

                                        </select>


                                        <select
                                            name="priority"
                                            value={
                                                formData.priority
                                            }
                                            onChange={handleChange}
                                        >

                                            <option value="Normal">
                                                Normal
                                            </option>

                                            <option value="Important">
                                                Important
                                            </option>

                                            <option value="Urgent">
                                                Urgent
                                            </option>

                                        </select>


                                        <input
                                            type="date"
                                            name="expiryDate"
                                            value={
                                                formData.expiryDate
                                            }
                                            onChange={handleChange}
                                            required
                                        />


                                        <div className="notice-form-actions">

                                            <button
                                                type="submit"
                                                className="save-notices-btn"
                                            >
                                                Save Changes
                                            </button>


                                            <button
                                                type="button"
                                                className="notice-cancel-btn"
                                                onClick={
                                                    handleCancelEdit
                                                }
                                            >
                                                Cancel
                                            </button>

                                        </div>

                                    </form>

                                )}

                            </div>

                        ))

                    )}

                </div>

            </div>

             {/* ========================= */}
            {/* POPUP */}
            {/* ========================= */}

            {popup.show && (

                <div className="notice-popup-overlay">

                    <div className={`notice-popup ${popup.type}`}>

                        <div className="notice-popup-icon">

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

                            <div className="notice-popup-actions">

                                <button
                                    className="notice-popup-cancel"
                                    onClick={cancelDelete}
                                >
                                    Cancel
                                </button>


                                <button
                                    className="notice-popup-confirm"
                                    onClick={confirmDelete}
                                >
                                    Delete
                                </button>

                            </div>

                        ) : (

                            <button
                                className="notice-popup-ok"
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

export default Notices;