import PlayerForm from "../components/PlayerForm";

function DashboardPage({ onAnalyze, loading }) {
    return (
        <main>
            <h2>Analyze Player</h2>

            <PlayerForm
                onAnalyze={onAnalyze}
                loading={loading}
            />
        </main>
    );
}

export default DashboardPage;