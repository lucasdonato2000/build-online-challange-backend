import ContactModel from "../models/ContactModel";
import { Contact } from "../interfaces";
import openDB from "../db/database";

class ContactRepository {
  private contactModel: ContactModel | null = null;

  constructor() {
    openDB().then((db) => {
      this.contactModel = new ContactModel(db);
    });
  }

  private async getContactModel(): Promise<ContactModel> {
    if (!this.contactModel) {
      const db = await openDB();
      this.contactModel = new ContactModel(db);
    }
    return this.contactModel;
  }

  async getContactsByUserId(
    userId: string,
    limit: number,
    offset: number
  ): Promise<Contact[]> {
    const contactModel = await this.getContactModel();
    return contactModel.getContactsByUserId(userId, limit, offset);
  }

  async getContactById(
    userId: string,
    contactId: string
  ): Promise<Contact | undefined> {
    const contactModel = await this.getContactModel();
    return contactModel.getContactById(userId, contactId);
  }

  async addContact(contact: Contact): Promise<void> {
    const contactModel = await this.getContactModel();
    return contactModel.addContact(contact);
  }

  async updateContact(
    userId: string,
    contactId: string,
    contactData: Partial<Contact>
  ): Promise<void> {
    const contactModel = await this.getContactModel();
    return contactModel.updateContact(userId, contactId, contactData);
  }
}

export { ContactRepository };
