import { Request, Response, NextFunction } from "express";
import { ContactController } from "../../controllers/ContactController";
import {
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} from "../../errors";
import { mockContactService } from "../../__mocks__/services";

jest.mock("../../services/ContactService", () => {
  return {
    ContactService: jest.fn().mockImplementation(() => mockContactService),
  };
});

let contactController: ContactController;
let req: Partial<Request>;
let res: Partial<Response>;
let next: NextFunction;

beforeEach(() => {
  contactController = new ContactController(mockContactService as any);
  req = {
    protocol: "http",
  };
  res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };
  next = jest.fn();
});

describe("ContactController Error Handling", () => {
  it("should call next with UnauthorizedError if req.user is not defined in getContactsHandler", async () => {
    await contactController.getContactsHandler(
      req as Request,
      res as Response,
      next
    );
    expect(next).toHaveBeenCalledWith(new UnauthorizedError("Unauthorized"));
  });

  it("should call next with UnauthorizedError if req.user is not defined in getContactHandler", async () => {
    await contactController.getContactHandler(
      req as Request,
      res as Response,
      next
    );
    expect(next).toHaveBeenCalledWith(new UnauthorizedError("Unauthorized"));
  });

  it("should call next with UnauthorizedError if req.user is not defined in addContactHandler", async () => {
    await contactController.addContactHandler(
      req as Request,
      res as Response,
      next
    );
    expect(next).toHaveBeenCalledWith(new UnauthorizedError("Unauthorized"));
  });

  it("should call next with UnauthorizedError if req.user is not defined in updateContactHandler", async () => {
    await contactController.updateContactHandler(
      req as Request,
      res as Response,
      next
    );
    expect(next).toHaveBeenCalledWith(new UnauthorizedError("Unauthorized"));
  });

  it("should call next with BadRequestError for invalid pagination parameters in getContactsHandler", async () => {
    req.user = { id: "1" };
    req.query = { limit: "not-a-number", offset: "0" };

    await contactController.getContactsHandler(
      req as Request,
      res as Response,
      next
    );
    expect(next).toHaveBeenCalledWith(
      new BadRequestError("Invalid pagination parameters")
    );
  });

  it("should call next with NotFoundError if contact is not found in getContactHandler", async () => {
    req.user = { id: "1" };
    req.params = { contactId: "non-existent-id" };

    mockContactService.getContact.mockResolvedValueOnce(undefined);

    await contactController.getContactHandler(
      req as Request,
      res as Response,
      next
    );
    expect(next).toHaveBeenCalledWith(new NotFoundError("Contact not found"));
  });

  it("should call next with Error if addContactHandler encounters an unexpected error", async () => {
    req.user = { id: "1" };
    req.body = { name: "Jane Doe" };

    mockContactService.addContact.mockResolvedValueOnce(undefined as any);

    await contactController.addContactHandler(
      req as Request,
      res as Response,
      next
    );
    expect(next).toHaveBeenCalledWith(
      new Error("Unexpected error adding new user")
    );
  });

  it("should call next with NotFoundError if contact is not found in updateContactHandler", async () => {
    req.user = { id: "1" };
    req.params = { contactId: "non-existent-id" };

    mockContactService.modifyContact.mockResolvedValueOnce(undefined as any);

    await contactController.updateContactHandler(
      req as Request,
      res as Response,
      next
    );
    expect(next).toHaveBeenCalledWith(new NotFoundError("Contact not found"));
  });

  it("should generate the correct URL for profile pictures in urlMaker", () => {
    req.get = jest.fn().mockReturnValue("localhost");
    const result = contactController.urlMaker(
      req as Request,
      "profilePicture.jpg"
    );
    expect(result).toBe("http://localhost/images/profilePicture.jpg");
  });
});
