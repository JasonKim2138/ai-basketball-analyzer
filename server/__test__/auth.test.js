const request = require("supertest");

const app = require("../app");

const User = require("../models/User");

const jwt = require("jsonwebtoken");

const { env } = require("../config/env");

jest.mock("../models/User");

describe("POST /auth/signup", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return 400 when email or password is missing", async () => {

        const response = await request(app)
        .post("/auth/signup")
        .send({
            email: "test@example.com"
        });

        expect(response.statusCode).toBe(400);

        expect(response.body.message).toBe(
        "Email and password are required"
        );

        expect(User.findOne).not.toHaveBeenCalled();

    });

    test("should return 400 when password is shorter than 8 characters", async () => {

        const response = await request(app)
            .post("/auth/signup")
            .send({
            email: "test@example.com",
            password: "1234567"
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.message).toBe(
            "Password must be at least 8 characters"
        );

        expect(User.findOne).not.toHaveBeenCalled();

    });

    test("should create a user when valid information is provided", async () => {

        User.findOne.mockResolvedValue(null);

        User.prototype.save = jest.fn().mockResolvedValue(undefined);

        const response = await request(app)
            .post("/auth/signup")
            .send({
            email: "test@example.com",
            password: "password123"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.data.message).toBe("User created");

        expect(User.findOne).toHaveBeenCalledWith({
            email: "test@example.com"
        });

        expect(User.prototype.save).toHaveBeenCalled();

        expect(User).toHaveBeenCalledWith({
        email: "test@example.com",
        password: expect.not.stringMatching(/^password123$/)
        });
    });

    test("should return 400 when email already exists", async () => {

        User.findOne.mockResolvedValue({
            email: "test@example.com"
        });

        const response = await request(app)
            .post("/auth/signup")
            .send({
            email: "test@example.com",
            password: "password123"
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.message).toBe(
            "User already exists"
        );

        expect(User.prototype.save).not.toHaveBeenCalled();

    });

});

describe("POST /auth/login", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return 401 when user does not exist", async () => {

        User.findOne.mockResolvedValue(null);

        const response = await request(app)
        .post("/auth/login")
        .send({
            email: "unknown@example.com",
            password: "password123"
        });

        expect(response.statusCode).toBe(401);

        expect(response.body.message).toBe(
        "Invalid email or password"
        );

    });

    test("should return 401 when password is incorrect", async () => {

        User.findOne.mockResolvedValue({
            email: "test@example.com",
            password: "hashedPassword"
        });

        const bcrypt = require("bcrypt");

        jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

        const response = await request(app)
            .post("/auth/login")
            .send({
            email: "test@example.com",
            password: "wrongPassword"
            });

        expect(response.statusCode).toBe(401);

        expect(response.body.message).toBe(
            "Invalid email or password"
        );

        expect(bcrypt.compare).toHaveBeenCalledWith(
            "wrongPassword",
            "hashedPassword"
        );

    });

    test("should return a JWT when login is successful", async () => {

        User.findOne.mockResolvedValue({
            _id: "user123",
            email: "test@example.com",
            password: "hashedPassword"
        });

        const bcrypt = require("bcrypt");

        jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

        const response = await request(app)
            .post("/auth/login")
            .send({
            email: "test@example.com",
            password: "password123"
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.data.message).toBe(
            "Login successful"
        );

        expect(response.body.data.token).toBeDefined();

        expect(typeof response.body.data.token).toBe("string");

        const decoded = jwt.verify(
            response.body.data.token,
            env.jwtSecret
        );

        expect(decoded.userId).toBe("user123");

        expect(decoded.exp).toBeDefined();
    });

});

describe("GET /auth/me", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should return 401 when token is missing", async () => {

        const response = await request(app)
        .get("/auth/me");

        expect(response.statusCode).toBe(401);

        expect(response.body.message).toBe(
        "No token provided"
        );

    });

    test("should return 401 when token is invalid", async () => {

        const response = await request(app)
            .get("/auth/me")
            .set("Authorization", "Bearer invalid.token.here");

        expect(response.statusCode).toBe(401);

        expect(response.body.message).toBe(
            "Invalid token"
        );

    });

    test("should return user information when token is valid", async () => {

        const jwt = require("jsonwebtoken");
        const { env } = require("../config/env");

        const token = jwt.sign(
            {
            userId: "user123"
            },
            env.jwtSecret,
            {
            expiresIn: "1d"
            }
        );

        User.findById.mockResolvedValue({
            _id: "user123",
            email: "test@example.com"
        });

        const response = await request(app)
            .get("/auth/me")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.data.email).toBe(
            "test@example.com"
        );

        expect(response.body.data._id).toBe("user123");

        expect(User.findById).toHaveBeenCalledWith("user123");

    });

    test("should return 404 when authenticated user no longer exists", async () => {

        const jwt = require("jsonwebtoken");
        const { env } = require("../config/env");

        const token = jwt.sign(
            {
            userId: "deletedUser123"
            },
            env.jwtSecret,
            {
            expiresIn: "1d"
            }
        );

        User.findById.mockResolvedValue(null);

        const response = await request(app)
            .get("/auth/me")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.message).toBe(
            "User not found"
        );

    });

    test("should return 401 when authorization scheme is not Bearer", async () => {

        const response = await request(app)
            .get("/auth/me")
            .set("Authorization", "Basic invalid.token.here");

        expect(response.statusCode).toBe(401);

        expect(response.body.message).toBe(
            "Invalid authorization format"
        );

    });

});