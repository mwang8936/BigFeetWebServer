import { celebrate, Joi, Segments, Modes } from 'celebrate';
import JoiDate from '@joi/date';

export const GetSchedulesValidation = celebrate(
	{
		[Segments.QUERY]: Joi.object()
			.keys({
				start: Joi.extend(JoiDate).date().format('YYYY-MM-DD'),
				end: Joi.extend(JoiDate)
					.date()
					.format('YYYY-MM-DD')
					.greater(Joi.ref('start')),
				employee_ids: Joi.array().items(
					Joi.number().integer().positive().allow(null)
				),
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
			date: Joi.extend(JoiDate).date().format('YYYY-MM-DD').required(),
			employee_id: Joi.number()
				.integer()
				.positive()
				.required()
				.allow(null),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const UpdateScheduleValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			date: Joi.extend(JoiDate).date().format('YYYY-MM-DD').required(),
			employee_id: Joi.number()
				.integer()
				.positive()
				.allow(null)
				.required(),
		}),
		[Segments.BODY]: Joi.object({
			is_working: Joi.boolean(),
			start: Joi.extend(JoiDate).date().format('hh:mm'),
			end: Joi.extend(JoiDate).date().format('hh:mm'),
			vip_packages: Joi.array()
				.items(
					Joi.object({
						serial: Joi.number()
							.integer()
							.positive()
							.max(999999)
							.required(),
						amount: Joi.number()
							.positive()
							.precision(2)
							.max(999.99)
							.required(),
					})
				)
				.allow(null),
			signed: Joi.boolean(),
		}).min(1),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const AddScheduleValidation = celebrate({
	[Segments.BODY]: Joi.object({
		date: Joi.extend(JoiDate).date().format('YYYY-MM-DD').required(),
		employee_id: Joi.number().integer().positive().allow(null).required(),
	}),
});

export const DeleteScheduleValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			date: Joi.extend(JoiDate).date().format('YYYY-MM-DD').required(),
			employee_id: Joi.number()
				.integer()
				.positive()
				.allow(null)
				.required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
