export async function analyzePlayer(player) {

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/analyze`, {
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
        
        return await res.json();
};

export async function loadPlayers() {

    const token = localStorage.getItem("token");

    console.log("token ", token);

    const res = await fetch("http://localhost:3000/history", {

        headers: {
            authorization: `Bearer ${token}`
        }

    });

    return await res.json();

}

export async function deleteAnalysis(id) {
    const res = await fetch(`http://localhost:3000/history/${id}`, 
        {
            method: "DELETE"
        });
    return await res.json();
};

export async function updateAnalysis(id, updatedData) {
    const res = await fetch(`http://localhost:3000/history/${id}`, 
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(updatedData)
        }
    );

    return await res.json();
}

export async function searchPlayers(name, grade) {

    const query = `grade=${encodeURIComponent(grade)}&name=${encodeURIComponent(name)}`;

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/players?${query}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

    return await res.json();

}

export async function userSignup(email, password) {
    const res = await fetch(`http://localhost:3000/signup`, {
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
    const res = await fetch(`http://localhost:3000/login`, {
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
        "http://localhost:3000/me",
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