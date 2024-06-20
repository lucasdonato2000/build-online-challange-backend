import { User } from "../entities/User";

export interface IUserModel {
  findByEmail(email: string): Promise<User | undefined>;
  getById(userId: string): Promise<Omit<User, "password"> | undefined>;
}
