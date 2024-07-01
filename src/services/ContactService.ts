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
    offset: number,
    searchTerm: string
  ): Promise<{ total: number; contacts: Contact[] }> {
    try {
      return await this.contactRepository.getContactsByUserId(
        userId,
        limit,
        offset,
        searchTerm
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
      title: contactData.title!,
      profilePicture: contactData.profilePicture!,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    try {
      await this.contactRepository.addContact(newContact);
      return newContact;
    } catch (error) {
      if (contactData.profilePicture) {
        const filePath = path.join(
          __dirname,
          "../../images",
          contactData.profilePicture
        );
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.rmSync(filePath);
          }
        });
      }

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
        if (contactData.profilePicture) {
          const filePath = path.join(
            __dirname,
            "../../images",
            contactData.profilePicture
          );

          fs.access(filePath, fs.constants.F_OK, (err) => {
            if (!err) {
              fs.rmSync(filePath);
            }
          });
        }
        return null;
      }
      contactData.updatedAt = new Date().toISOString();
      await this.contactRepository.updateContact(
        userId,
        contactId,
        contactData
      );
      if (contactData.profilePicture && contact.profilePicture) {
        const filePath = path.join(
          __dirname,
          "../../images",

          contact.profilePicture
        );

        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.rmSync(filePath);
          }
        });
      }
      return { ...contact, ...contactData };
    } catch (error) {
      if (contactData.profilePicture) {
        const filePath = path.join(
          __dirname,
          "../../images",

          contactData.profilePicture
        );

        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.rmSync(filePath);
          }
        });
      }

      throw error;
    }
  }
}
