import { Contact } from "../entities/Contact";

export interface IContactModel {
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
    setClause: string,
    values: (string | number | undefined)[]
  ): Promise<void>;
}
