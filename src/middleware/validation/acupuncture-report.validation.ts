import { celebrate, Joi, Segments, Modes } from 'celebrate';

import NUMBERS from './constants/numbers.constants';

export const GetAcupunctureReportsValidation = celebrate(
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

export const GetAcupunctureReportValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			year: Joi.number()
				.integer()
				.positive()
				.min(NUMBERS.acupuncture_report.year.min)
				.required(),
			month: Joi.number()
				.integer()
				.positive()
				.min(NUMBERS.acupuncture_report.month.min)
				.max(NUMBERS.acupuncture_report.month.max)
				.required(),
			employee_id: Joi.number().integer().positive().required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const UpdateAcupunctureReportValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			year: Joi.number()
				.integer()
				.positive()
				.min(NUMBERS.acupuncture_report.year.min)
				.required(),
			month: Joi.number()
				.integer()
				.positive()
				.min(NUMBERS.acupuncture_report.month.min)
				.max(NUMBERS.acupuncture_report.month.max)
				.required(),
			employee_id: Joi.number().integer().positive().required(),
		}),
		[Segments.BODY]: Joi.object({
			acupuncture_percentage: Joi.number()
				.precision(4)
				.min(0)
				.max(NUMBERS.acupuncture_report.acupuncture_percentage),
			massage_percentage: Joi.number()
				.precision(4)
				.min(0)
				.max(NUMBERS.acupuncture_report.massage_percentage),
			insurance_percentage: Joi.number()
				.precision(4)
				.min(0)
				.max(NUMBERS.acupuncture_report.insurance_percentage),
		}).or(
			'acupuncture_percentage',
			'massage_percentage',
			'insurance_percentage'
		),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const AddAcupunctureReportValidation = celebrate(
	{
		[Segments.BODY]: Joi.object({
			year: Joi.number()
				.integer()
				.positive()
				.min(NUMBERS.acupuncture_report.year.min)
				.required(),
			month: Joi.number()
				.integer()
				.positive()
				.min(NUMBERS.acupuncture_report.month.min)
				.max(NUMBERS.acupuncture_report.month.max)
				.required(),
			employee_id: Joi.number().integer().positive().required(),
			acupuncture_percentage: Joi.number()
				.precision(4)
				.min(0)
				.max(NUMBERS.acupuncture_report.acupuncture_percentage)
				.required(),
			massage_percentage: Joi.number()
				.precision(4)
				.min(0)
				.max(NUMBERS.acupuncture_report.massage_percentage)
				.required(),
			insurance_percentage: Joi.number()
				.precision(4)
				.min(0)
				.max(NUMBERS.acupuncture_report.insurance_percentage)
				.required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const DeleteAcupunctureReportValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			year: Joi.number()
				.integer()
				.positive()
				.min(NUMBERS.acupuncture_report.year.min)
				.required(),
			month: Joi.number()
				.integer()
				.positive()
				.min(NUMBERS.acupuncture_report.month.min)
				.max(NUMBERS.acupuncture_report.month.max)
				.required(),
			employee_id: Joi.number().integer().positive().required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
