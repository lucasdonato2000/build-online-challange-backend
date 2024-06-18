import { Database } from "sqlite";
import { Contact } from "../interfaces";
import { DatabaseError } from "../errors";

export class ContactModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getContactsByUserId(
    userId: string,
    limit: number,
    offset: number
  ): Promise<Contact[]> {
    try {
      return await this.db.all<Contact[]>(
        "SELECT * FROM contacts WHERE userId = ? LIMIT ? OFFSET ?",
        [userId, limit, offset]
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new DatabaseError(
          `Error fetching contacts for user ${userId}: ${error.message}`
        );
      } else {
        throw new DatabaseError(`Error fetching contacts for user ${userId}`);
      }
    }
  }

  async getContactById(
    userId: string,
    contactId: string
  ): Promise<Contact | undefined> {
    try {
      return await this.db.get<Contact>(
        "SELECT * FROM contacts WHERE id = ? AND userId = ?",
        [contactId, userId]
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new DatabaseError(
          `Error fetching contact ${contactId} for user ${userId}: ${error.message}`
        );
      } else {
        throw new DatabaseError(
          `Error fetching contact ${contactId} for user ${userId}`
        );
      }
    }
  }

  async addContact(contact: Contact): Promise<void> {
    try {
      await this.db.run(
        "INSERT INTO contacts (id, userId, name, email, phone, address, profilePicture) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          contact.id,
          contact.userId,
          contact.name,
          contact.email,
          contact.phone,
          contact.address,
          contact.profilePicture,
        ]
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new DatabaseError(
          `Error adding contact for user ${contact.userId}: ${error.message}`
        );
      } else {
        throw new DatabaseError(
          `Error adding contact for user ${contact.userId}`
        );
      }
    }
  }

  async updateContact(
    userId: string,
    contactId: string,
    setClause: string,
    values: (string | number | undefined)[]
  ): Promise<void> {
    try {
      const query = `UPDATE contacts SET ${setClause} WHERE id = ? AND userId = ?`;
      await this.db.run(query, values);
    } catch (error) {
      if (error instanceof Error) {
        throw new DatabaseError(
          `Error updating contact ${contactId} for user ${userId}: ${error.message}`
        );
      } else {
        throw new DatabaseError(
          `Error updating contact ${contactId} for user ${userId}`
        );
      }
    }
  }
}
