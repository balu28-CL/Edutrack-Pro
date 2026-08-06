function RecentNotice({ notices }) {

    return (

        <div className="notice-card">

            <h2>📢 Recent Notices</h2>

            {
                notices.length === 0 ? (

                    <p>No Notices Available</p>

                ) : (

                    notices.map((notice) => (

                        <div
                            key={notice._id}
                            className="notice-item"
                        >

                            <h3>{notice.title}</h3>

                            <p>{notice.description}</p>

                            <small>

                                Posted By : {notice.postedBy.name}

                            </small>

                        </div>

                    ))

                )
            }

        </div>

    );

}

export default RecentNotice;