import { useState } from "react";
import { analyzePlayer, 
         loadPlayers,
         deleteAnalysis,
         updatePlayer,
         searchPlayers
} from "../api/playerApi";

function usePlayers() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function analyze(player) {
        setLoading(true);
        setError("");

        try {
            const data = await analyzePlayer(player);

            setResults([...results, data]);

            return data;

        } catch (error) {
            setError(error.message);
            throw error;

        } finally {
            setLoading(false);
        }
    }

    async function loadHistory() {
        try {
            setError("");

            const data = await loadPlayers();

            setResults(data);

        } catch (error) {
            setError(error.message);
        }
    }

    async function deletePlayer(id) {
        try {
            setError("");

            await deleteAnalysis(id);

            await loadHistory();

        } catch (error) {
            setError(error.message);
            throw error;
        }
    }

    async function updatePlayerData(id, updatedData) {
        try {
            setError("");

            await updatePlayer(id, updatedData);

            await loadHistory();

        } catch (error) {
            setError(error.message);
            throw error;
        }
    }

    async function search(searchName, gradeFilter) {
        try {
            setError("");

            const data = await searchPlayers(
                searchName,
                gradeFilter
            );

            setResults(data);
            
        } catch (error) {
            setError(error.message);
            throw error;
        }
    }

    return {
        results,
        loading,
        error,
        analyze,
        loadHistory,
        deletePlayer,
        updatePlayerData,
        search
    };
}

export default usePlayers;