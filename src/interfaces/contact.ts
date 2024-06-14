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
  profilePicture: string;
}

export { Contact, ContactData };
