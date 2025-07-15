import { celebrate, Joi, Segments, Modes } from 'celebrate';

import LENGTHS from './constants/lengths.constants';

export const LoginValidation = celebrate(
	{
		[Segments.BODY]: Joi.object().keys({
			username: Joi.string()
				.trim()
				.min(1)
				.max(LENGTHS.employee.username)
				.alphanum()
				.required(),
			password: Joi.string()
				.trim()
				.min(1)
				.max(LENGTHS.employee.password)
				.required(),
			device_id: Joi.string().trim().min(1),
			device_name: Joi.string().trim().min(1),
			device_model: Joi.string().trim().min(1),
			push_token: Joi.string().trim().min(1),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
