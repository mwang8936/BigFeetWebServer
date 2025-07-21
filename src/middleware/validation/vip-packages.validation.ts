import { celebrate, Joi, Segments, Modes } from 'celebrate';

import LENGTHS from './constants/lengths.constants';
import PATTERNS from './constants/patterns.constants';
import NUMBERS from './constants/numbers.constants';

import { paymentMethodValidation } from './enum.validation';

export const GetVipPackagesValidation = celebrate(
	{
		[Segments.QUERY]: Joi.object().keys({
			start: Joi.date().iso(),
			end: Joi.when('start', {
				is: Joi.exist(),
				then: Joi.date().iso().greater(Joi.ref('start')),
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

export const GetVipPackageValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			vip_package_id: Joi.number().integer().positive().required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const UpdateVipPackageValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			vip_package_id: Joi.number().integer().positive().required(),
		}),
		[Segments.BODY]: Joi.object({
			serial: Joi.string()
				.length(LENGTHS.vip_package.serial)
				.pattern(PATTERNS.vip_package.serial),
			payment_method: paymentMethodValidation,
			sold_amount: Joi.number()
				.min(0)
				.precision(2)
				.max(NUMBERS.vip_package.sold_amount),
			commission_amount: Joi.number()
				.min(0)
				.precision(2)
				.max(NUMBERS.vip_package.commission_amount),
			date: Joi.date().iso(),
			employee_ids: Joi.array()
				.items(Joi.number().integer().positive())
				.min(1)
				.unique(),
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
				.length(LENGTHS.vip_package.serial)
				.pattern(PATTERNS.vip_package.serial)
				.required(),
			payment_method: paymentMethodValidation.required(),
			sold_amount: Joi.number()
				.min(0)
				.precision(2)
				.max(NUMBERS.vip_package.sold_amount)
				.required(),
			commission_amount: Joi.number()
				.min(0)
				.precision(2)
				.max(NUMBERS.vip_package.commission_amount)
				.required(),
			date: Joi.date().iso().required(),
			employee_ids: Joi.array()
				.items(Joi.number().integer().positive())
				.min(1)
				.unique()
				.required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const DeleteVipPackageValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			vip_package_id: Joi.number().integer().positive().required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
