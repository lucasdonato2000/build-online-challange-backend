import { Database } from "sqlite";
import { Contact } from "../interfaces";

class ContactModel {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getContactsByUserId(
    userId: string,
    limit: number,
    offset: number
  ): Promise<Contact[]> {
    return this.db.all<Contact[]>(
      "SELECT * FROM contacts WHERE userId = ? LIMIT ? OFFSET ?",
      [userId, limit, offset]
    );
  }

  async getContactById(
    userId: string,
    contactId: string
  ): Promise<Contact | undefined> {
    return this.db.get<Contact>(
      "SELECT * FROM contacts WHERE id = ? AND userId = ?",
      [contactId, userId]
    );
  }

  async addContact(contact: Contact): Promise<void> {
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
  }

  async updateContact(
    userId: string,
    contactId: string,
    contactData: Partial<Contact>
  ): Promise<void> {
    await this.db.run(
      "UPDATE contacts SET name = ?, email = ?, phone = ?, address = ?, profilePicture = ? WHERE id = ? AND userId = ?",
      [
        contactData.name,
        contactData.email,
        contactData.phone,
        contactData.address,
        contactData.profilePicture,
        contactId,
        userId,
      ]
    );
  }
}

export default ContactModel;
