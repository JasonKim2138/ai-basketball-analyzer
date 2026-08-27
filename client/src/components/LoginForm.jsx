import { useState } from "react";

function LoginForm({ onLogin }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit() {
        onLogin(email, password);
    }

    return (
        <div>
            <h3>Login</h3>

            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />

            <button onClick={handleSubmit}>
                Login
            </button>
        </div>
    );
}

export default LoginForm;