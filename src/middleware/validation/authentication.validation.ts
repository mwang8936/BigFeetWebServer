import { celebrate, Joi, Segments, Modes } from 'celebrate';

import { channelValidation } from './enum.validation';

export const AuthenticatePusherValidation = celebrate(
	{
		[Segments.BODY]: Joi.object({
			socket_id: Joi.string().required(),
			channel: channelValidation,
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
