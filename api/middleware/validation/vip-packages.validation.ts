import { celebrate, Joi, Segments, Modes } from 'celebrate';

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
			schedules: Joi.array()
				.items({
					date: Joi.date().iso().required(),
					employee_id: Joi.number().integer().positive().required(),
				})
				.min(1),
		}).min(1),
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
			schedules: Joi.array()
				.items({
					date: Joi.date().iso(),
					employee_id: Joi.number().integer().positive(),
				})
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
