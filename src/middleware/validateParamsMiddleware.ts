import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { addContactSchema, updateContactSchema } from "../utils/joi-schemas";

export const validateContact = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = addContactSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
  } else {
    next();
  }
};

export const validateUpdateContact = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = updateContactSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
  } else {
    next();
  }
};

const paramsSchema = Joi.object({
  contactId: Joi.string().required(),
});

export const validateParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = paramsSchema.validate(req.params);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
  } else {
    next();
  }
};
