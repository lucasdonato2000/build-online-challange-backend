import request from "supertest";
import app from "../../index";
import path from "path";
import openDB from "../../__mocks__/database";
import fs from "fs";

let token: string;
let mockDB: any;
let contactId: string;
let profilePicture: string;
const wrongUUID = "4024d7fd-015c-41ec-b51d-6960cdcb7805";

beforeAll(async () => {
  mockDB = await openDB();
  mockDB.exec.mockResolvedValue(undefined);
  mockDB.run.mockResolvedValue({ lastID: 1, changes: 1 });
  mockDB.get.mockResolvedValue({
    id: process.env.TEST_CONTACT_ID,
    email: process.env.TEST_USER_EMAIL,
    password: process.env.TEST_USER_PASSWORD,
  });

  const response = await request(app).post("/api/login").send({
    email: "user1@example.com",
    password: "password1",
  });
  token = response.body.token;
});

afterAll(async () => {
  const imagePath = path.join(__dirname, `../../images/${profilePicture}`);
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
});

describe("Contact API", () => {
  it("should create a new contact with valid data", async () => {
    mockDB.run.mockResolvedValueOnce({ lastID: 1, changes: 1 });
    const response = await request(app)
      .post("/api/contacts")
      .set("Authorization", `Bearer ${token}`)
      .attach(
        "profilePicture",
        path.join(__dirname, "../../__mocks__/__test-files__/persona.jpg")
      )
      .field("name", "Jane Doe")
      .field("email", "jane@example.com")
      .field("phone", "098-765-4321")
      .field("address", "456 Another St")
      .field("title", "Developer");
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("newContact");
    expect(response.body.newContact).toHaveProperty("id");
    expect(response.body.newContact.name).toBe("Jane Doe");

    profilePicture =
      response.body.newContact.profilePicture.split("/").pop() || "";
    contactId = response.body.newContact.id;
  });

  it("should fail to create a new contact with bad request data", async () => {
    mockDB.run.mockResolvedValueOnce();
    const response = await request(app)
      .post("/api/contacts")
      .set("Authorization", `Bearer ${token}`)
      .attach(
        "profilePicture",
        path.join(__dirname, "../../__mocks__/__test-files__/persona.jpg")
      )
      .field("name", 25);

    expect(response.status).toBe(400);
  });

  it("should fail to create a new contact with invalid authorization token", async () => {
    mockDB.run.mockResolvedValueOnce({ lastID: 1, changes: 1 });
    const response = await request(app)
      .post("/api/contacts")
      .set("Authorization", `Bearer 12312`)
      .field("name", "Jane Doe")
      .field("email", "jane@example.com")
      .field("phone", "098-765-4321")
      .field("address", "456 Another St")
      .field("title", "Developer");

    expect(response.status).toBe(401);
  });

  it("should fail to create a new contact without authorization token", async () => {
    mockDB.run.mockResolvedValueOnce({ lastID: 1, changes: 1 });
    const response = await request(app)
      .post("/api/contacts")
      .field("name", "Jane Doe")
      .field("email", "jane@example.com")
      .field("phone", "098-765-4321")
      .field("address", "456 Another St")
      .field("title", "Developer");

    expect(response.status).toBe(401);
  });

  it("should get contacts with default pagination", async () => {
    mockDB.all = jest.fn().mockResolvedValueOnce([
      {
        id: process.env.TEST_CONTACT_ID,
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        address: "123 Main St",
        title: "Engineer",
        profilePicture: "john_doe.png",
      },
      {
        id: process.env.TEST_CONTACT_ID,
        name: "John Doe2",
        email: "john@example2.com",
        phone: "123-456-7890",
        address: "123 Main St",
        title: "Engineer2",
        profilePicture: "john_doe2.png",
      },
    ]);

    const response = await request(app)
      .get("/api/contacts")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.contacts).toHaveLength(2);
    expect(response.body.contacts[0].name).toBe("John Doe");
  });

  it("should get contacts with custom pagination", async () => {
    mockDB.all = jest.fn().mockResolvedValueOnce([
      {
        id: process.env.TEST_CONTACT_ID,
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        address: "123 Main St",
        title: "Engineer",
        profilePicture: "john_doe.png",
      },
    ]);

    const response = await request(app)
      .get("/api/contacts?limit=1&offset=0 ")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.contacts).toHaveLength(1);
    expect(response.body.contacts[0].name).toBe("John Doe");
  });

  it("should fail to fetch contacts with invalid authorization token", async () => {
    mockDB.all = jest.fn().mockResolvedValueOnce([
      {
        id: process.env.TEST_CONTACT_ID,
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        address: "123 Main St",
        title: "Engineer",
        profilePicture: "john_doe.png",
      },
    ]);

    const response = await request(app)
      .get("/api/contacts")
      .set("Authorization", `Bearer 12312`);

    expect(response.status).toBe(401);
  });

  it("should fail to fetch contacts with invalid query parameters", async () => {
    mockDB.all = jest.fn().mockResolvedValueOnce([
      {
        id: process.env.TEST_CONTACT_ID,
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        address: "123 Main St",
        title: "Engineer",
        profilePicture: "john_doe.png",
      },
    ]);

    const response = await request(app)
      .get("/api/contacts?limit=hola&offset=0")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("should get a contact by ID", async () => {
    mockDB.get.mockResolvedValueOnce({
      id: process.env.TEST_CONTACT_ID,
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      address: "123 Main St",
      title: "Engineer",
      profilePicture: "john_doe.png",
    });

    const response = await request(app)
      .get(`/api/contacts/${contactId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.contact.name).toBe("John Doe");
  });

  it("should return 404 if contact not found", async () => {
    mockDB.get.mockResolvedValueOnce(undefined);

    const response = await request(app)
      .get(`/api/contacts/${wrongUUID}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Contact not found");
  });

  it("should update a contact with valid data", async () => {
    mockDB.run.mockResolvedValueOnce({ changes: 1 });
    mockDB.get.mockResolvedValueOnce({
      id: process.env.TEST_CONTACT_ID,
      name: "John Doe Updated",
      email: "john_updated@example.com",
      phone: "123-456-7890",
      address: "123 Main St",
      title: "Engineer",
      profilePicture: profilePicture,
    });

    const response = await request(app)
      .put(`/api/contacts/${contactId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "John Doe Updated",
        email: "john_updated@example.com",
      });
    expect(response.status).toBe(200);
    expect(response.body.updatedContact.name).toBe("John Doe Updated");
  });

  it("should fail to update a contact with invalid file type", async () => {
    mockDB.run.mockResolvedValueOnce({ changes: 1 });

    const response = await request(app)
      .put(`/api/contacts/${contactId}`)
      .set("Authorization", `Bearer ${token}`)
      .attach(
        "profilePicture",
        path.join(__dirname, "../../__mocks__/__test-files__/image.txt")
      );

    expect(response.status).toBe(400);
  });

  it("should fail to update a contact with invalid data type", async () => {
    mockDB.run.mockResolvedValueOnce({ changes: 1 });

    const response = await request(app)
      .put(`/api/contacts/${contactId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: 25,
      });

    expect(response.status).toBe(400);
  });
});
