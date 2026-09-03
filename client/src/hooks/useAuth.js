import { useState, useEffect } from "react";
import {
    userSignup,
    userLogin,
    getCurrentUser
} from "../api/authApi";

function useAuth() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function restoreUser() {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        restoreUser();
    }, []);

    async function login(email, password) {
        try {
            setLoading(true);
            setError(null);

            const data = await userLogin(email, password);

            localStorage.setItem("token", data.token);

            const currentUser = await getCurrentUser();

            setUser(currentUser);

            return data;

        } catch (error) {
            setError(error.message);
            throw error;

        } finally {
            setLoading(false);
        }
    }

  async function signup(email, password) {
    if (!email || !password) {
        setError("Please fill everything out");
        return;
    }
    try {
      const data = await userSignup (email, password);

      alert(data.message);

    } catch (error) {
      
      alert(error.message);

    }
  }

    function logout() {
        localStorage.removeItem("token");
        setUser(null);
    }

    return {
        user,
        loading,
        error,
        login,
        signup,
        logout
    };
}

export default useAuth;