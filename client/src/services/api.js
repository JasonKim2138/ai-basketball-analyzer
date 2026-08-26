export async function analyzePlayer(player) {

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/player`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            //name: player.name,
            ...player,
            points: Number(player.points),
            assists: Number(player.assists),
            rebounds: Number(player.rebounds)
        })
        });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
};

export async function loadPlayers() {

    const token = localStorage.getItem("token");

    console.log("token ", token);

    const res = await fetch("http://localhost:3000/player", {

        headers: {
            authorization: `Bearer ${token}`
        }

    });

    return await res.json();

}

export async function deleteAnalysis(id) {

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/player/${id}`, 
        {
            method: "DELETE",

            headers: {
            authorization: `Bearer ${token}`
            }

        });
    return await res.json();
};

export async function updatePlayer(id, updatedData) {

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/player/${id}`, 
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`
            },

            body: JSON.stringify(updatedData)
        }
    );

    return await res.json();
}

export async function searchPlayers(name, grade) {

    const params = new URLSearchParams();

    if (name) {
        params.append("name", name);
    }

    if (grade) {
        params.append("grade", grade);
    }

    const token = localStorage.getItem("token");

    const res = await fetch(
        `http://localhost:3000/player?${params.toString()}`,
        {
            headers: {
                authorization: `Bearer ${token}`
            }
        }
    );

    return await res.json();
}

export async function userSignup(email, password) {
    const res = await fetch(`http://localhost:3000/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    if (!res.ok) {
        throw new Error("Sign up failed");
    }
    
    return await res.json();
}

export async function userLogin(email, password) {
    const res = await fetch(`http://localhost:3000/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });
    if (!res.ok) {
        throw new Error("Login failed");
    }

    return await res.json();
}

export async function getCurrentUser() {

    const token = localStorage.getItem("token");

    const res = await fetch(
        "http://localhost:3000/auth/me",
        {
            headers: {
                authorization: `Bearer ${token}`
            }
        }
    );

    if (!res.ok) {
        throw new Error(res.message);
    }

    return await res.json();
}