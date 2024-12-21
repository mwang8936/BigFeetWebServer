import { celebrate, Joi, Segments, Modes } from 'celebrate';

import {
	genderValidation,
	permissionsValidation,
	roleValidation,
} from './enum.validation';

import LENGTHS from './constants/lengths.constants';
import PATTERNS from './constants/patterns.constants';
import NUMBERS from './constants/numbers.constants';

export const GetEmployeesValidation = celebrate(
	{
		[Segments.QUERY]: Joi.object().keys({
			with_deleted: Joi.boolean().default(false),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const GetEmployeeValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			employee_id: Joi.number().integer().positive().required(),
		}),
		[Segments.QUERY]: Joi.object().keys({
			with_deleted: Joi.boolean().default(false),
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
			username: Joi.string()
				.trim()
				.min(1)
				.max(LENGTHS.employee.username)
				.alphanum(),
			password: Joi.string().trim().min(1).max(LENGTHS.employee.password),
			first_name: Joi.string()
				.trim()
				.min(1)
				.max(LENGTHS.employee.first_name)
				.pattern(PATTERNS.employee.first_name),
			last_name: Joi.string()
				.trim()
				.min(1)
				.max(LENGTHS.employee.last_name)
				.pattern(PATTERNS.employee.last_name),
			gender: genderValidation,
			role: roleValidation,
			permissions: permissionsValidation,
			body_rate: Joi.number()
				.precision(2)
				.min(0)
				.max(NUMBERS.employee.body_rate)
				.allow(null),
			feet_rate: Joi.number()
				.precision(2)
				.min(0)
				.max(NUMBERS.employee.feet_rate)
				.allow(null),
			acupuncture_rate: Joi.number()
				.precision(2)
				.min(0)
				.max(NUMBERS.employee.acupuncture_rate)
				.allow(null),
			per_hour: Joi.number()
				.precision(2)
				.min(0)
				.max(NUMBERS.employee.per_hour)
				.allow(null),
		}).min(1),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const AddEmployeeValidation = celebrate(
	{
		[Segments.BODY]: Joi.object({
			username: Joi.string()
				.trim()
				.min(1)
				.max(LENGTHS.employee.username)
				.alphanum()
				.required(),
			password: Joi.string()
				.trim()
				.min(1)
				.max(LENGTHS.employee.password)
				.required(),
			first_name: Joi.string()
				.trim()
				.min(1)
				.max(LENGTHS.employee.first_name)
				.pattern(PATTERNS.employee.first_name)
				.required(),
			last_name: Joi.string()
				.trim()
				.min(1)
				.max(LENGTHS.employee.last_name)
				.pattern(PATTERNS.employee.last_name)
				.required(),
			gender: genderValidation.required(),
			role: roleValidation.required(),
			permissions: permissionsValidation.required(),
			body_rate: Joi.number()
				.precision(2)
				.min(0)
				.max(NUMBERS.employee.body_rate)
				.allow(null),
			feet_rate: Joi.number()
				.precision(2)
				.min(0)
				.max(NUMBERS.employee.feet_rate)
				.allow(null),
			acupuncture_rate: Joi.number()
				.precision(2)
				.min(0)
				.max(NUMBERS.employee.acupuncture_rate)
				.allow(null),
			per_hour: Joi.number()
				.precision(2)
				.min(0)
				.max(NUMBERS.employee.per_hour)
				.allow(null),
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

export const RecoverEmployeeValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			employee_id: Joi.number().integer().positive().required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
