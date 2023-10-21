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
