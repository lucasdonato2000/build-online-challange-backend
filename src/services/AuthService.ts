import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/UserRespository";
import { generateToken } from "../utils/jwt";

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async authenticateUser(
    email: string,
    password: string
  ): Promise<string | null> {
    const user = await this.userRepository.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return generateToken(user);
    } else {
      return null;
    }
  }
}
