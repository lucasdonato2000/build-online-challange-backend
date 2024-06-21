const database = require("./src/__mocks__/database");

jest.mock("./src/db/database", () => {
  return database;
});
