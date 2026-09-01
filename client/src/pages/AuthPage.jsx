import AuthScreen from "../components/AuthScreen";

function AuthPage({ onLogin, onSignup, error }) {

    return (
        <main className="auth-page">

            <AuthScreen
                onLogin={onLogin}
                onSignup={onSignup}
                error={error}
            />

        </main>
    );
}

export default AuthPage;
