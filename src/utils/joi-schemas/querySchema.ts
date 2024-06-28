import Joi from "joi";

export const querySchema = Joi.object({
  limit: Joi.number().integer().min(1).default(10),
  offset: Joi.number().integer().min(0).default(0),
  searchTerm: Joi.string().allow("").default("").optional(),
});
