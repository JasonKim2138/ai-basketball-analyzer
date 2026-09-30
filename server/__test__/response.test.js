const {
  successResponse,
  errorResponse
} = require("../utils/response");

function createResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
}

describe("successResponse", () => {

  test("should return success response with default status 200", () => {

    const res = createResponse();

    const data = {
      player: "Jason"
    };

    successResponse(res, data);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data
    });

  });


  test("should use a custom status code when provided", () => {

    const res = createResponse();

    successResponse(
      res,
      { player: "Jason" },
      201
    );

    expect(res.status).toHaveBeenCalledWith(201);

  });

});

describe("errorResponse", () => {

  test("should return an error response with default status 500", () => {

    const res = createResponse();

    errorResponse(
      res,
      "Something went wrong"
    );

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Something went wrong",
      errors: null
    });

  });


  test("should include validation errors when provided", () => {

    const res = createResponse();

    const errors = {
      points: "Points must be a number >= 0"
    };

    errorResponse(
      res,
      "Invalid player data",
      400,
      errors
    );

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid player data",
      errors
    });

  });

});