import { useState } from "react";

function SignupForm({ onSignup }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit() {
        onSignup(email, password);
    }

    return (
        <div>
            <h2>Signup</h2>

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
                Signup
            </button>
        </div>
    );
}

export default SignupForm;