import { apiRequest } from "./apiClient";

export async function userSignup(email, password) {

    return await apiRequest("/auth/signup", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })
    });
}

export async function userLogin(email, password) {

    return await apiRequest("/auth/login", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })
    });
}

export async function getCurrentUser() {

    return await apiRequest("/auth/me");
}