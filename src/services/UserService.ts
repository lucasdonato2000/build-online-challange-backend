import { IUserService, UserData } from "../contracts";
import { UserRepository } from "../repositories";

export class UserService implements IUserService {
  constructor(private userRepository: UserRepository) {}

  async getUser(userId: string): Promise<UserData | undefined> {
    try {
      return await this.userRepository.getUserById(userId);
    } catch (error) {
      throw error;
    }
  }
}
