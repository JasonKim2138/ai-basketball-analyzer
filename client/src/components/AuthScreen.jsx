import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

function AuthScreen({
    onLogin,
    onSignup,
    error
}) {

    const [mode, setMode] = useState("login");

    return (
        <main>

            <h2>Welcome to AI Basketball Analyzer</h2>

            <p>
                Analyze basketball players and keep track of your analysis history.
            </p>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {mode === "login" ? (
                <section>
                    <LoginForm onLogin={onLogin} />

                    <p>
                        Don't have an account?
                    </p>

                    <button onClick={() => setMode("signup")}>
                        Sign Up
                    </button>
                </section>
            ) : (
                <section>
                    <SignupForm onSignup={onSignup} />

                    <p>
                        Already have an account?
                    </p>

                    <button onClick={() => setMode("login")}>
                        Login
                    </button>
                </section>
            )}

        </main>
    );
}

export default AuthScreen;