import request from "supertest";
import app from "../../index";
import openDB from "../../__mocks__/database";

let token: string;
let mockDB: any;
let noteId: string;
const wrongUUID = "4024d7fd-015c-41ec-b51d-6960cdcb7805";
const userId = "13b5d77b-77f7-4c24-8c30-761a080010fd";

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

describe("Note API", () => {
  it("should add a new note with valid data", async () => {
    mockDB.run.mockResolvedValueOnce({ lastID: 1, changes: 1 });
    const response = await request(app)
      .post(`/api/contacts/${process.env.TEST_CONTACT_ID}/notes`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "This is a note",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.content).toBe("This is a note");
    noteId = response.body.id;
  });

  it("should fail to add a new note with invalid contact ID", async () => {
    mockDB.run.mockResolvedValueOnce({ lastID: 1, changes: 1 });
    const response = await request(app)
      .post(`/api/contacts/25/notes`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "This is a note",
      });

    expect(response.status).toBe(400);
  });

  it("should fail to add a new note with invalid content", async () => {
    mockDB.run.mockResolvedValueOnce({ lastID: 1, changes: 1 });
    const response = await request(app)
      .post(`/api/contacts/${process.env.TEST_CONTACT_ID}/notes`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: false,
      });

    expect(response.status).toBe(400);
  });

  it("should fail to add a new note with invalid authorization token", async () => {
    mockDB.run.mockResolvedValueOnce({ lastID: 1, changes: 1 });
    const response = await request(app)
      .post(`/api/contacts/1/notes`)
      .set("Authorization", `Bearer 12312`)
      .send({
        content: "This is a note",
      });

    expect(response.status).toBe(401);
  });

  it("should get notes with valid authorization token", async () => {
    mockDB.all = jest.fn().mockResolvedValueOnce([
      {
        id: "1",
        content: "This is a note",
        contactId: "1",
        userId: "1",
      },
    ]);

    const response = await request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].content).toBe("This is a note");
  });

  it("should fail to fetch notes with invalid authorization token", async () => {
    mockDB.all = jest.fn().mockResolvedValueOnce([
      {
        id: "1",
        content: "This is a note",
        contactId: "1",
        userId: "1",
      },
    ]);

    const response = await request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer 12312`);

    expect(response.status).toBe(401);
  });

  it("should get a note by ID with valid authorization token", async () => {
    mockDB.get.mockResolvedValueOnce({
      id: noteId,
      content: "This is a note",
      contactId: "1",
      userId: "1",
    });

    const response = await request(app)
      .get(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.content).toBe("This is a note");
  });

  it("should fail to get a note by ID with invalid ID", async () => {
    const response = await request(app)
      .get(`/api/notes/124`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("should return 404 if note not found", async () => {
    mockDB.get.mockResolvedValueOnce(undefined);
    const response = await request(app)
      .get(`/api/notes/${wrongUUID}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Note not found");
  });
});
