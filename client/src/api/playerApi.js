import { apiRequest } from "./apiClient";

export async function analyzePlayer(player) {

    const data = await apiRequest("/player", {
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

    return data.data;
}

export async function loadPlayers() {
    const data = await apiRequest("/player");

    return data.data;
}

export async function deleteAnalysis(id) {

    const data = await apiRequest(`/player/${id}`, {
        method: "DELETE"
    });

    return data.data;
}

export async function updatePlayer(id, updatedData) {

    const data = await apiRequest(`/player/${id}`, {
        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(updatedData)
    });

    return data.data;
}

export async function searchPlayers(name, grade) {

    const params = new URLSearchParams();

    if (name) {
        params.append("name", name);
    }

    if (grade) {
        params.append("grade", grade);
    }

    const data = await apiRequest(`/player?${params.toString()}`);

    return data.data;
}