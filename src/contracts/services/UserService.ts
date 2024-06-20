import { UserData } from "../entities/User";

export interface IUserService {
  getUser(userId: string): Promise<UserData | undefined>;
}
