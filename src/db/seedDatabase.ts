import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import openDB from "./database";

async function seedDatabase() {
  const db = await openDB();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      password TEXT NOT NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      userId TEXT,
      name TEXT NOT NULL,
      title TEXT,
      email TEXT,
      phone TEXT,
      address TEXT,
      profilePicture TEXT,
      createdAt DATE,
      updatedAt DATE,
      FOREIGN KEY (userId) REFERENCES users(id),
      UNIQUE (userId, email),
      UNIQUE (userId, phone)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      userId TEXT,
      contactId TEXT,
      content TEXT,
      createdAt DATE,
      updatedAt DATE,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (contactId) REFERENCES contacts(id)
    );
  `);

  const users = [
    { email: "user1@example.com", password: "password1" },
    { email: "user2@example.com", password: "password2" },
    { email: "user3@example.com", password: "password3" },
  ];

  const contacts = [
    [
      {
        name: "Contact1 User1",
        email: "contact1.user1@example.com",
        phone: "123-456-7890",
        address: "123 User1 St, City1",
        title: "Engineer",
      },
      {
        name: "Contact2 User1",
        email: "contact2.user1@example.com",
        phone: "123-456-7891",
        address: "124 User1 St, City1",
        title: "Doctor",
      },
      {
        name: "Contact3 User1",
        email: "contact3.user1@example.com",
        phone: "123-456-7892",
        address: "125 User1 St, City1",
        title: "Artist",
      },
      {
        name: "Contact4 User1",
        email: "contact4.user1@example.com",
        phone: "123-456-7893",
        address: "126 User1 St, City1",
        title: "Teacher",
      },
      {
        name: "Contact5 User1",
        email: "contact5.user1@example.com",
        phone: "123-456-7894",
        address: "127 User1 St, City1",
        title: "Chef",
      },
    ],

    [
      {
        name: "Contact1 User2",
        email: "contact1.user2@example.com",
        phone: "223-456-7890",
        address: "223 User2 St, City2",
        title: "Lawyer",
      },
      {
        name: "Contact2 User2",
        email: "contact2.user2@example.com",
        phone: "223-456-7891",
        address: "224 User2 St, City2",
        title: "Musician",
      },
      {
        name: "Contact3 User2",
        email: "contact3.user2@example.com",
        phone: "223-456-7892",
        address: "225 User2 St, City2",
        title: "Scientist",
      },
    ],
    [],
  ];

  const notes = [
    [
      { content: "Note1 for Contact1 User1" },
      { content: "Note2 for Contact2 User1" },
    ],
    [
      { content: "Note1 for Contact1 User2" },
      { content: "Note2 for Contact2 User2" },
    ],
  ];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const userId = uuidv4();

    await db.run("INSERT INTO users (id, email, password) VALUES (?, ?, ?)", [
      userId,
      user.email,
      hashedPassword,
    ]);

    for (const contact of contacts[i]) {
      const contactId = uuidv4();
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;

      await db.run(
        "INSERT INTO contacts (id, userId, name, email, phone, address, title, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          contactId,
          userId,
          contact.name,
          contact.email,
          contact.phone,
          contact.address,
          contact.title,
          createdAt,
          updatedAt,
        ]
      );

      for (const note of notes[i]) {
        const noteId = uuidv4();
        await db.run(
          "INSERT INTO notes (id, userId, contactId, content, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
          [noteId, userId, contactId, note.content, createdAt, updatedAt]
        );
      }
    }
  }
}
seedDatabase();
export default seedDatabase;
