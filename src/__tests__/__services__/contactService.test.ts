import { ContactRepository } from "../../repositories/ContactRepository";
import { ContactService } from "../../services/ContactService";
import { Contact } from "../../contracts";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

jest.mock("../../repositories/ContactRepository");
const mockContactRepository =
  new ContactRepository() as jest.Mocked<ContactRepository>;

const userId = "test-user-id";
const contactId = uuidv4();
const contactData: Partial<Contact> = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "098-765-4321",
  address: "456 Another St",
  title: "Developer",
  profilePicture: "profilePicture-1718904477016-510662741.jpg",
};

let contactService: ContactService;

beforeEach(() => {
  contactService = new ContactService(mockContactRepository);
});

describe("ContactService", () => {
  it("should handle repository errors when getting contacts", async () => {
    const error = new Error("Database error");
    mockContactRepository.getContactsByUserId.mockRejectedValueOnce(error);

    await expect(contactService.getContacts(userId, 10, 0)).rejects.toThrow(
      "Database error"
    );
  });

  it("should handle repository errors when getting a contact by ID", async () => {
    const error = new Error("Database error");
    mockContactRepository.getContactById.mockRejectedValueOnce(error);

    await expect(contactService.getContact(userId, contactId)).rejects.toThrow(
      "Database error"
    );
  });

  it("should handle repository errors when adding a contact and remove the profile picture", async () => {
    const error = new Error("Database error");
    mockContactRepository.addContact.mockRejectedValueOnce(error);
    jest.spyOn(fs, "rmSync").mockImplementation(() => {});

    await expect(
      contactService.addContact(userId, contactData)
    ).rejects.toThrow("Database error");
    expect(fs.rmSync).toHaveBeenCalledWith(
      path.join(__dirname, "../../../images", contactData.profilePicture!)
    );
  });

  it("should return null if the contact to be modified is not found", async () => {
    mockContactRepository.getContactById.mockResolvedValueOnce(undefined);

    const result = await contactService.modifyContact(
      userId,
      contactId,
      contactData
    );

    expect(result).toBeNull();
  });

  it("should handle repository errors when modifying a contact", async () => {
    const contact: Contact = {
      id: contactId,
      userId,
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      address: "123 Main St",
      title: "Engineer",
      profilePicture: "john_doe.png",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockContactRepository.getContactById.mockResolvedValueOnce(contact);
    const error = new Error("Database error");
    mockContactRepository.updateContact.mockRejectedValueOnce(error);

    await expect(
      contactService.modifyContact(userId, contactId, contactData)
    ).rejects.toThrow("Database error");
  });

  it("should modify a contact and delete the old profile picture", async () => {
    const contact: Contact = {
      id: contactId,
      userId,
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      address: "123 Main St",
      title: "Engineer",
      profilePicture: "john_doe.png",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockContactRepository.getContactById.mockResolvedValueOnce(contact);
    mockContactRepository.updateContact.mockResolvedValueOnce(undefined);
    jest.spyOn(fs, "rmSync").mockImplementation(() => {});

    const result = await contactService.modifyContact(
      userId,
      contactId,
      contactData
    );

    expect(fs.rmSync).toHaveBeenCalledWith(
      path.join(__dirname, "../../../images", contact.profilePicture)
    );
    expect(result).toEqual({ ...contact, ...contactData });
  });
});
