interface ContactData {
  name: string;
  address: string;
  email: string;
  phone: string;
}

interface Contact {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  title: string;
  profilePicture: string;
  updatedAt?: Date | string;
  createdAt?: Date | string;
}

export { Contact, ContactData };
