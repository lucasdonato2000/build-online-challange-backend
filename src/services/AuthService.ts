import bcrypt from "bcrypt";
import { IAuthService } from "../contracts";
import { UserRepository } from "../repositories";
import { generateToken } from "../utils/jwt";

export class AuthService implements IAuthService {
  constructor(private userRepository: UserRepository) {}

  async authenticateUser(
    email: string,
    password: string
  ): Promise<string | null> {
    try {
      const user = await this.userRepository.findUserByEmail(email);
      if (user && (await bcrypt.compare(password, user.password))) {
        return generateToken(user);
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
}
