import Joi from "joi";

export const addContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  title: Joi.string().required(),
  profilePicture: Joi.binary(),
});
