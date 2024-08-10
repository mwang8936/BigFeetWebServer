import { celebrate, Joi, Segments, Modes } from 'celebrate';

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
