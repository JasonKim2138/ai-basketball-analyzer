function Navbar({
    user,
    onLogout,
    currentPage,
    onNavigate
}) {
    return (
        <nav className="navbar">

            <h1 className="navbar-title">
                🏀 AI Basketball Analyzer
            </h1>

            {user && (
                <>
                    <div className="navbar-links">

                        <button
                            onClick={() => onNavigate("dashboard")}
                            className={
                                currentPage === "dashboard"
                                    ? "nav-active"
                                    : ""
                            }
                        >
                            Dashboard
                        </button>

                        <button
                            onClick={() => onNavigate("history")}
                            className={
                                currentPage === "history"
                                    ? "nav-active"
                                    : ""
                            }
                        >
                            History
                        </button>

                        <button
                            onClick={() => onNavigate("profile")}
                            className={
                                currentPage === "profile"
                                    ? "nav-active"
                                    : ""
                            }
                        >
                            Profile
                        </button>

                    </div>

                    <div className="navbar-user">

                        <span>
                            {user.email}
                        </span>

                        <button onClick={onLogout}>
                            Logout
                        </button>

                    </div>
                </>
            )}

        </nav>
    );
}

export default Navbar;