export const mockContactService = {
  getContacts: jest.fn((userId, limit, offset) => {
    const contacts = [
      {
        id: process.env.TEST_CONTACT_ID,
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        address: "123 Main St",
        title: "Engineer",
        profilePicture: "john_doe.png",
      },
      {
        id: process.env.TEST_CONTACT_ID,
        name: "John Doe2",
        email: "john@example2.com",
        phone: "123-456-7890",
        address: "123 Main St",
        title: "Engineer2",
        profilePicture: "john_doe2.png",
      },
    ];

    const paginatedContacts = contacts.slice(offset, offset + limit);
    return Promise.resolve(paginatedContacts);
  }),
  getContact: jest.fn((userId, contactId) => {
    if (contactId === process.env.TEST_CONTACT_ID) {
      return Promise.resolve({
        id: process.env.TEST_CONTACT_ID,
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        address: "123 Main St",
        title: "Engineer",
        profilePicture: "john_doe.png",
      });
    } else {
      return Promise.resolve(undefined);
    }
  }),
  addContact: jest.fn().mockResolvedValue({
    id: process.env.TEST_CONTACT_ID,
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "098-765-4321",
    address: "456 Another St",
    title: "Developer",
    profilePicture: "profilePicture-1718904477016-510662741.jpg",
  }),
  modifyContact: jest.fn().mockResolvedValue({
    id: process.env.TEST_CONTACT_ID,
    name: "John Doe Updated",
    email: "john_updated@example.com",
    phone: "123-456-7890",
    address: "123 Main St",
    title: "Engineer",
    profilePicture: "profilePicture-1718904477016-510662741.jpg",
  }),
};

export const mockUserService = {
  getUser: jest.fn((userId) => {
    if (userId === process.env.TEST_USER_ID) {
      return Promise.resolve({
        id: process.env.TEST_USER_ID,
        email: "test@example.com",
      });
    } else {
      return Promise.resolve(undefined);
    }
  }),
};
