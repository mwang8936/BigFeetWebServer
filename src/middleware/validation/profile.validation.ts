import { celebrate, Joi, Segments, Modes } from 'celebrate';

import LENGTHS from './constants/lengths.constants';

import { languageValidation } from './enum.validation';

export const GetProfileSchedulesValidation = celebrate(
	{
		[Segments.QUERY]: Joi.object().keys({
			start: Joi.date().iso(),
			end: Joi.when('start', {
				is: Joi.exist(),
				then: Joi.date().iso().min(Joi.ref('start')),
				otherwise: Joi.date().iso(),
			}),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const GetProfilePayrollsValidation = celebrate(
	{
		[Segments.QUERY]: Joi.object().keys({
			start: Joi.date().iso(),
			end: Joi.when('start', {
				is: Joi.exist(),
				then: Joi.date().iso().min(Joi.ref('start')),
				otherwise: Joi.date().iso(),
			}),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const GetProfileAcupunctureReportsValidation = celebrate(
	{
		[Segments.QUERY]: Joi.object().keys({
			start: Joi.date().iso(),
			end: Joi.when('start', {
				is: Joi.exist(),
				then: Joi.date().iso().min(Joi.ref('start')),
				otherwise: Joi.date().iso(),
			}),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const UpdateProfileValidation = celebrate(
	{
		[Segments.BODY]: Joi.object()
			.keys({
				language: languageValidation,
			})
			.min(1),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const ChangeProfilePasswordValidation = celebrate(
	{
		[Segments.BODY]: Joi.object().keys({
			old_password: Joi.string()
				.trim()
				.min(1)
				.max(LENGTHS.employee.password)
				.required(),
			new_password: Joi.string()
				.trim()
				.min(1)
				.max(LENGTHS.employee.password)
				.required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const SignProfileScheduleValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			date: Joi.date().iso().required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const LogoutValidation = celebrate(
	{
		[Segments.BODY]: Joi.object().keys({
			device_id: Joi.string().trim().min(1),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
