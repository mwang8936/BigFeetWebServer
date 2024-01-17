import { celebrate, Joi, Segments, Modes } from 'celebrate';

export const GetSchedulesValidation = celebrate(
	{
		[Segments.QUERY]: Joi.object()
			.keys({
				start: Joi.date().iso(),
				end: Joi.date().iso().greater(Joi.ref('start')),
				employee_ids: Joi.array().items(Joi.number().integer().positive()),
			})
			.with('start', 'end')
			.with('end', 'start'),
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
			start: Joi.date().iso().allow(null),
			end: Joi.date().iso().greater(Joi.ref('start')).allow(null),
			vip_packages: Joi.array().items(
				Joi.object({
					serial: Joi.string()
						.length(6)
						.pattern(/^[0-9]+$/)
						.required(),
					amount: Joi.number()
						.positive()
						.precision(2)
						.max(999999.99)
						.required(),
				})
			),
		})
			.min(1)
			.with('end', 'start'),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const AddScheduleValidation = celebrate({
	[Segments.BODY]: Joi.object({
		date: Joi.date().iso().required(),
		employee_id: Joi.number().integer().positive().required(),
		is_working: Joi.boolean(),
		start: Joi.date().iso().allow(null),
		end: Joi.date().iso().greater(Joi.ref('start')).allow(null),
		vip_packages: Joi.array().items(
			Joi.object({
				serial: Joi.string()
					.length(6)
					.pattern(/^[0-9]+$/)
					.required(),
				amount: Joi.number().positive().precision(2).max(999999.99).required(),
			})
		),
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
