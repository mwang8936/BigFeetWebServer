import { celebrate, Joi, Segments, Modes } from 'celebrate';

import { colorValidation } from './enum.validation';

import LENGTHS from './constants/lengths.constants';
import NUMBERS from './constants/numbers.constants';

export const GetServicesValidation = celebrate(
	{
		[Segments.QUERY]: Joi.object().keys({
			with_deleted: Joi.boolean().default(false),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const GetServiceValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			service_id: Joi.number().integer().positive().required(),
		}),
		[Segments.QUERY]: Joi.object().keys({
			with_deleted: Joi.boolean().default(false),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const UpdateServiceValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			service_id: Joi.number().integer().positive().required(),
		}),
		[Segments.BODY]: Joi.object({
			service_name: Joi.string()
				.trim()
				.min(1)
				.max(LENGTHS.service.service_name),
			shorthand: Joi.string().trim().min(1).max(LENGTHS.service.shorthand),
			time: Joi.number().integer().positive().max(NUMBERS.service.time),
			money: Joi.number().positive().precision(2).max(NUMBERS.service.money),
			body: Joi.number().precision(1).min(0).max(NUMBERS.service.body),
			feet: Joi.number().precision(1).min(0).max(NUMBERS.service.feet),
			acupuncture: Joi.number()
				.precision(1)
				.min(0)
				.max(NUMBERS.service.acupuncture),
			beds_required: Joi.number().integer().min(0),
			color: colorValidation,
		})
			.or(
				'service_name',
				'shorthand',
				'time',
				'money',
				'body',
				'feet',
				'acupuncture',
				'beds_required',
				'color'
			)
			.append({ socket_id: Joi.string() }),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const AddServiceValidation = celebrate(
	{
		[Segments.BODY]: Joi.object({
			service_name: Joi.string()
				.trim()
				.min(1)
				.max(LENGTHS.service.service_name)
				.required(),
			shorthand: Joi.string()
				.trim()
				.min(1)
				.max(LENGTHS.service.shorthand)
				.required(),
			time: Joi.number()
				.integer()
				.positive()
				.max(NUMBERS.service.time)
				.required(),
			money: Joi.number()
				.positive()
				.precision(2)
				.max(NUMBERS.service.money)
				.required(),
			body: Joi.number().precision(1).min(0).max(NUMBERS.service.body),
			feet: Joi.number().precision(1).min(0).max(NUMBERS.service.feet),
			acupuncture: Joi.number()
				.precision(1)
				.min(0)
				.max(NUMBERS.service.acupuncture),
			beds_required: Joi.number().integer().min(0).required(),
			color: colorValidation.required(),
		})
			.or('body', 'feet', 'acupuncture')
			.append({ socket_id: Joi.string() }),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const DeleteServiceValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			service_id: Joi.number().integer().positive().required(),
		}),
		[Segments.BODY]: Joi.object().keys({
			socket_id: Joi.string(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const RecoverServiceValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			service_id: Joi.number().integer().positive().required(),
		}),
		[Segments.BODY]: Joi.object().keys({
			socket_id: Joi.string(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
