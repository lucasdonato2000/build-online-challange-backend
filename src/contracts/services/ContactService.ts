import { Contact } from "../entities/Contact";

export interface IContactService {
  getContacts(
    userId: string,
    limit: number,
    offset: number,
    searchTerm: string
  ): Promise<{ total: number; contacts: Contact[] }>;
  getContact(userId: string, contactId: string): Promise<Contact | undefined>;
  addContact(userId: string, contactData: Partial<Contact>): Promise<Contact>;
  modifyContact(
    userId: string,
    contactId: string,
    contactData: Partial<Contact>
  ): Promise<Contact | null>;
}
