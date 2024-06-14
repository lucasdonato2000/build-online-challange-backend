import { Contact } from "../interfaces";
import { ContactRepository } from "../repositories/ContactRepository";
import { v4 as uuidv4 } from "uuid";

export class ContactService {
  constructor(private contactRepository: ContactRepository) {}

  async getContacts(
    userId: string,
    limit: number,
    offset: number
  ): Promise<Contact[]> {
    return await this.contactRepository.getContactsByUserId(
      userId,
      limit,
      offset
    );
  }

  async getContact(
    userId: string,
    contactId: string
  ): Promise<Contact | undefined> {
    return await this.contactRepository.getContactById(userId, contactId);
  }

  async addContact(
    userId: string,
    contactData: Partial<Contact>
  ): Promise<Contact> {
    const newContact: Contact = {
      id: uuidv4(),
      userId,
      name: contactData.name!,
      email: contactData.email!,
      phone: contactData.phone!,
      address: contactData.address!,
      profilePicture: contactData.profilePicture!,
    };
    await this.contactRepository.addContact(newContact);
    return newContact;
  }

  async modifyContact(
    userId: string,
    contactId: string,
    contactData: Partial<Contact>
  ): Promise<Contact | null> {
    const contact = await this.contactRepository.getContactById(
      userId,
      contactId
    );
    if (!contact) {
      return null;
    }
    await this.contactRepository.updateContact(userId, contactId, contactData);
    return { ...contact, ...contactData };
  }
}
