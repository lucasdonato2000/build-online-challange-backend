import { User, UserData } from "../entities/User";

export interface IUserRepository {
  findUserByEmail(email: string): Promise<User | undefined>;
  getUserById(userId: string): Promise<UserData | undefined>;
}
