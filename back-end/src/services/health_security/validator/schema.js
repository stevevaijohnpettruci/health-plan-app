import Joi from 'joi';

export const createHealthSecuritySchema = Joi.object({
  user_id: Joi.number().integer().required().messages({
    'any.required': 'user_id wajib diisi',
    'number.base': 'user_id harus berupa angka',
  }),

  medical_history: Joi.string().allow('', null).optional(),

  physical_injuries: Joi.string().allow('', null).optional(),

  current_medication: Joi.string().allow('', null).optional(),

  blood_pressure: Joi.string().allow('', null).optional(),

  heart_rate: Joi.number().integer().allow(null).optional().messages({
    'number.base': 'heart_rate harus berupa angka',
  }),

  allergy: Joi.string().allow('', null).optional(),
});

export const updateHealthSecuritySchema = Joi.object({
  medical_history: Joi.string().allow('', null).optional(),

  physical_injuries: Joi.string().allow('', null).optional(),

  current_medication: Joi.string().allow('', null).optional(),

  blood_pressure: Joi.string().allow('', null).optional(),

  heart_rate: Joi.number().integer().allow(null).optional().messages({
    'number.base': 'heart_rate harus berupa angka',
  }),

  allergy: Joi.string().allow('', null).optional(),
})
  .min(1)
  .messages({
    'object.min': 'Minimal satu field harus diisi untuk update',
  });
