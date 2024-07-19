import { celebrate, Joi, Segments, Modes } from 'celebrate';
import { colorValidation } from './enum.validation';

export const GetServicesValidation = celebrate(
	{
		[Segments.QUERY]: Joi.object().keys({
			with_deleted: Joi.boolean().default(false),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const GetServiceValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			service_id: Joi.number().integer().positive().required(),
		}),
		[Segments.QUERY]: Joi.object().keys({
			with_deleted: Joi.boolean().default(false),
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
			body: Joi.number().precision(1).min(0).max(9.9),
			feet: Joi.number().precision(1).min(0).max(9.9),
			acupuncture: Joi.number().precision(1).min(0).max(9.9),
			bed_required: Joi.boolean(),
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
			body: Joi.number().precision(1).min(0).max(9.9),
			feet: Joi.number().precision(1).min(0).max(9.9),
			acupuncture: Joi.number().precision(1).min(0).max(9.9),
			bed_required: Joi.boolean().required(),
			color: colorValidation.required(),
		}).or('body', 'feet', 'acupuncture'),
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

export const RecoverServiceValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			service_id: Joi.number().integer().positive().required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
