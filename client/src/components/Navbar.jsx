function Navbar({ user, onLogout }) {

    return (
        <nav className="navbar">

            <h1 className="navbar-title">
                🏀 AI Basketball Analyzer
            </h1>

            {user && (
                <div className="navbar-user">
                    <span>Welcome {user.email}</span>

                    <button 
                        className="navbar-button"
                        onClick={onLogout}
                    >
                        Logout
                    </button>
                </div>
            )}

        </nav>
    );
}

export default Navbar;