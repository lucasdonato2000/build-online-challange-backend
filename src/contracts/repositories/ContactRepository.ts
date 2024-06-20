import { Contact } from "../entities/Contact";

export interface IContactRepository {
  getContactsByUserId(
    userId: string,
    limit: number,
    offset: number
  ): Promise<Contact[]>;
  getContactById(
    userId: string,
    contactId: string
  ): Promise<Contact | undefined>;
  addContact(contact: Contact): Promise<void>;
  updateContact(
    userId: string,
    contactId: string,
    contactData: Partial<Contact>
  ): Promise<void>;
}
