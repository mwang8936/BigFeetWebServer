import { celebrate, Joi, Segments, Modes } from 'celebrate';

export const LoginValidation = celebrate(
	{
		[Segments.BODY]: Joi.object().keys({
			username: Joi.string().trim().min(1).max(30).alphanum().required(),
			password: Joi.string().trim().min(1).max(30).required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
