import Joi from 'joi';

export const createBasicIdentitySchema = Joi.object({
  user_id: Joi.string().required(),
  age: Joi.number().integer().min(1).max(120).required(),
  gender: Joi.string().valid('Male', 'Female').required(),
  weight: Joi.number().positive().required(),
  height: Joi.number().positive().required(),
  activity_level: Joi.string()
    .valid(
      'Sedentary',
      'Lightly Active',
      'Moderately Active',
      'Very Active',
      'Extra Active',
    )
    .required(),
});

export const updateBasicIdentitySchema = Joi.object({
  age: Joi.number().integer().min(1).max(120).optional(),
  gender: Joi.string().valid('Male', 'Female').optional(),
  weight: Joi.number().positive().optional(),
  height: Joi.number().positive().optional(),
  activity_level: Joi.string()
    .valid(
      'Sedentary',
      'Lightly Active',
      'Moderately Active',
      'Very Active',
      'Extra Active',
    )
    .optional(),
});
