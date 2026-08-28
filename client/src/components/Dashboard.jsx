import PlayerForm from "./PlayerForm";
import PlayerSearch from "./PlayerSearch";
import ResultList from "./ResultList";

function Dashboard({
    onAnalyze,
    onSearch,
    results,
    onDelete,
    onUpdate,
    loading,
    error
}) {

    return (
        <main className="dashboard">


        <section className="analysis-section">

            <h2>Analyze Player</h2>

            <PlayerForm
                onAnalyze={onAnalyze}
            />

        </section>

        <section className="history-section">
           <h2>Player History</h2>

            <PlayerSearch
                onSearch={onSearch}
            />

            {loading && <p>Analyzing player...</p>}

            {error && <p>{error}</p>}

            {results.length === 0 && (
                <p>No players analyzed yet</p>
            )}

            {results.length > 0 && (
                <ResultList
                    results={results}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            )}
        </section>
        </main>
    );
}

export default Dashboard;