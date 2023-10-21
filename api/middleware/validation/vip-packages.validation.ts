import { celebrate, Joi, Segments, Modes } from 'celebrate';

export const GetVipPackageValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			serial: Joi.number().integer().positive().max(999999).required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const UpdateVipPackageValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			serial: Joi.number().integer().positive().max(999999).required(),
		}),
		[Segments.BODY]: Joi.object({
			amount: Joi.number().positive().precision(2).max(999.99).required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const AddVipPackageValidation = celebrate(
	{
		[Segments.BODY]: Joi.object({
			serial: Joi.number().integer().positive().max(999999).required(),
			amount: Joi.number().positive().precision(2).max(999.99).required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const DeleteVipPackageValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			serial: Joi.number().integer().positive().max(999999).required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
