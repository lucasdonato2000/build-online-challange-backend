import Joi from "joi";

export const addNoteSchema = Joi.object({
  content: Joi.string().required(),
});
