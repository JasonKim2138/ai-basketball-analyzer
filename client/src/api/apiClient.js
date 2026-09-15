const BASE_URL = "http://localhost:3000";

export async function apiRequest(endpoint, options = {}) {

    const token = localStorage.getItem("token");

    const headers = {
        ...options.headers
    };

    if (token) {
        headers.authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    const data = await res.json();

    if (!res.ok) {
        const error = new Error(
            data.message || "Request failed"
        );

        error.status = res.status;
        error.errors = data.errors || null;

        throw error;
    }

    return data;
}