import { Contact } from "../entities/Contact";

export interface IContactRepository {
  getContactsByUserId(
    userId: string,
    limit: number,
    offset: number,
    searchTerm: string
  ): Promise<{ total: number; contacts: Contact[] }>;
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
