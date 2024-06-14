import { Request, Response, NextFunction } from "express";
import { ContactService } from "../services/ContactService";
import { ContactRepository } from "../repositories/ContactRepository";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors";

export class ContactController {
  private contactService: ContactService;

  constructor() {
    this.contactService = new ContactService(new ContactRepository());
  }

  getContactsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Unauthorized");
      }

      const { limit = "10", offset = "0" } = req.query;

      const limitNumber = Number(limit);
      const offsetNumber = Number(offset);

      if (Number.isNaN(limitNumber) || Number.isNaN(offsetNumber)) {
        throw new BadRequestError("Invalid pagination parameters");
      }

      const contacts = await this.contactService.getContacts(
        req.user.id,
        limitNumber,
        offsetNumber
      );
      res.json(contacts);
    } catch (error) {
      next(error);
    }
  };

  getContactHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Unauthorized");
      }
      const contact = await this.contactService.getContact(
        req.user.id,
        req.params.contactId
      );
      if (contact) {
        res.json(contact);
      } else {
        throw new NotFoundError("Contact not found");
      }
    } catch (error) {
      next(error);
    }
  };

  addContactHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Unauthorized");
      }
      const newContact = await this.contactService.addContact(
        req.user.id,
        req.body
      );
      res.status(201).json(newContact);
    } catch (error) {
      next(error);
    }
  };

  updateContactHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Unauthorized");
      }
      const updatedContact = await this.contactService.modifyContact(
        req.user.id,
        req.params.contactId,
        req.body
      );
      if (updatedContact) {
        res.json(updatedContact);
      } else {
        throw new NotFoundError("Contact not found");
      }
    } catch (error) {
      next(error);
    }
  };
}

export default ContactController;
