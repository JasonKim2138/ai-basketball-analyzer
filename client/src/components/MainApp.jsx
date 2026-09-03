import Navbar from "./Navbar";
import DashboardPage from "../pages/DashboardPage";
import HistoryPage from "../pages/HistoryPage";
import ProfilePage from "../pages/ProfilePage";

function MainApp({
    user,
    onLogout,
    currentPage,
    onNavigate,
    onAnalyze,
    onSearch,
    results,
    onDelete,
    onUpdate,
    loading,
    error,
    success
}) {

    return (
        <>
            <Navbar
                user={user}
                onLogout={onLogout}
                currentPage={currentPage}
                onNavigate={onNavigate}
            />

            {currentPage === "dashboard" && (
                <DashboardPage
                    onAnalyze={onAnalyze}
                    loading={loading}
                />
            )}

            {currentPage === "history" && (
                <HistoryPage
                    results={results}
                    onSearch={onSearch}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    loading={loading}
                    error={error}
                    success={success}
                />
            )}

            {currentPage === "profile" && (
                <ProfilePage
                    user={user}
                />
            )}
        </>
    );
}

export default MainApp;