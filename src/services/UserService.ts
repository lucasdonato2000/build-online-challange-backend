import { User, UserData } from "../interfaces";
import { UserRepository } from "../repositories/UserRespository";
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUser(userId: string): Promise<UserData | undefined> {
    return await this.userRepository.getUserById(userId);
  }
}
