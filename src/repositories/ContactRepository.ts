import { ContactModel } from "../models/ContactModel";
import { Contact, IContactRepository } from "../contracts";
import openDB from "../db/database";

export class ContactRepository implements IContactRepository {
  private contactModel: ContactModel | null = null;

  constructor() {
    openDB().then((db) => {
      this.contactModel = new ContactModel(db);
    });
  }

  private async getContactModel(): Promise<ContactModel> {
    try {
      if (!this.contactModel) {
        const db = await openDB();
        this.contactModel = new ContactModel(db);
      }
      return this.contactModel;
    } catch (error) {
      throw error;
    }
  }

  async getContactsByUserId(
    userId: string,
    limit: number,
    offset: number
  ): Promise<Contact[]> {
    try {
      const contactModel = await this.getContactModel();
      return contactModel.getContactsByUserId(userId, limit, offset);
    } catch (error) {
      throw error;
    }
  }

  async getContactById(
    userId: string,
    contactId: string
  ): Promise<Contact | undefined> {
    try {
      const contactModel = await this.getContactModel();
      return contactModel.getContactById(userId, contactId);
    } catch (error) {
      throw error;
    }
  }

  async addContact(contact: Contact): Promise<void> {
    try {
      const contactModel = await this.getContactModel();
      return contactModel.addContact(contact);
    } catch (error) {
      throw error;
    }
  }

  async updateContact(
    userId: string,
    contactId: string,
    contactData: Partial<Contact>
  ): Promise<void> {
    try {
      const fields = Object.entries(contactData)
        .filter(([, value]) => value !== undefined)
        .map(([key]) => key as keyof Contact);

      const setClause = fields
        .map((field) => `${String(field)} = ?`)
        .join(", ");
      const values = fields.map((field) => contactData[field]);

      const contactModel = await this.getContactModel();
      values.push(contactId, userId);
      await contactModel.updateContact(userId, contactId, setClause, values);
    } catch (error) {
      throw error;
    }
  }
}
