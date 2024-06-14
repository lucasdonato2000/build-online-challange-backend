import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { Database } from "sqlite";

async function openDB(): Promise<Database> {
  return open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });
}

export default openDB;
