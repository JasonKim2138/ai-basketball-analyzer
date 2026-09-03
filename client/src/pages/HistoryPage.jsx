import PlayerSearch from "../components/PlayerSearch";
import ResultList from "../components/ResultList";
import EmptyState from "../components/EmptyState";

function HistoryPage({
    results,
    onSearch,
    onDelete,
    onUpdate,
    loading,
    error,
    success
}) {
    return (
        <main>

            <h2>Player History</h2>

            <PlayerSearch
                onSearch={onSearch}
            />

            {loading && (
                <p>Loading...</p>
            )}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {success && (
                <p className="success-message">
                    {success}
                </p>
            )}

            {results.length === 0 ? (
                <EmptyState />
            ) : (
                <ResultList
                    results={results}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            )}

        </main>
    );
}

export default HistoryPage;