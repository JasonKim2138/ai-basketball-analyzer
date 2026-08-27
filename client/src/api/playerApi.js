import { apiRequest } from "./apiClient";

export async function analyzePlayer(player) {

    return await apiRequest("/player", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            ...player,
            points: Number(player.points),
            assists: Number(player.assists),
            rebounds: Number(player.rebounds)
        })
    });
}

export async function loadPlayers() {
    return await apiRequest("/player");
}

export async function deleteAnalysis(id) {

    return await apiRequest(`/player/${id}`, {
        method: "DELETE"
    });
}

export async function updatePlayer(id, updatedData) {

    return await apiRequest(`/player/${id}`, {
        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(updatedData)
    });
}

export async function searchPlayers(name, grade) {

    const params = new URLSearchParams();

    if (name) {
        params.append("name", name);
    }

    if (grade) {
        params.append("grade", grade);
    }

    return await apiRequest(`/player?${params.toString()}`);
}