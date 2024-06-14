import openDB from "./database";

async function setupDatabase() {
  const db = await openDB();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      password TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      userId TEXT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      profilePicture TEXT,
      FOREIGN KEY (userId) REFERENCES users(id)
    );
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
