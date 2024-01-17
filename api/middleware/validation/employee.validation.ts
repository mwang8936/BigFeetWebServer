import { celebrate, Joi, Segments, Modes } from 'celebrate';
import {
	genderValidation,
	permissionsValidation,
	roleValidation,
} from './enum.validation';

export const GetEmployeeValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			employee_id: Joi.number().integer().positive().required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const UpdateEmployeeValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			employee_id: Joi.number().integer().positive().required(),
		}),
		[Segments.BODY]: Joi.object({
			username: Joi.string().trim().min(1).max(30).alphanum(),
			first_name: Joi.string()
				.trim()
				.min(1)
				.max(30)
				.pattern(/^[a-zA-Z]+$/),
			last_name: Joi.string()
				.trim()
				.min(1)
				.max(30)
				.pattern(/^[a-zA-Z]+$/),
			gender: genderValidation,
			role: roleValidation,
			permissions: permissionsValidation,
			body_rate: Joi.number().precision(2).min(0).max(99.99).allow(null),
			feet_rate: Joi.number().precision(2).min(0).max(99.99).allow(null),
			per_hour: Joi.number().precision(2).min(0).max(99.99).allow(null),
		}).min(1),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const AddEmployeeValidation = celebrate(
	{
		[Segments.BODY]: Joi.object({
			username: Joi.string().trim().min(1).max(30).alphanum().required(),
			password: Joi.string().trim().min(1).max(30).required(),
			first_name: Joi.string()
				.trim()
				.min(1)
				.max(30)
				.pattern(/^[a-zA-Z]+$/)
				.required(),
			last_name: Joi.string()
				.trim()
				.min(1)
				.max(30)
				.pattern(/^[a-zA-Z]+$/)
				.required(),
			gender: genderValidation.required(),
			role: roleValidation.required(),
			permissions: permissionsValidation.required(),
			body_rate: Joi.number().precision(2).min(0).max(99.99).allow(null),
			feet_rate: Joi.number().precision(2).min(0).max(99.99).allow(null),
			per_hour: Joi.number().precision(2).min(0).max(99.99).allow(null),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const DeleteEmployeeValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			employee_id: Joi.number().integer().positive().required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
