import Joi from 'joi';

export const createLifestyleAssessmentSchema = Joi.object({
  user_id: Joi.number().integer().required().messages({
    'any.required': 'user_id wajib diisi',
    'number.base': 'user_id harus berupa angka',
  }),

  dietary_pattern: Joi.string().allow('', null).optional(),

  meals_per_day: Joi.number().integer().min(1).allow(null).optional().messages({
    'number.base': 'meals_per_day harus berupa angka',
    'number.min': 'meals_per_day minimal 1',
  }),

  daily_water_intake_goal: Joi.number()
    .precision(2)
    .allow(null)
    .optional()
    .messages({
      'number.base': 'daily_water_intake_goal harus berupa angka',
    }),

  avg_sleep_hours: Joi.number()
    .precision(2)
    .min(0)
    .max(24)
    .allow(null)
    .optional()
    .messages({
      'number.base': 'avg_sleep_hours harus berupa angka',
      'number.min': 'avg_sleep_hours minimal 0',
      'number.max': 'avg_sleep_hours maksimal 24',
    }),

  smoking_habits: Joi.string().allow('', null).optional(),
});

export const updateLifestyleAssessmentSchema = Joi.object({
  dietary_pattern: Joi.string().allow('', null).optional(),

  meals_per_day: Joi.number().integer().min(1).allow(null).optional().messages({
    'number.base': 'meals_per_day harus berupa angka',
    'number.min': 'meals_per_day minimal 1',
  }),

  daily_water_intake_goal: Joi.number()
    .precision(2)
    .allow(null)
    .optional()
    .messages({
      'number.base': 'daily_water_intake_goal harus berupa angka',
    }),

  avg_sleep_hours: Joi.number()
    .precision(2)
    .min(0)
    .max(24)
    .allow(null)
    .optional()
    .messages({
      'number.base': 'avg_sleep_hours harus berupa angka',
      'number.min': 'avg_sleep_hours minimal 0',
      'number.max': 'avg_sleep_hours maksimal 24',
    }),

  smoking_habits: Joi.string().allow('', null).optional(),
})
  .min(1)
  .messages({
    'object.min': 'Minimal satu field harus diisi untuk update',
  });
