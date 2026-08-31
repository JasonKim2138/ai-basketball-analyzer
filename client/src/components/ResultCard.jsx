import { useState } from "react";

function ResultCard({ result, onDelete, onUpdate }) {

    const [editing, setEditing] = useState(false);

    const [editedPlayer, setEditedPlayer] = useState({
        name: result?.player?.name || "",
        points: result?.player?.points || "",
        assists: result?.player?.assists || "",
        rebounds: result?.player?.rebounds || ""
    });

    function handleChange(e) {
        setEditedPlayer({
            ...editedPlayer,
            [e.target.name]: e.target.value
        });
    }

    async function handleSave() {

        const success = await onUpdate(result._id, {
            name: editedPlayer.name,
            points: Number(editedPlayer.points),
            assists: Number(editedPlayer.assists),
            rebounds: Number(editedPlayer.rebounds)
        });

        if (success) {
            setEditing(false);
        }
    }

    function handleCancel() {
        setEditedPlayer({
            name: result?.player?.name || "",
            points: result?.player?.points || "",
            assists: result?.player?.assists || "",
            rebounds: result?.player?.rebounds || ""
        });

        setEditing(false);
    }

    return (
        <div className="result-card">

            {editing ? (

                <>
                    <h3>Edit Player</h3>

                    <div className="edit-form">

                        <input
                            name="name"
                            type="text"
                            value={editedPlayer.name}
                            onChange={handleChange}
                            placeholder="Player name"
                        />

                        <input
                            name="points"
                            type="number"
                            value={editedPlayer.points}
                            onChange={handleChange}
                            placeholder="Points"
                        />

                        <input
                            name="assists"
                            type="number"
                            value={editedPlayer.assists}
                            onChange={handleChange}
                            placeholder="Assists"
                        />

                        <input
                            name="rebounds"
                            type="number"
                            value={editedPlayer.rebounds}
                            onChange={handleChange}
                            placeholder="Rebounds"
                        />

                    </div>

                    <div className="result-actions">

                        <button onClick={handleCancel}>
                            Cancel
                        </button>

                        <button onClick={handleSave}>
                            Save
                        </button>

                    </div>
                </>

            ) : (

                <>
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
                            <strong>
                                {result?.player?.points}
                            </strong>
                        </div>

                        <div className="stat">
                            <span>Assists</span>
                            <strong>
                                {result?.player?.assists}
                            </strong>
                        </div>

                        <div className="stat">
                            <span>Rebounds</span>
                            <strong>
                                {result?.player?.rebounds}
                            </strong>
                        </div>

                    </div>

                    <div className="analysis">

                        <p>
                            <strong>Status:</strong>{" "}
                            {result?.starter}
                        </p>

                        <p>
                            <strong>Analysis:</strong>{" "}
                            {result?.message}
                        </p>

                    </div>

                    <div className="result-actions">

                        <button
                            onClick={() => setEditing(true)}
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => onDelete(result._id)}
                        >
                            Delete
                        </button>

                    </div>
                </>

            )}

        </div>
    );
}

export default ResultCard;
