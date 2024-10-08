import { celebrate, Joi, Segments, Modes } from 'celebrate';

import LENGTHS from './constants/lengths.constants';

import { languageValidation } from './enum.validation';

export const UpdateProfileValidation = celebrate(
	{
		[Segments.BODY]: Joi.object()
			.keys({
				language: languageValidation,
				dark_mode: Joi.boolean(),
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
		[Segments.BODY]: Joi.object().keys({
			socket_id: Joi.string(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
