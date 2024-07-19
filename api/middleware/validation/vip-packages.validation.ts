import { celebrate, Joi, Segments, Modes } from 'celebrate';

export const GetVipPackagesValidation = celebrate(
	{
		[Segments.QUERY]: Joi.object().keys({
			start: Joi.date().iso(),
			end: Joi.when('start', {
				is: Joi.exist(),
				then: Joi.date().iso().greater(Joi.ref('start')),
				otherwise: Joi.date().iso(),
			}),
			employee_ids: Joi.array().items(Joi.number().integer().positive()).min(1),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const GetVipPackageValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			serial: Joi.string()
				.length(6)
				.pattern(/^[0-9]+$/)
				.required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const UpdateVipPackageValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			serial: Joi.string()
				.length(6)
				.pattern(/^[0-9]+$/)
				.required(),
		}),
		[Segments.BODY]: Joi.object({
			amount: Joi.number().positive().precision(2).max(999999.99),
			date: Joi.date().iso(),
			employee_ids: Joi.array().items(Joi.number().integer().positive()).min(1),
		})
			.min(1)
			.with('date', 'employee_ids')
			.with('employee_ids', 'date'),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const AddVipPackageValidation = celebrate(
	{
		[Segments.BODY]: Joi.object({
			serial: Joi.string()
				.length(6)
				.pattern(/^[0-9]+$/)
				.required(),
			amount: Joi.number().positive().precision(2).max(999999.99).required(),
			date: Joi.date().iso().required(),
			employee_ids: Joi.array()
				.items(Joi.number().integer().positive())
				.min(1)
				.required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const DeleteVipPackageValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			serial: Joi.string()
				.length(6)
				.pattern(/^[0-9]+$/)
				.required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
