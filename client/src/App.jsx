import { useState, useEffect } from "react";
import PlayerForm from "./components/PlayerForm";
import ResultList from "./components/ResultList";
import PlayerSearch from "./components/PlayerSearch";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
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
    <div>
      <h1>🏀 AI Basketball Analyzer</h1>
      {user && (
      <>
        <p>Welcome {user.email}</p>
        <button onClick={handleLogout}>
            Logout
        </button>
      </>
    )}

    <PlayerSearch onSearch={handleSearch} />

    <SignupForm onSignup={handleUserSignup} />


    <LoginForm onLogin={handleUserLogin} />

    <PlayerForm onAnalyze={handleAnalyze} />

      {loading && <p>Analyzing player...</p>}
      {error && <p>{error}</p>}
      {results.length === 0 && (<p>No players analyzed yet</p>)}
      {results.length > 0 && (<ResultList results={results} onDelete={handleDelete} onUpdate={handleUpdate}/>)}
    </div>
  );
}

export default App;