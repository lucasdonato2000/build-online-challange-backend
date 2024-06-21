import { AuthService } from "../../services";
import { UserRepository } from "../../repositories";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt";

jest.mock("../../repositories");
jest.mock("bcrypt");
jest.mock("../../utils/jwt");

const mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockGenerateToken = generateToken as jest.MockedFunction<
  typeof generateToken
>;

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService(mockUserRepository);
  });

  it("should return a token for valid credentials", async () => {
    const user = {
      id: "1",
      email: "test@example.com",
      password: "hashedpassword",
    };
    mockUserRepository.findUserByEmail.mockResolvedValue(user);
    mockBcrypt.compare.mockResolvedValue(true as never);
    mockGenerateToken.mockReturnValue("fake-jwt-token" as never);

    const token = await authService.authenticateUser(
      "test@example.com",
      "password123"
    );

    expect(token).toBe("fake-jwt-token");
    expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(
      "test@example.com"
    );
    expect(mockBcrypt.compare).toHaveBeenCalledWith(
      "password123",
      "hashedpassword"
    );
    expect(mockGenerateToken).toHaveBeenCalledWith(user);
  });

  it("should return null for non-existing user credentials", async () => {
    mockUserRepository.findUserByEmail.mockResolvedValue(undefined);

    const token = await authService.authenticateUser(
      "invalid@example.com",
      "invalidpassword"
    );

    expect(token).toBeNull();
    expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(
      "invalid@example.com"
    );
    expect(mockBcrypt.compare).not.toHaveBeenCalled();
    expect(mockGenerateToken).not.toHaveBeenCalled();
  });

  it("should return null if password does not match", async () => {
    const user = {
      id: "1",
      email: "test@example.com",
      password: "hashedpassword",
    };
    mockUserRepository.findUserByEmail.mockResolvedValue(user);
    mockBcrypt.compare.mockResolvedValue(false as never);

    const token = await authService.authenticateUser(
      "test@example.com",
      "wrongpassword"
    );

    expect(token).toBeNull();
    expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(
      "test@example.com"
    );
    expect(mockBcrypt.compare).toHaveBeenCalledWith(
      "wrongpassword",
      "hashedpassword"
    );
    expect(mockGenerateToken).not.toHaveBeenCalled();
  });

  it("should throw an error if findUserByEmail service fails", async () => {
    const error = new Error("Database error");
    mockUserRepository.findUserByEmail.mockRejectedValue(error);

    await expect(
      authService.authenticateUser("test@example.com", "password123")
    ).rejects.toThrow("Database error");
    expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(
      "test@example.com"
    );
    expect(mockBcrypt.compare).not.toHaveBeenCalled();
    expect(mockGenerateToken).not.toHaveBeenCalled();
  });
});
