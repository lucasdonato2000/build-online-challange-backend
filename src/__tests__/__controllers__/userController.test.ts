import { Request, Response, NextFunction } from "express";
import { UserController } from "../../controllers/UserController";

import { mockUserService } from "../../__mocks__/services";

jest.mock("../../services/UserService", () => {
  return {
    UserService: jest.fn().mockImplementation(() => mockUserService),
  };
});

let userController: UserController;
let req: Partial<Request>;
let res: Partial<Response>;
let next: NextFunction;

beforeEach(() => {
  userController = new UserController(mockUserService as any);
  req = {};
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  next = jest.fn();
});

describe("UserController", () => {
  it("should return 401 if user is not authenticated", async () => {
    req.user = null;

    await userController.getUserHandler(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });

  it("should call next with error if getUser service throws an error", async () => {
    req.user = { id: "1" };
    const error = new Error("Database error");
    mockUserService.getUser.mockRejectedValue(error);

    await userController.getUserHandler(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should return user details for authenticated user", async () => {
    req.user = { id: "1" };
    mockUserService.getUser.mockResolvedValue({
      id: "1",
      email: "test@example.com",
    });

    await userController.getUserHandler(req as Request, res as Response, next);

    expect(res.json).toHaveBeenCalledWith({
      id: "1",
      email: "test@example.com",
    });
  });
});
