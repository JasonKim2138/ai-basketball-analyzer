function ResultCard({ result, onDelete, onUpdate }){
    return (
        <div style={{
            border: "1px solid white",
            padding: "10px",
            marginBottom: "10px"
        }}>
            <h2>{result?.player?.name}</h2>
            <p>{result?.player?.points}</p>
            <p>{result?.player?.assists}</p>
            <p>{result?.player?.rebounds}</p>
            <p>{result?.starter}</p>
            <p>{result?.grade}</p>
            <p>{result?.message}</p>
            <button onClick={() => onDelete(result._id)}> Delete </button>
            <button onClick={() => onUpdate(result._id)}> Update </button>
        </div>
    )
}

export default ResultCard;