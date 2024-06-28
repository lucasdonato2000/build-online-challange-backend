import { Database } from "sqlite";
import { Contact } from "../contracts";
import { IContactModel } from "../contracts";
import { DatabaseError } from "../errors";

export class ContactModel implements IContactModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getContactsByUserId(
    userId: string,
    limit: number,
    offset: number,
    searchTerm: string
  ): Promise<{ total: number; contacts: Contact[] }> {
    try {
      const contacts = await this.db.all<Contact[]>(
        `SELECT * FROM contacts WHERE userId = ? AND name LIKE ? LIMIT ? OFFSET ?`,
        [userId, `%${searchTerm}%`, limit, offset]
      );
      const total = await this.db.get<{ count: number }>(
        `SELECT COUNT(*) as count FROM contacts WHERE userId = ? AND name LIKE ?`,
        [userId, `%${searchTerm}%`]
      );
      return { total: total?.count ?? 0, contacts };
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
        "INSERT INTO contacts (id, userId, name, email, phone, address, title ,profilePicture, updatedAt, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          contact.id,
          contact.userId,
          contact.name,
          contact.email,
          contact.phone,
          contact.address,
          contact.title,
          contact.profilePicture,
          contact.updatedAt,
          contact.createdAt,
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
