import { Request, Response, NextFunction } from "express";
import {
  addContactSchema,
  addNoteSchema,
  updateContactSchema,
  contactParamSchema,
  noteParamSchema,
  querySchema,
} from "../utils/joi-schemas";

export const validateAddContact = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = addContactSchema.validate(req.body, { abortEarly: false });
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
  const { error } = updateContactSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    res.status(400).json({ error: error.details[0].message });
  } else {
    next();
  }
};

export const validateContactParam = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = contactParamSchema.validate(req.params, {
    abortEarly: false,
  });
  if (error) {
    res.status(400).json({ error: error.details[0].message });
  } else {
    next();
  }
};

export const validateAddNote = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = addNoteSchema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({ error: error.details[0].message });
  } else {
    next();
  }
};

export const validateNoteParam = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = noteParamSchema.validate(req.params, { abortEarly: false });
  if (error) {
    res.status(400).json({ error: error.details[0].message });
  } else {
    next();
  }
};

export const validateQuery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = querySchema.validate(req.query, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({ error: error.details });
  }
  req.query = value;
  next();
};
