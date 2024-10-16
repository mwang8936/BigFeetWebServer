import { celebrate, Joi, Segments, Modes } from 'celebrate';

import { genderValidation, tipMethodValidation } from './enum.validation';
import LENGTHS from './constants/lengths.constants';
import PATTERNS from './constants/patterns.constants';
import NUMBERS from './constants/numbers.constants';

export const GetReservationsValidation = celebrate(
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

export const GetReservationValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			reservation_id: Joi.number().integer().positive().required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const UpdateReservationValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			reservation_id: Joi.number().integer().positive().required(),
		}),
		[Segments.BODY]: Joi.object({
			reserved_date: Joi.date().iso(),
			employee_id: Joi.number().integer().positive(),
			service_id: Joi.number().integer().positive(),
			time: Joi.number()
				.integer()
				.positive()
				.max(NUMBERS.service.time)
				.allow(null),
			beds_required: Joi.number().integer().min(0).allow(null),
			customer_id: Joi.number().integer().positive().allow(null),
			phone_number: Joi.string()
				.length(LENGTHS.customer.phone_number)
				.pattern(PATTERNS.customer.phone_number)
				.allow(null),
			vip_serial: Joi.string()
				.length(LENGTHS.customer.vip_serial)
				.pattern(PATTERNS.customer.vip_serial)
				.allow(null),
			customer_name: Joi.string()
				.trim()
				.min(1)
				.max(LENGTHS.customer.customer_name)
				.allow(null),
			notes: Joi.string().trim().min(1).allow(null),
			requested_gender: genderValidation.allow(null),
			requested_employee: Joi.boolean(),
			cash: Joi.number()
				.min(0)
				.precision(2)
				.max(NUMBERS.reservation.cash)
				.allow(null),
			machine: Joi.number()
				.min(0)
				.precision(2)
				.max(NUMBERS.reservation.machine)
				.allow(null),
			vip: Joi.number()
				.min(0)
				.precision(2)
				.max(NUMBERS.reservation.vip)
				.allow(null),
			gift_card: Joi.number()
				.min(0)
				.precision(2)
				.max(NUMBERS.reservation.gift_card)
				.allow(null),
			insurance: Joi.number()
				.min(0)
				.precision(2)
				.max(NUMBERS.reservation.insurance)
				.allow(null),
			acupuncturist_employee_id: Joi.number().integer().positive().allow(null),
			cash_out: Joi.number()
				.min(0)
				.precision(2)
				.max(NUMBERS.reservation.cash_out)
				.allow(null),
			tips: Joi.number()
				.min(0)
				.precision(2)
				.max(NUMBERS.reservation.tips)
				.allow(null),
			tip_method: tipMethodValidation.allow(null),
			message: Joi.string().trim().min(1).allow(null),
			updated_by: Joi.string()
				.trim()
				.min(1)
				.max(LENGTHS.reservation.updated_by)
				.alphanum()
				.required(),
		})
			.or(
				'reserved_date',
				'employee_id',
				'service_id',
				'time',
				'beds_required',
				'customer_id',
				'phone_number',
				'vip_serial',
				'customer_name',
				'notes',
				'requested_gender',
				'requested_employee',
				'cash',
				'machine',
				'vip',
				'gift_card',
				'insurance',
				'acupuncturist_employee_id',
				'cash_out',
				'tips',
				'tip_method',
				'message'
			)
			.append({ socket_id: Joi.string() }),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const AddReservationValidation = celebrate({
	[Segments.BODY]: Joi.object({
		reserved_date: Joi.date().iso().required(),
		employee_id: Joi.number().integer().positive().required(),
		service_id: Joi.number().integer().positive().required(),
		time: Joi.number()
			.integer()
			.positive()
			.max(NUMBERS.service.time)
			.allow(null),
		beds_required: Joi.number().integer().min(0).allow(null),
		customer_id: Joi.number().integer().positive().allow(null),
		phone_number: Joi.string()
			.length(LENGTHS.customer.phone_number)
			.pattern(PATTERNS.customer.phone_number)
			.allow(null),
		vip_serial: Joi.string()
			.length(LENGTHS.customer.vip_serial)
			.pattern(PATTERNS.customer.vip_serial)
			.allow(null),
		customer_name: Joi.string()
			.trim()
			.min(1)
			.max(LENGTHS.customer.customer_name)
			.allow(null),
		notes: Joi.string().trim().min(1).allow(null),
		requested_gender: genderValidation.allow(null),
		requested_employee: Joi.boolean().default(false),
		message: Joi.string().trim().min(1).allow(null),
		created_by: Joi.string()
			.trim()
			.min(1)
			.max(LENGTHS.reservation.created_by)
			.alphanum()
			.required(),
	}).append({ socket_id: Joi.string() }),
});

export const DeleteReservationValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			reservation_id: Joi.number().integer().positive().required(),
		}),
		[Segments.BODY]: Joi.object().keys({
			socket_id: Joi.string(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
