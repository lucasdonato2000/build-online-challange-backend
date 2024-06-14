import UserModel from "../models/UserModel";
import { User, UserData } from "../interfaces";
import openDB from "../db/database";

export class UserRepository {
  private userModel: UserModel | null = null;

  constructor() {
    openDB().then((db) => {
      this.userModel = new UserModel(db);
    });
  }

  private async getUserModel(): Promise<UserModel> {
    if (!this.userModel) {
      const db = await openDB();
      this.userModel = new UserModel(db);
    }
    return this.userModel;
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    const userModel = await this.getUserModel();
    return await userModel.findByEmail(email);
  }

  async getUserById(userId: string): Promise<UserData | undefined> {
    const userModel = await this.getUserModel();
    return await userModel.getById(userId);
  }
}
