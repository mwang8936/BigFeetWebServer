import { celebrate, Joi, Segments, Modes } from 'celebrate';
import { colorValidation } from './enum.validation';

export const GetServiceValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			service_id: Joi.number().integer().positive().required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const UpdateServiceValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			service_id: Joi.number().integer().positive().required(),
		}),
		[Segments.BODY]: Joi.object({
			service_name: Joi.string().trim().min(1).max(30),
			shorthand: Joi.string().trim().min(1).max(20),
			time: Joi.number().integer().positive().max(999),
			money: Joi.number().positive().precision(2).max(999.99),
			body: Joi.number().positive().precision(2).max(9.99).allow(0),
			feet: Joi.number().positive().precision(2).max(9.99).allow(0),
			color: colorValidation,
		}).min(1),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const AddServiceValidation = celebrate(
	{
		[Segments.BODY]: Joi.object({
			service_name: Joi.string().trim().min(1).max(30).required(),
			shorthand: Joi.string().trim().min(1).max(20).required(),
			time: Joi.number().integer().positive().max(999).required(),
			money: Joi.number().positive().precision(2).max(999.99).required(),
			body: Joi.number().precision(2).min(0).max(9.99).allow(0),
			feet: Joi.number().precision(2).min(0).max(9.99).allow(0),
			color: colorValidation.required(),
		}).or('body', 'feet'),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const DeleteServiceValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			service_id: Joi.number().integer().positive().required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
