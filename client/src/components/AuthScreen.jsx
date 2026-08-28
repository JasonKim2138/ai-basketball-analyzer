import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

function AuthScreen({
    onLogin,
    onSignup
}) {

    return (
        <main>

            <h2>Welcome to AI Basketball Analyzer</h2>

            <p>
                Analyze basketball players and keep track of your analysis history.
            </p>

            <section>
                <LoginForm onLogin={onLogin} />
            </section>

            <section>
                <SignupForm onSignup={onSignup} />
            </section>

        </main>
    );
}

export default AuthScreen;