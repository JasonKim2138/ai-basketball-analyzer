import { apiRequest } from "./apiClient";

export async function userSignup(email, password) {

    const data = await apiRequest("/auth/signup", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })
    });

    return data.data;
}


export async function userLogin(email, password) {

    const data = await apiRequest("/auth/login", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })
    });

    return data.data;
}


export async function getCurrentUser() {

    const data = await apiRequest("/auth/me");

    return data.data;
}