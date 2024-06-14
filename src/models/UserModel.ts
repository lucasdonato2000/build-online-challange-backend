import { Database } from "sqlite";
import { User } from "../interfaces";

class UserModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.db.get<User>("SELECT * FROM users WHERE email = ?", [email]);
  }

  async getById(userId: string): Promise<Omit<User, "password"> | undefined> {
    return this.db.get<Omit<User, "password">>(
      "SELECT id, email FROM users WHERE id = ?",
      [userId]
    );
  }
}

export default UserModel;
