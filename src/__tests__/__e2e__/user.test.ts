import request from "supertest";
import app from "../../index";
import openDB from "../../__mocks__/database";

let mockDB: any;
let token: string;
const userId = process.env.TEST_USER_ID || "";

beforeAll(async () => {
  mockDB = await openDB();
  mockDB.exec.mockResolvedValue(undefined);
  mockDB.run.mockResolvedValue({ lastID: 1, changes: 1 });
  mockDB.get.mockResolvedValue({
    id: userId,
    email: process.env.TEST_USER_EMAIL,
    password: process.env.TEST_USER_PASSWORD,
  });

  const response = await request(app).post("/api/login").send({
    email: "user1@example.com",
    password: "password1",
  });
  token = response.body.token;
});

describe("UserController API", () => {
  it("should return user details for authenticated user", async () => {
    mockDB.get.mockResolvedValue({
      id: userId,
      email: process.env.TEST_USER_EMAIL,
    });

    const response = await request(app)
      .get("/api/user")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: userId,
      email: process.env.TEST_USER_EMAIL,
    });
  });

  it("should return 401 if user is not authenticated", async () => {
    app.use((req, res, next) => {
      req.user = { id: userId };
      next();
    });

    const response = await request(app)
      .get("/api/user")
      .set("Authorization", `Bearer 1323`);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid Credentials" });
  });
});
