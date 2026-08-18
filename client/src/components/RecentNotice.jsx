import "../styles/Notice.css";

function RecentNotice({ notices }) {

    const handleViewAll = () => {
        window.location.href = "/notices";
    };

    return (

        <div className="notice-card">

            <div className="notice-header">

                <h2>📢 Recent Notices</h2>

                <button
                    className="view-all-btn"
                    onClick={handleViewAll}
                >
                    View All ↓
                </button>

            </div>

            {
                notices.length === 0 ? (

                    <p>No Notices Available</p>

                ) : (

                    notices.map((notice) => (

                        <div
                            key={notice._id}
                            className="notice-item"
                        >
<div className="notice-title-row">

    <h3 className="notice-title">
        📌 {notice.title}
    </h3>

    <span
        className={`priority-badge ${notice.priority?.toLowerCase()}`}
    >
        {notice.priority || "Normal"}
    </span>

</div>

                            <p className="notice-description">
                                {notice.description}
                            </p>

                            <div className="notice-footer">

                                <span className="posted-by">
                                    👤 {notice.postedBy?.name}
                                </span>

                                <span className="notice-time">
                                    📅 {new Date(
                                        notice.createdAt
                                    ).toLocaleDateString()}
                                </span>

                            </div>

                        </div>

                    ))

                )
            }

        </div>

    );
}

export default RecentNotice;