import { celebrate, Joi, Segments, Modes } from 'celebrate';

import {
	payrollOptionValidation,
	payrollPartValidation,
} from './enum.validation';
import NUMBERS from './constants/numbers.constants';

export const GetPayrollsValidation = celebrate(
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

export const GetPayrollValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			year: Joi.number()
				.integer()
				.positive()
				.min(NUMBERS.payroll.year.min)
				.required(),
			month: Joi.number()
				.integer()
				.positive()
				.min(NUMBERS.payroll.month.min)
				.max(NUMBERS.payroll.month.max)
				.required(),
			part: payrollPartValidation.required(),
			employee_id: Joi.number().integer().positive().required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const UpdatePayrollValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			year: Joi.number()
				.integer()
				.positive()
				.min(NUMBERS.payroll.year.min)
				.required(),
			month: Joi.number()
				.integer()
				.positive()
				.min(NUMBERS.payroll.month.min)
				.max(NUMBERS.payroll.month.max)
				.required(),
			part: payrollPartValidation.required(),
			employee_id: Joi.number().integer().positive().required(),
		}),
		[Segments.BODY]: Joi.object({
			option: payrollOptionValidation,
			cheque_amount: Joi.number()
				.precision(2)
				.min(0)
				.max(NUMBERS.payroll.cheque_amount)
				.allow(null),
		}).or('option', 'cheque_amount'),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const AddPayrollValidation = celebrate(
	{
		[Segments.BODY]: Joi.object({
			year: Joi.number()
				.integer()
				.positive()
				.min(NUMBERS.payroll.year.min)
				.required(),
			month: Joi.number()
				.integer()
				.positive()
				.min(NUMBERS.payroll.month.min)
				.max(NUMBERS.payroll.month.max)
				.required(),
			part: payrollPartValidation.required(),
			employee_id: Joi.number().integer().positive().required(),
			option: payrollOptionValidation.required(),
			cheque_amount: Joi.number()
				.precision(2)
				.min(0)
				.max(NUMBERS.payroll.cheque_amount)
				.allow(null),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const DeletePayrollValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			year: Joi.number()
				.integer()
				.positive()
				.min(NUMBERS.payroll.year.min)
				.required(),
			month: Joi.number()
				.integer()
				.positive()
				.min(NUMBERS.payroll.month.min)
				.max(NUMBERS.payroll.month.max)
				.required(),
			part: payrollPartValidation.required(),
			employee_id: Joi.number().integer().positive().required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const RefreshPayrollValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			year: Joi.number()
				.integer()
				.positive()
				.min(NUMBERS.payroll.year.min)
				.required(),
			month: Joi.number()
				.integer()
				.positive()
				.min(NUMBERS.payroll.month.min)
				.max(NUMBERS.payroll.month.max)
				.required(),
			part: payrollPartValidation.required(),
			employee_id: Joi.number().integer().positive().required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
