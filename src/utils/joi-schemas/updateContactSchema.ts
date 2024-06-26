import Joi from "joi";

export const updateContactSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  title: Joi.string().optional(),
  profilePicture: Joi.binary().optional(),
}).min(1);
