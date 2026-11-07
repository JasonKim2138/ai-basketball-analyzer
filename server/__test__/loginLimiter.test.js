const request = require("supertest");

const app = require("../app");

describe("POST /auth/login rate limiting", () => {

    test("should block requests after 5 attempts", async () => {

        for (let i = 0; i < 5; i++) {

        const response = await request(app)
            .post("/auth/login")
            .send({});

        expect(response.statusCode).toBe(400);

        }

        const response = await request(app)
        .post("/auth/login")
        .send({});

        expect(response.statusCode).toBe(429);

        expect(response.body.message).toBe(
        "Too many login attempts. Please try again later."
        );

    });

});