import { Request, Response, NextFunction } from "express";
import { AuthController } from "../../controllers/AuthController";
import { AuthService } from "../../services/AuthService";
import { UnauthorizedError } from "../../errors";
import { UserRepository } from "../../repositories";

jest.mock("../../services/AuthService");

let mockUserRepository: jest.Mocked<UserRepository>;
let mockAuthService: jest.Mocked<AuthService>;
let authController: AuthController;
let req: Partial<Request>;
let res: Partial<Response>;
let next: NextFunction;

beforeEach(() => {
  mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
  mockAuthService = new AuthService(
    mockUserRepository
  ) as jest.Mocked<AuthService>;
  authController = new AuthController(mockAuthService);
  req = {};
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  next = jest.fn();
});

describe("AuthController", () => {
  it("should return a token when provided with valid credentials", async () => {
    req.body = { email: "test@example.com", password: "password123" };
    mockAuthService.authenticateUser.mockResolvedValue("fake-jwt-token");

    await authController.loginHandler(req as Request, res as Response, next);

    expect(res.json).toHaveBeenCalledWith({ token: "fake-jwt-token" });
  });

  it("should call next with UnauthorizedError when provided with invalid credentials", async () => {
    req.body = { email: "wrong@example.com", password: "wrongpassword" };
    mockAuthService.authenticateUser.mockResolvedValue(null);

    await authController.loginHandler(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      new UnauthorizedError("Invalid credentials")
    );
  });

  it("should call next with error when an exception occurs", async () => {
    req.body = { email: "test@example.com", password: "password123" };
    const error = new Error("Database error");
    mockAuthService.authenticateUser.mockRejectedValue(error);

    await authController.loginHandler(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
