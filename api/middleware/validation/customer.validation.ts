import { celebrate, Joi, Segments, Modes } from 'celebrate';

import LENGTHS from './constants/lengths.constants';
import PATTERNS from './constants/patterns.constants';

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
				.length(LENGTHS.customer.phone_number)
				.pattern(PATTERNS.customer.phone_number)
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
				.length(LENGTHS.customer.phone_number)
				.pattern(PATTERNS.customer.phone_number)
				.required(),
		}),
		[Segments.BODY]: Joi.object({
			customer_name: Joi.string()
				.trim()
				.min(1)
				.max(LENGTHS.customer.customer_name)
				.allow(null),
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
				.length(LENGTHS.customer.phone_number)
				.pattern(PATTERNS.customer.phone_number)
				.required(),
			customer_name: Joi.string()
				.trim()
				.min(1)
				.max(LENGTHS.customer.customer_name)
				.allow(null),
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
				.length(LENGTHS.customer.phone_number)
				.pattern(PATTERNS.customer.phone_number)
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
				.length(LENGTHS.customer.phone_number)
				.pattern(PATTERNS.customer.phone_number)
				.required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
