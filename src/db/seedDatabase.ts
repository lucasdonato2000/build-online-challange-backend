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
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        phone: "123-456-7890",
        address: "123 Main St, Springfield, IL",
        title: "Engineer",
      },
      {
        name: "David Brown",
        email: "david.brown@example.com",
        phone: "123-456-7891",
        address: "124 Elm St, Springfield, IL",
        title: "Doctor",
      },
      {
        name: "Emily Davis",
        email: "emily.davis@example.com",
        phone: "123-456-7892",
        address: "125 Oak St, Springfield, IL",
        title: "Artist",
      },
      {
        name: "Frank Miller",
        email: "frank.miller@example.com",
        phone: "123-456-7893",
        address: "126 Pine St, Springfield, IL",
        title: "Teacher",
      },
      {
        name: "Grace Wilson",
        email: "grace.wilson@example.com",
        phone: "123-456-7894",
        address: "127 Maple St, Springfield, IL",
        title: "Chef",
      },
    ],
    [
      {
        name: "Henry Moore",
        email: "henry.moore@example.com",
        phone: "223-456-7890",
        address: "223 Main St, Springfield, IL",
        title: "Lawyer",
      },
      {
        name: "Irene Clark",
        email: "irene.clark@example.com",
        phone: "223-456-7891",
        address: "224 Elm St, Springfield, IL",
        title: "Musician",
      },
      {
        name: "Jack Lewis",
        email: "jack.lewis@example.com",
        phone: "223-456-7892",
        address: "225 Oak St, Springfield, IL",
        title: "Scientist",
      },
    ],
    [],
  ];

  const notes = [
    [
      { content: "Meeting with Alice about the new project" },
      { content: "Discussing medical advancements with David" },
    ],
    [
      { content: "Legal consultation with Henry" },
      { content: "Music rehearsal with Irene" },
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
