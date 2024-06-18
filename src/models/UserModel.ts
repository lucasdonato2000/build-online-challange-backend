import { Database } from "sqlite";
import { User } from "../interfaces";
import { DatabaseError } from "../errors/DatabaseError";

export class UserModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      return await this.db.get<User>("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
    } catch (error) {
      if (error instanceof Error) {
        throw new DatabaseError(
          `Error fetching user with email ${email}: ${error.message}`
        );
      } else {
        throw new DatabaseError(`Error fetching user with email ${email}`);
      }
    }
  }

  async getById(userId: string): Promise<Omit<User, "password"> | undefined> {
    try {
      return await this.db.get<Omit<User, "password">>(
        "SELECT id, email FROM users WHERE id = ?",
        [userId]
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new DatabaseError(
          `Error fetching user with id ${userId}: ${error.message}`
        );
      } else {
        throw new DatabaseError(`Error fetching user with id ${userId}`);
      }
    }
  }
}
