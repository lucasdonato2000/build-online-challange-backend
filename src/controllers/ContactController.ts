import { Request, Response, NextFunction } from "express";
import { ContactService } from "../services";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../errors";
import { IContactController } from "../contracts";

export class ContactController implements IContactController {
  constructor(private contactService: ContactService) {}

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
      contacts.map((contact) => {
        const imageUrl = this.urlMaker(req, contact.profilePicture);
        contact.profilePicture = imageUrl;
      });
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
      if (!contact) {
        throw new NotFoundError("Contact not found");
      }

      const imageUrl = this.urlMaker(req, contact.profilePicture);

      res.json({ ...contact, profilePicture: imageUrl });
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

      if (!newContact) {
        throw new Error("Unexpected error adding new user");
      }

      const imageUrl = this.urlMaker(req, newContact.profilePicture);
      res.status(201).json({ ...newContact, profilePicture: imageUrl });
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

      if (!updatedContact) {
        throw new NotFoundError("Contact not found");
      }
      const imageUrl = this.urlMaker(req, updatedContact.profilePicture);
      res.status(201).json({ ...updatedContact, profilePicture: imageUrl });
    } catch (error) {
      next(error);
    }
  };

  urlMaker = (req: Request, profilePicture: string) => {
    return `${req.protocol}://${req.get("host")}/images/${profilePicture}`;
  };
}

export default ContactController;
