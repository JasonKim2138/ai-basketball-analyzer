import { useState } from "react";

function ResultCard({ result, onDelete, onUpdate }) {
    return (
        <div className="result-card">

            <div className="result-header">
                <div>
                    <h3>{result?.player?.name}</h3>
                    <p>Player Analysis</p>
                </div>

                <div className="grade">
                    {result?.grade}
                </div>
            </div>

            <div className="stats-grid">

                <div className="stat">
                    <span>Points</span>
                    <strong>{result?.player?.points}</strong>
                </div>

                <div className="stat">
                    <span>Assists</span>
                    <strong>{result?.player?.assists}</strong>
                </div>

                <div className="stat">
                    <span>Rebounds</span>
                    <strong>{result?.player?.rebounds}</strong>
                </div>

            </div>

            <div className="analysis">

                <p>
                    <strong>Status:</strong> {result?.starter}
                </p>

                <p>
                    <strong>Analysis:</strong> {result?.message}
                </p>

            </div>

            <div className="result-actions">

                <button
                    onClick={() => onUpdate(result._id)}
                >
                    Update
                </button>

                <button
                    onClick={() => onDelete(result._id)}
                >
                    Delete
                </button>

            </div>

        </div>
    );
}

export default ResultCard;