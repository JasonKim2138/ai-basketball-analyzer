import { useState, useEffect } from "react";
import MainApp from "./components/MainApp";
import AuthPage from "./pages/AuthPage";
import "./App.css";
import {
    analyzePlayer,
    deleteAnalysis,
    updatePlayer,
    loadPlayers,
    searchPlayers
} from "./api/playerApi";

import {
    userSignup,
    userLogin,
    getCurrentUser
} from "./api/authApi";

function App() {
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [user, setUser] = useState(null);

  const [success, setSuccess] = useState("");

  const [currentPage, setCurrentPage] = useState("dashboard");

  let data;

async function handleAnalyze(player) {
  setLoading(true);
  setError("");
  setSuccess("")

  try {
    const data = await analyzePlayer(player);

    setResults([...results, data]);

    setSuccess("Player analyzed successfully! 🏀");

  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
}

  async function loadHistory() {

    const data = await loadPlayers();

    setResults(data);
  }

async function handleDelete(id) {

    const confirmed = window.confirm(
        "Are you sure you want to delete this player analysis?"
    );

    if (!confirmed) {
        return;
    }

    try {

        setError("");
        setSuccess("");

        await deleteAnalysis(id);

        await loadHistory();

        setSuccess("Player analysis deleted successfully.");

    } catch (error) {

        setError(error.message);

    }
}

  async function handleUpdate(id, updatedData) {

      try {
          setError("");
          setSuccess("");

          await updatePlayer(id, updatedData);
          await loadHistory();

          setSuccess("Player updated successfully! 🏀");

          return true;

      } catch (error) {
          setError(error.message);
          return false;
      }

  }

  async function handleSearch(searchName, gradeFilter) {

    const data = await searchPlayers(searchName, gradeFilter);
    
    setResults(data);
  }

  async function handleUserSignup(email, password) {
    if (!email || !password) {
        setError("Please fill everything out");
        return;
    }
    try {
      const data = await userSignup (email, password);

      alert(data.message);

    } catch (error) {
      
      alert(error.message);

    }
  }

  async function handleUserLogin(email, password) {
    try {

      const data = await userLogin(email, password);

      localStorage.setItem("token", data.token);

      await loadUser();
      await loadHistory(); 

      alert(data.message);

    } catch(error) {

      alert(error.message);

    }
  }

  function handleLogout() {

    localStorage.removeItem("token");

    setUser(null);

    setResults([]);
  }

  async function loadUser() {
    try {

      setLoading(true);

      const data = await getCurrentUser();

      setUser(data);

    } catch(error) {

        localStorage.removeItem("token");
        setUser(null);

    } finally {

        setLoading(false);
        
    }
  }

  useEffect(() => {

    loadHistory();
    loadUser();

  }, []);


  return (
    <div>

      {!user && (
          <AuthPage
              onLogin={handleUserLogin}
              onSignup={handleUserSignup}
              error={error}
          />
      )}

      {user && (
          <MainApp
              user={user}
              onLogout={handleLogout}
              currentPage={currentPage}
              onNavigate={setCurrentPage}
              onAnalyze={handleAnalyze}
              onSearch={handleSearch}
              results={results}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              loading={loading}
              error={error}
          />
      )}

    </div>
  );
}

export default App;