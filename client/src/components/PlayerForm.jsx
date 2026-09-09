import { useState } from "react";

function PlayerForm({ onAnalyze, loading }) {
    const [player, setPlayer] = useState({
        name: "",
        points: "",
        assists: "",
        rebounds: ""
    });

    const [error, setError] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;

        setPlayer({
            ...player,
            [name]: value
        });
    }

    function validatePlayer(player) {
        if (!player.name.trim()) {
            return "Player name is required.";
        }

        if (
            player.points === "" ||
            player.assists === "" ||
            player.rebounds === ""
        ) {
            return "Please enter all player stats.";
        }

        if (
            Number(player.points) < 0 ||
            Number(player.assists) < 0 ||
            Number(player.rebounds) < 0
        ) {
            return "Stats cannot be negative.";
        }

        return "";
    }

    function handleSubmit(e) {
        e.preventDefault();

        const validationError = validatePlayer(player);

        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");

        onAnalyze({
            ...player,
            points: Number(player.points),
            assists: Number(player.assists),
            rebounds: Number(player.rebounds)
        });
    }

    return (
        <form
            className="player-form-card"
            onSubmit={handleSubmit}
        >

            <h3>Analyze a Player</h3>

            <div className="form-group">
                <label>Player Name</label>

                <input
                    name="name"
                    type="text"
                    placeholder="e.g. Stephen Curry"
                    value={player.name}
                    onChange={handleChange}
                />
            </div>

            <div className="stats-grid">

                <div className="form-group">
                    <label>Points</label>

                    <input
                        name="points"
                        type="number"
                        placeholder="30"
                        value={player.points}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Assists</label>

                    <input
                        name="assists"
                        type="number"
                        placeholder="10"
                        value={player.assists}
                        onChange={handleChange}
                    />
                </div>

            </div>

            <div className="form-group">
                <label>Rebounds</label>

                <input
                    name="rebounds"
                    type="number"
                    placeholder="10"
                    value={player.rebounds}
                    onChange={handleChange}
                />
            </div>

            {error && (
                <p className="form-error">
                    {error}
                </p>
            )}

            <button
                type="submit"
                className="analyze-button"
                disabled={loading}
            >
                {loading ? "Analyzing..." : "Analyze Player 🏀"}
            </button>
            
        </form>
    );
}

export default PlayerForm;