import openDB from "./database";

async function setupDatabase() {
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
      UNIQUE (userId, phone),
      UNIQUE (userId, name)
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
}

export default setupDatabase;
