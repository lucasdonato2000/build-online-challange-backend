import { UserModel } from "../models/UserModel";
import { IUserRepository, User, UserData } from "../contracts";
import openDB from "../db/database";

export class UserRepository implements IUserRepository {
  private userModel: UserModel | null = null;

  constructor() {
    openDB().then((db) => {
      this.userModel = new UserModel(db);
    });
  }

  private async getUserModel(): Promise<UserModel> {
    if (!this.userModel) {
      try {
        const db = await openDB();
        this.userModel = new UserModel(db);
      } catch (error) {
        throw error;
      }
    }
    return this.userModel;
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    try {
      const userModel = await this.getUserModel();
      return await userModel.findByEmail(email);
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId: string): Promise<UserData | undefined> {
    try {
      const userModel = await this.getUserModel();
      return await userModel.getById(userId);
    } catch (error) {
      throw error;
    }
  }
}
