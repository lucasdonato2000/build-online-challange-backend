import { Contact, IContactService } from "../contracts";
import { ContactRepository } from "../repositories";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

export class ContactService implements IContactService {
  constructor(private contactRepository: ContactRepository) {}

  async getContacts(
    userId: string,
    limit: number,
    offset: number
  ): Promise<Contact[]> {
    try {
      return await this.contactRepository.getContactsByUserId(
        userId,
        limit,
        offset
      );
    } catch (error) {
      throw error;
    }
  }

  async getContact(
    userId: string,
    contactId: string
  ): Promise<Contact | undefined> {
    try {
      return await this.contactRepository.getContactById(userId, contactId);
    } catch (error) {
      throw error;
    }
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
    try {
      await this.contactRepository.addContact(newContact);
      return newContact;
    } catch (error) {
      const filePath = path.join(
        __dirname,
        "../../images",
        newContact.profilePicture
      );
      fs.rmSync(filePath);
      throw error;
    }
  }

  async modifyContact(
    userId: string,
    contactId: string,
    contactData: Partial<Contact>
  ): Promise<Contact | null> {
    try {
      const contact = await this.contactRepository.getContactById(
        userId,
        contactId
      );
      if (!contact) {
        return null;
      }
      await this.contactRepository.updateContact(
        userId,
        contactId,
        contactData
      );
      const filePath = path.join(
        __dirname,
        "../../images",
        contact.profilePicture
      );
      fs.rmSync(filePath);
      return { ...contact, ...contactData };
    } catch (error) {
      throw error;
    }
  }
}
