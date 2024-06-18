import Joi from "joi";

export const addContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string(),
  address: Joi.string(),
  profilePicture: Joi.string(),
});
