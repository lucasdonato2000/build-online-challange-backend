import Joi from "joi";

export const contactParamSchema = Joi.object({
  contactId: Joi.string().uuid().required(),
});
