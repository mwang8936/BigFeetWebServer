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

export const GetCustomerHistoriesValidation = celebrate(
	{
		[Segments.QUERY]: Joi.object().keys({
			date: Joi.date().iso().required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const GetCustomerValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			customer_id: Joi.number().integer().positive().required(),
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
			customer_id: Joi.number().integer().positive().required(),
		}),
		[Segments.BODY]: Joi.object({
			phone_number: Joi.string()
				.length(LENGTHS.customer.phone_number)
				.pattern(PATTERNS.customer.phone_number)
				.allow(null),
			vip_serial: Joi.string()
				.length(LENGTHS.customer.vip_serial)
				.pattern(PATTERNS.customer.vip_serial)
				.allow(null),
			customer_name: Joi.string()
				.trim()
				.min(1)
				.max(LENGTHS.customer.customer_name)
				.allow(null),
			notes: Joi.string().trim().min(1).allow(null),
		})
			.or('phone_number', 'vip_serial', 'customer_name', 'notes')
			.append({ socket_id: Joi.string() }),
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
				.allow(null),
			vip_serial: Joi.string()
				.length(LENGTHS.customer.vip_serial)
				.pattern(PATTERNS.customer.vip_serial)
				.allow(null),
			customer_name: Joi.string()
				.trim()
				.min(1)
				.max(LENGTHS.customer.customer_name)
				.allow(null),
			notes: Joi.string().trim().min(1).allow(null),
		})
			.or('phone_number', 'vip_serial')
			.append({ socket_id: Joi.string() }),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const DeleteCustomerValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			customer_id: Joi.number().integer().positive().required(),
		}),
		[Segments.BODY]: Joi.object().keys({
			socket_id: Joi.string(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const RecoverCustomerValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			customer_id: Joi.number().integer().positive().required(),
		}),
		[Segments.BODY]: Joi.object().keys({
			socket_id: Joi.string(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
