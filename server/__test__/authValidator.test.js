
const {
  validateSignup,
  validateLogin
} = require("../validators/authValidator");


describe("validateSignup", () => {

    test("should accept valid signup data", () => {

        const errors = validateSignup({
        email: "jason@example.com",
        password: "password123"
        });

        expect(errors).toEqual({});
    });


    test("should reject an email that is not a string", () => {

        const errors = validateSignup({
        email: { $ne: null },
        password: "password123"
        });

        expect(errors.email).toBeDefined();
    });


    test("should reject a password shorter than 8 characters", () => {

        const errors = validateSignup({
        email: "jason@example.com",
        password: "123"
        });

        expect(errors.password).toBeDefined();
    });

    });


    describe("validateLogin", () => {

    test("should accept valid login data", () => {

        const errors = validateLogin({
        email: "jason@example.com",
        password: "password123"
        });

        expect(errors).toEqual({});
    });


    test("should reject an object as password", () => {

        const errors = validateLogin({
        email: "jason@example.com",
        password: { $ne: null }
        });

        expect(errors.password).toBeDefined();
    });

});
