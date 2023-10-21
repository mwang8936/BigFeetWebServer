import { celebrate, Joi, Segments, Modes } from 'celebrate';
import JoiDate from '@joi/date';
import { genderValidation, tipMethodValidation } from './enum.validation';

export const GetReservationsValidation = celebrate(
	{
		[Segments.QUERY]: Joi.object()
			.keys({
				start: Joi.extend(JoiDate).date().format('YYYY-MM-DD'),
				end: Joi.extend(JoiDate)
					.date()
					.format('YYYY-MM-DD')
					.greater(Joi.ref('start')),
				employee_ids: Joi.array().items(
					Joi.number().integer().positive().allow(null)
				),
			})
			.with('start', 'end')
			.with('end', 'start'),
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
			date: Joi.extend(JoiDate).date().format('YYYY-MM-DD'),
			employee_id: Joi.number().integer().positive().allow(null),
			reserved_time: Joi.extend(JoiDate).date().format('hh:mm'),
			service_id: Joi.number().integer().positive(),
			phone_number: Joi.string()
				.length(10)
				.pattern(/^[0-9]+$/)
				.allow(null),
			customer_name: Joi.string().trim().min(1).max(60).allow(null),
			notes: Joi.string().trim().min(1).allow(null),
			requested_gender: genderValidation,
			requested_employee: Joi.boolean(),
			cash: Joi.number().positive().precision(2).max(999.99).allow(null),
			machine: Joi.number()
				.positive()
				.precision(2)
				.max(999.99)
				.allow(null),
			vip: Joi.number().positive().precision(2).max(999.99).allow(null),
			tips: Joi.number()
				.positive()
				.precision(3)
				.max(9999.999)
				.allow(null),
			tip_method: tipMethodValidation.allow(null),
			is_completed: Joi.boolean(),
			message: Joi.string().trim().min(1).allow(null),
			updated_by: Joi.string()
				.trim()
				.min(1)
				.max(30)
				.alphanum()
				.required(),
		})
			.min(2)
			.with('customer_name', 'phone_number')
			.with('notes', 'customer_name')
			.with('notes', 'phone_number'),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);

export const AddReservationValidation = celebrate({
	[Segments.BODY]: Joi.object({
		date: Joi.extend(JoiDate).date().format('YYYY-MM-DD').required(),
		employee_id: Joi.number().integer().positive().allow(null).required(),
		reserved_time: Joi.extend(JoiDate).date().format('hh:mm').required(),
		service_id: Joi.number().integer().positive().required(),
		created_by: Joi.string().trim().min(1).max(30).alphanum().required(),
		phone_number: Joi.string()
			.length(10)
			.pattern(/^[0-9]+$/),
		customer_name: Joi.string().trim().min(1).max(60),
		notes: Joi.string().trim().min(1).allow(null),
		requested_gender: genderValidation,
		requested_employee: Joi.boolean(),
		message: Joi.string().trim().min(1).allow(null),
	})
		.with('customer_name', 'phone_number')
		.with('notes', 'customer_name')
		.with('notes', 'phone_number'),
});

export const DeleteReservationValidation = celebrate(
	{
		[Segments.PARAMS]: Joi.object().keys({
			reservation_id: Joi.number().integer().positive().required(),
		}),
	},
	{ abortEarly: false },
	{ mode: Modes.FULL }
);
