import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

async function openDB() {
  return open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });
}

async function seedDatabase() {
  const db = await openDB();

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
        profession: "Engineer",
        profilePicture: "contact1_user1.png",
      },
      {
        name: "Contact2 User1",
        email: "contact2.user1@example.com",
        phone: "123-456-7891",
        address: "124 User1 St, City1",
        profession: "Doctor",
        profilePicture: "contact2_user1.png",
      },
      {
        name: "Contact3 User1",
        email: "contact3.user1@example.com",
        phone: "123-456-7892",
        address: "125 User1 St, City1",
        profession: "Artist",
        profilePicture: "contact3_user1.png",
      },
      {
        name: "Contact4 User1",
        email: "contact4.user1@example.com",
        phone: "123-456-7893",
        address: "126 User1 St, City1",
        profession: "Teacher",
        profilePicture: "contact4_user1.png",
      },
      {
        name: "Contact5 User1",
        email: "contact5.user1@example.com",
        phone: "123-456-7894",
        address: "127 User1 St, City1",
        profession: "Chef",
        profilePicture: "contact5_user1.png",
      },
    ],

    [
      {
        name: "Contact1 User2",
        email: "contact1.user2@example.com",
        phone: "223-456-7890",
        address: "223 User2 St, City2",
        profession: "Lawyer",
        profilePicture: "contact1_user2.png",
      },
      {
        name: "Contact2 User2",
        email: "contact2.user2@example.com",
        phone: "223-456-7891",
        address: "224 User2 St, City2",
        profession: "Musician",
        profilePicture: "contact2_user2.png",
      },
      {
        name: "Contact3 User2",
        email: "contact3.user2@example.com",
        phone: "223-456-7892",
        address: "225 User2 St, City2",
        profession: "Scientist",
        profilePicture: "contact3_user2.png",
      },
    ],
    [],
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

    console.log(`User seeded with email: ${user.email}`);

    for (const contact of contacts[i]) {
      const contactId = uuidv4();
      await db.run(
        "INSERT INTO contacts (id, userId, name, email, phone, address, profilePicture) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          contactId,
          userId,
          contact.name,
          contact.email,
          contact.phone,
          contact.address,
          contact.profilePicture,
        ]
      );
      console.log(`Contact seeded for user ${user.email}: ${contact.name}`);
    }
  }
}

seedDatabase().catch(console.error);
