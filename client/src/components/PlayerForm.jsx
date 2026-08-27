import { useState } from "react";

function PlayerForm({ onAnalyze }) {

    const [player, setPlayer] = useState({
        name: "",
        points: "",
        assists: "",
        rebounds: ""
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
                placeholder="Name"
                value={player.name}
                onChange={(e) =>
                    setPlayer({
                        ...player,
                        name: e.target.value
                    })
                }
            />

            <input
                placeholder="Points"
                value={player.points}
                onChange={(e) =>
                    setPlayer({
                        ...player,
                        points: e.target.value
                    })
                }
            />

            <input
                placeholder="Assists"
                value={player.assists}
                onChange={(e) =>
                    setPlayer({
                        ...player,
                        assists: e.target.value
                    })
                }
            />

            <input
                placeholder="Rebounds"
                value={player.rebounds}
                onChange={(e) =>
                    setPlayer({
                        ...player,
                        rebounds: e.target.value
                    })
                }
            />

            <button onClick={() => onAnalyze(player)}>
                Analyze
            </button>
            
        </div>
  );
}

export default PlayerForm;