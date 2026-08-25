import { useState } from "react";

function ResultCard({ result, onDelete, onUpdate }) {

  const [name, setName] = useState(result?.player?.name || "");
  const [points, setPoints] = useState(result?.player?.points || 0);
  const [assists, setAssists] = useState(result?.player?.assists || 0);
  const [rebounds, setRebounds] = useState(result?.player?.rebounds || 0);

  function handleSave() {
    onUpdate(result._id, {
      name,
      points: Number(points),
      assists: Number(assists),
      rebounds: Number(rebounds)
    });
  }

  return (
    <div style={{
      border: "1px solid white",
      padding: "10px",
      marginBottom: "10px"
    }}>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        value={points}
        onChange={(e) => setPoints(e.target.value)}
      />

      <input
        type="number"
        value={assists}
        onChange={(e) => setAssists(e.target.value)}
      />

      <input
        type="number"
        value={rebounds}
        onChange={(e) => setRebounds(e.target.value)}
      />

      <p>Starter: {result?.starter}</p>
      <p>Grade: {result?.grade}</p>
      <p>Message: {result?.message}</p>

      <button onClick={handleSave}>
        Save Changes
      </button>

      <button onClick={() => onDelete(result._id)}>
        Delete
      </button>

    </div>
  );
}

export default ResultCard;