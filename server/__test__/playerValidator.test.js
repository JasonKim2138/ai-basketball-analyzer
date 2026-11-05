const {
  validatePlayer
} = require("../validators/playerValidator");

describe("validatePlayer", () => {

    test("should return no errors for valid player data", () => {

        const player = {
        name: "Jason",
        points: 30,
        assists: 8,
        rebounds: 10
        };

        const errors = validatePlayer(player);

        expect(errors).toEqual({});

    });

    test("should return errors for negative statistics", () => {

        const player = {
            name: "Jason",
            points: -10,
            assists: 8,
            rebounds: 10
        };

        const errors = validatePlayer(player);

        expect(errors.points).toBe(
            "Points must be a number greater than or equal to 0"
        );

    });

    test("should return an error for negative assists", () => {

        const player = {
            name: "Jason",
            points: 20,
            assists: -5,
            rebounds: 10
        };

        const errors = validatePlayer(player);

        expect(errors.assists).toBe(
            "Assists must be a number greater than or equal to 0"
        );

    });


    test("should return an error for negative rebounds", () => {

        const player = {
            name: "Jason",
            points: 20,
            assists: 5,
            rebounds: -3
        };

        const errors = validatePlayer(player);

        expect(errors.rebounds).toBe(
            "Rebounds must be a number greater than or equal to 0"
        );

    });

    test("should return errors when statistics are strings", () => {

        const player = {
            name: "Jason",
            points: "30",
            assists: "8",
            rebounds: "10"
        };

        const errors = validatePlayer(player);

        expect(errors.points).toBe(
            "Points must be a number greater than or equal to 0"
        );

        expect(errors.assists).toBe(
            "Assists must be a number greater than or equal to 0"
        );

        expect(errors.rebounds).toBe(
            "Rebounds must be a number greater than or equal to 0"
        );

    });

    test("should return an error when player name is empty", () => {

        const player = {
            name: "   ",
            points: 30,
            assists: 8,
            rebounds: 10
        };

        const errors = validatePlayer(player);

        expect(errors.name).toBe(
            "Player name is required"
        );

    });

    test("should accept zero for all statistics", () => {

        const player = {
            name: "Jason",
            points: 0,
            assists: 0,
            rebounds: 0
        };

        const errors = validatePlayer(player);

        expect(errors).toEqual({});

    });

    test("should reject NaN statistics", () => {

        const player = {
            name: "Jason",
            points: NaN,
            assists: 8,
            rebounds: 10
        };

        const errors = validatePlayer(player);

        expect(errors.points).toBe(
            "Points must be a number greater than or equal to 0"
        );

    });

});