import PlayerForm from "../components/PlayerForm";

function DashboardPage({ onAnalyze, loading, success }) {
    return (
        <main>
            <h2>Analyze Player</h2>

            <PlayerForm
                onAnalyze={onAnalyze}
                loading={loading}
            />

            {success && (
                <p className="success-message">
                    {success}
                </p>
            )}
        </main>
    );
}

export default DashboardPage;