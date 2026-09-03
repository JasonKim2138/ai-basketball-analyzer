import { useState, useEffect } from "react";
import MainApp from "./components/MainApp";
import AuthPage from "./pages/AuthPage";
import useAuth from "./hooks/useAuth";
import usePlayers from "./hooks/usePlayers";

import "./App.css";

function App() {

  const [success, setSuccess] = useState("");

  const [currentPage, setCurrentPage] = useState("dashboard");

  const {
    user,
    loading: authLoading,
    error: authError,
    login,
    signup,
    logout
  } = useAuth();

  const {
    results,
    loading: playerLoading,
    error: playerError,
    analyze,
    loadHistory,
    deletePlayer,
    updatePlayerData,
    search
  } = usePlayers();


    // -------------------------
    // PLAYER FUNCTIONS
    // -------------------------


  async function handleDelete(id) {
      const confirmed = window.confirm(
          "Are you sure you want to delete this player analysis?"
      );

      if (!confirmed) {
          return;
      }

      setSuccess("");

      try {
          await deletePlayer(id);

          setSuccess("Player analysis deleted successfully.");

      } catch (error) {
      }
  }


  async function handleUpdate(id, updatedData) {
      setSuccess("");

      try {
          await updatePlayerData(id, updatedData);

          setSuccess("Player updated successfully! 🏀");

          return true;

      } catch (error) {
          return false;
      }
  }


  async function handleSearch(searchName, gradeFilter) {
      setSuccess("");

      try {

          await search(searchName, gradeFilter);

      } catch (error) {
      }
  }


    // -------------------------
    // INITIAL LOAD
    // -------------------------

    useEffect(() => {
        if (user) {
            loadHistory();
        }
    }, [user]);


    // -------------------------
    // UI
    // -------------------------

    return (
        <div>

            {!user && (
                <AuthPage
                    onLogin={login}
                    onSignup={signup}
                    error={authError}
                />
            )}


            {user && (
                <MainApp
                    user={user}
                    onLogout={logout}

                    currentPage={currentPage}
                    onNavigate={setCurrentPage}

                    onAnalyze={analyze}
                    onSearch={handleSearch}

                    results={results}

                    onDelete={handleDelete}
                    onUpdate={handleUpdate}

                    loading={playerLoading}
                    error={playerError}
                    success={success}

                    authLoading={authLoading}
                />
            )}

        </div>
    );
}

export default App;