import Joi from "joi";

export const noteParamSchema = Joi.object({
  noteId: Joi.string().uuid().required(),
});
