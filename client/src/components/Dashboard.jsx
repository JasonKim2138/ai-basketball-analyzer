import PlayerForm from "./PlayerForm";
import PlayerSearch from "./PlayerSearch";
import ResultList from "./ResultList";
import EmptyState from "./EmptyState";

function Dashboard({
    onAnalyze,
    onSearch,
    results,
    onDelete,
    onUpdate,
    loading,
    error,
    success
}) {

    return (
        <main className="dashboard">


        <section className="analysis-section">

            <h2>Analyze Player</h2>

            <PlayerForm
                onAnalyze={onAnalyze}
                loading={loading}
            />

        </section>

        <section className="history-section">
           <h2>Player History</h2>

            <PlayerSearch
                onSearch={onSearch}
            />

            {loading && <p>Analyzing player...</p>}

            {success && (
                <p className="success-message">
                    {success}
                </p>
            )}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {results.length === 0 && (
                <EmptyState />
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