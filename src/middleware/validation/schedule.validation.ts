import { celebrate, Joi, Segments, Modes } from 'celebrate';
import LENGTHS from './constants/lengths.constants';

export const GetSchedulesValidation = celebrate(
	{
		[Segments.QUERY]: Joi.object().keys({
			start: Joi.date().iso(),
			end: Joi.when('start', {
				is: Joi.exist(),
				then: Joi.date().iso().min(Joi.ref('start')),
				otherwise: Joi.date().iso(),
			}),
			employee_ids: Joi.array()
				.items(Joi.number().integer().positive())
				.min(1)
				.unique(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const GetScheduleValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			date: Joi.date().iso().required(),
			employee_id: Joi.number().integer().positive().required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const UpdateScheduleValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			date: Joi.date().iso().required(),
			employee_id: Joi.number().integer().positive().required(),
		}),
		[Segments.BODY]: Joi.object({
			is_working: Joi.boolean(),
			on_call: Joi.boolean(),
			start: Joi.date().iso().allow(null),
			end: Joi.date().iso().allow(null),
			priority: Joi.number().integer().positive().allow(null),
			add_award: Joi.boolean(),
		}).min(1),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const SignScheduleValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			date: Joi.date().iso().required(),
			employee_id: Joi.number().integer().positive().required(),
		}),
		[Segments.BODY]: Joi.object({
			password: Joi.string()
				.trim()
				.min(1)
				.max(LENGTHS.employee.password)
				.required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const AddScheduleValidation = celebrate({
	[Segments.BODY]: Joi.object({
		date: Joi.date().iso().required(),
		employee_id: Joi.number().integer().positive().required(),
		is_working: Joi.boolean().default(false),
		on_call: Joi.boolean().default(false),
		start: Joi.date().iso().allow(null),
		end: Joi.date().iso().min(Joi.ref('start')).allow(null),
		priority: Joi.number().integer().positive().allow(null),
		add_award: Joi.boolean().default(false),
	}).with('end', 'start'),
});

export const DeleteScheduleValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			date: Joi.date().iso().required(),
			employee_id: Joi.number().integer().positive().required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
