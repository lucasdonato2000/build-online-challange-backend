import { UserService } from "../../services/UserService";
import { UserRepository } from "../../repositories";
import { UserData } from "../../contracts";

jest.mock("../../repositories");

const mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;

const userId = "test-user-id";
const userData: UserData = {
  id: userId,
  email: "test@example.com",
};

let userService: UserService;

beforeEach(() => {
  userService = new UserService(mockUserRepository);
});

describe("UserService", () => {
  it("should handle repository errors when getting user by ID", async () => {
    const error = new Error("Database error");
    mockUserRepository.getUserById.mockRejectedValueOnce(error);

    await expect(userService.getUser(userId)).rejects.toThrow("Database error");
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith(userId);
  });

  it("should successfully get user by ID", async () => {
    mockUserRepository.getUserById.mockResolvedValueOnce(userData);

    const result = await userService.getUser(userId);

    expect(result).toEqual(userData);
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith(userId);
  });

  it("should return undefined if user is not found", async () => {
    mockUserRepository.getUserById.mockResolvedValueOnce(undefined);

    const result = await userService.getUser(userId);

    expect(result).toBeUndefined();
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith(userId);
  });
});
