import { celebrate, Joi, Segments, Modes } from 'celebrate';

export const GetCustomersValidation = celebrate(
	{
		[Segments.QUERY]: Joi.object().keys({
			with_deleted: Joi.boolean().default(false),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const GetCustomerValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			phone_number: Joi.string()
				.length(10)
				.pattern(/^[0-9]+$/)
				.required(),
		}),
		[Segments.QUERY]: Joi.object().keys({
			with_deleted: Joi.boolean().default(false),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const UpdateCustomerValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			phone_number: Joi.string()
				.length(10)
				.pattern(/^[0-9]+$/)
				.required(),
		}),
		[Segments.BODY]: Joi.object({
			customer_name: Joi.string().trim().min(1).max(60),
			notes: Joi.string().trim().min(1).allow(null),
		}).min(1),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const AddCustomerValidation = celebrate(
	{
		[Segments.BODY]: Joi.object({
			phone_number: Joi.string()
				.length(10)
				.pattern(/^[0-9]+$/)
				.required(),
			customer_name: Joi.string().trim().min(1).max(60).required(),
			notes: Joi.string().trim().min(1).allow(null),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const DeleteCustomerValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			phone_number: Joi.string()
				.length(10)
				.pattern(/^[0-9]+$/)
				.required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const RecoverCustomerValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			phone_number: Joi.string()
				.length(10)
				.pattern(/^[0-9]+$/)
				.required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
