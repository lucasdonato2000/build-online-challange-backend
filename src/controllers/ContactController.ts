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

      const { limit = "10", offset = "0", searchTerm = "" } = req.query;

      const limitNumber = Number(limit);
      const offsetNumber = Number(offset);
      const searchTermString = String(searchTerm);

      if (Number.isNaN(limitNumber) || Number.isNaN(offsetNumber)) {
        throw new BadRequestError("Invalid pagination parameters");
      }

      const { total, contacts } = await this.contactService.getContacts(
        req.user.id,
        limitNumber,
        offsetNumber,
        searchTermString
      );
      contacts.map((contact) => {
        if (contact.profilePicture) {
          const imageUrl = this.urlMaker(req, contact.profilePicture);
          contact.profilePicture = imageUrl;
        }
      });
      res.json({ total, contacts });
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

      if (contact.profilePicture) {
        const imageUrl = this.urlMaker(req, contact.profilePicture);
        contact.profilePicture = imageUrl;
      }

      res.json({
        contact,
      });
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

      if (newContact.profilePicture) {
        const imageUrl = this.urlMaker(req, newContact.profilePicture);
        newContact.profilePicture = imageUrl;
      }

      res.status(201).json({
        newContact,
      });
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

      if (updatedContact.profilePicture) {
        const imageUrl = this.urlMaker(req, updatedContact.profilePicture);
        updatedContact.profilePicture = imageUrl;
      }

      res.json({
        updatedContact,
      });
    } catch (error) {
      next(error);
    }
  };

  urlMaker = (req: Request, profilePicture: string) => {
    return `${req.protocol}://${req.get("host")}/images/${profilePicture}`;
  };
}

export default ContactController;
