import { Database } from "sqlite";
import { Statement } from "sqlite3";

const mockDB: Partial<Database> = {
  exec: jest.fn(),
  run: jest.fn(),
  get: jest.fn(),
  all: jest.fn(),
  close: jest.fn(),
};

const openDB = jest.fn(() => Promise.resolve(mockDB as Database));
export default openDB;
export { mockDB };
