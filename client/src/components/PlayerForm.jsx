import { useState } from "react";

function PlayerForm({ onAnalyze, loading }) {
    const [player, setPlayer] = useState({
        name: "",
        points: "",
        assists: "",
        rebounds: ""
    });

    return (
        <div className="player-form-card">

            <h3>Analyze a Player</h3>

            <div className="form-group">
                <label>Player Name</label>

                <input
                    placeholder="e.g. Stephen Curry"
                    value={player.name}
                    onChange={(e) =>
                        setPlayer({
                            ...player,
                            name: e.target.value
                        })
                    }
                />
            </div>

            <div className="stats-grid">

                <div className="form-group">
                    <label>Points</label>

                    <input
                        type="number"
                        placeholder="30"
                        value={player.points}
                        onChange={(e) =>
                            setPlayer({
                                ...player,
                                points: e.target.value
                            })
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Assists</label>

                    <input
                        type="number"
                        placeholder="10"
                        value={player.assists}
                        onChange={(e) =>
                            setPlayer({
                                ...player,
                                assists: e.target.value
                            })
                        }
                    />
                </div>

            </div>

            <div className="form-group">
                <label>Rebounds</label>

                <input
                    type="number"
                    placeholder="10"
                    value={player.rebounds}
                    onChange={(e) =>
                        setPlayer({
                            ...player,
                            rebounds: e.target.value
                        })
                    }
                />
            </div>

            <button
                className="analyze-button"
                onClick={() => onAnalyze(player)}
                disabled={loading}
            >
                {loading ? "Analyzing..." : "Analyze Player 🏀"}
            </button>

        </div>
    );
}

export default PlayerForm;