import { useState, useEffect } from "react";
import PlayerForm from "./components/PlayerForm";
import ResultList from "./components/ResultList";
import { analyzePlayer, deleteAnalysis, updateAnalysis, loadPlayers, searchPlayers, userSignup, userLogin, getCurrentUser } from "./services/api";

function App() {
  const [player, setPlayer] = useState({
  name: "",
  points: "",
  assists: "",
  rebounds: ""
  });
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [gradeFilter, setGradeFilter] = useState("");

  const [searchName, setSearchName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);

  

  let data;

  async function handleAnalyze() {

    setLoading(true);

    try {
      data = await analyzePlayer(player);
      
    } catch (error) {
      setError("Server failed");
    }
    setResults([...results, data]);
    setLoading(false);

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

  async function handleUpdate(id) {

    await updateAnalysis(id, {
      grade: "S+",
      message: "GOAT STATUS"
    });

    loadHistory();

  }

  async function handleSearch(searchName, gradeFilter) {

    const data = await searchPlayers(searchName, gradeFilter);
    
    setResults(data);
  }

  async function handleUserSignup() {
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

  async function handleUserLogin() {
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

    loadUser();
    loadHistory(); 
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

      <input
        type="text"
        placeholder="Search player"

        value={searchName}

        onChange={(e) =>
          setSearchName(e.target.value)
        }
      />
      <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>

        <option value="">
          All Grades
        </option>

        <option value="S+">
          S+
        </option>

        <option value="S">
          S
        </option>

        <option value="A">
          A
        </option>

        <option value="B">
          B
        </option>

        <option value="C">
          C
        </option>

      </select>

      <button onClick={() => handleSearch(searchName, gradeFilter)}> Search </button>
      <h2>Signup</h2>

      <input
        type="text"
        placeholder="Email"

        value={email}

        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"

        value={password}

        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button onClick={handleUserSignup}>
        Signup
      </button>


      <h3>Login</h3>
      <input
        type="text"
        placeholder="Email"

        value={email}

        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"

        value={password}

        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button onClick={handleUserLogin}>
        Login
      </button>

      <PlayerForm
        player={player}
        setPlayer={setPlayer}
        onAnalyze={handleAnalyze}
      />

      {loading && <p>Analyzing player...</p>}
      {error && <p>{error}</p>}
      {results.length === 0 && (<p>No players analyzed yet</p>)}
      {results.length > 0 && (<ResultList results={results} onDelete={handleDelete} onUpdate={handleUpdate}/>)}
    </div>
  );
}

export default App;