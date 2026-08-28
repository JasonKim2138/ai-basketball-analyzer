import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import AuthScreen from "./components/AuthScreen";
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

  

  let data;

async function handleAnalyze(player) {
  setLoading(true);
  setError("");

  try {
    const data = await analyzePlayer(player);

    setResults([...results, data]);
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

    const data = await deleteAnalysis(id);
    console.log("hello");
    console.log(data);
    loadHistory();

  }

async function handleUpdate(id, updatedData) {

  try {
      await updatePlayer(id, updatedData);
      loadHistory();
  } catch (error) {
      setError(error.message);
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
    <div className="app">
    <Navbar
    user={user}
    onLogout={handleLogout}
    />

    {!user && (
        <AuthScreen
            onLogin={handleUserLogin}
            onSignup={handleUserSignup}
        />
    )}

    {user && (
    <Dashboard
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