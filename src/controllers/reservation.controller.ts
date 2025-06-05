import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as EmployeeServices from '../services/employee.services';
import * as ReservationServices from '../services/reservation.services';
import {
	convertDateToYearMonthDayObject,
	formatDateToYYYYMMDD,
	validateDateTimeString,
} from '../utils/date.utils';
import pusher from '../config/pusher.config';
import {
	add_reservation_event,
	delete_reservation_event,
	ReservationEventMessage,
	update_reservation_event,
} from '../events/reservation.events';
import { schedules_channel } from '../events/schedule.events';
import { Reservation } from '../models/reservation.models';

const sendPusherEvent = async (
	reservation: Reservation,
	event: string,
	customersUpdate: boolean,
	socketID: string | undefined
) => {
	if (
		socketID &&
		formatDateToYYYYMMDD(reservation.reserved_date.toISOString()) ===
			formatDateToYYYYMMDD(new Date().toISOString())
	) {
		const employee = await EmployeeServices.getEmployee(
			reservation.employee_id
		);

		const message: ReservationEventMessage = {
			time: reservation.reserved_date.toLocaleTimeString('en-US', {
				timeZone: 'America/Los_Angeles',
				hour12: true,
				hour: '2-digit',
				minute: '2-digit',
			}),
			employee_id: reservation.employee_id,
			username: employee?.username ?? 'Employee Not Found',
			created_by: reservation.updated_by,
			update_customers: customersUpdate,
		};

		pusher.trigger(schedules_channel, event, message, {
			socket_id: socketID,
		});
	}
};

export const getReservations: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const start: Date | undefined = validateDateTimeString(
			req.query.start as string | undefined
		);
		const end: Date | undefined = validateDateTimeString(
			req.query.end as string | undefined
		);
		const employeeIds: number[] | undefined = (req.query
			.employee_ids as string[])
			? (req.query.employee_ids as string[]).map((employee_id) =>
					parseInt(employee_id)
			  )
			: undefined;

		const reservations = await ReservationServices.getReservations(
			start,
			end,
			employeeIds
		);

		res
			.status(HttpCode.OK)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(reservations));
	} catch (err) {
		next(err);
	}
};

export const getReservation: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const reservationId = parseInt(req.params.reservation_id);

		const reservation = await ReservationServices.getReservation(reservationId);

		if (reservation) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(reservation));
		} else {
			res
				.status(HttpCode.NOT_FOUND)
				.header('Content-Type', 'application/json')
				.send();
		}
	} catch (err) {
		next(err);
	}
};

export const updateReservation: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const reservationId = parseInt(req.params.reservation_id);

		const reservedDate: Date | undefined = validateDateTimeString(
			req.body.reserved_date
		);
		const date: { year: number; month: number; day: number } | undefined =
			reservedDate
				? convertDateToYearMonthDayObject(req.body.reserved_date)
				: undefined;
		const employeeId: number | undefined = req.body.employee_id;
		const serviceId: number | undefined = req.body.service_id;
		const customerId: number | null | undefined = req.body.customer_id;

		const reservation = await ReservationServices.updateReservation(
			reservationId,
			req.body.updated_by,
			reservedDate,
			date,
			employeeId,
			serviceId,
			req.body.time,
			req.body.beds_required,
			customerId,
			req.body.phone_number,
			req.body.vip_serial,
			req.body.customer_name,
			req.body.notes,
			req.body.requested_gender,
			req.body.requested_employee,
			req.body.cash,
			req.body.machine,
			req.body.vip,
			req.body.gift_card,
			req.body.insurance,
			req.body.cash_out,
			req.body.tips,
			req.body.tip_method,
			req.body.message
		);

		if (reservation) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(reservation));

			const customersUpdate =
				req.body.phone_number !== undefined ||
				req.body.vip_serial !== undefined ||
				req.body.customer_name !== undefined ||
				req.body.notes !== undefined;

			sendPusherEvent(
				reservation,
				update_reservation_event,
				customersUpdate,
				req.headers['x-socket-id'] as string | undefined
			);
		} else {
			res
				.status(HttpCode.NOT_MODIFIED)
				.header('Content-Type', 'application/json')
				.send();
		}
	} catch (err) {
		next(err);
	}
};

export const addReservation: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const reservedDate = new Date(req.body.reserved_date);
		const date = convertDateToYearMonthDayObject(req.body.reserved_date);
		const employeeId: number = req.body.employee_id;
		const serviceId: number = req.body.service_id;
		const customerId: number | null | undefined = req.body.customer_id;

		const reservation = await ReservationServices.createReservation(
			reservedDate,
			date,
			employeeId,
			serviceId,
			req.body.created_by,
			req.body.time,
			req.body.beds_required,
			customerId,
			req.body.phone_number,
			req.body.vip_serial,
			req.body.customer_name,
			req.body.notes,
			req.body.requested_gender,
			req.body.requested_employee,
			req.body.message
		);

		res
			.status(HttpCode.CREATED)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(reservation));

		const customersUpdate =
			req.body.phone_number !== undefined ||
			req.body.vip_serial !== undefined ||
			req.body.customer_name !== undefined ||
			req.body.notes !== undefined;

		sendPusherEvent(
			reservation,
			add_reservation_event,
			customersUpdate,
			req.headers['x-socket-id'] as string | undefined
		);
	} catch (err) {
		next(err);
	}
};

export const deleteReservation: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const reservationId = parseInt(req.params.reservation_id);

		const reservation = await ReservationServices.deleteReservation(
			reservationId
		);

		if (reservation) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(reservation));

			sendPusherEvent(
				reservation,
				delete_reservation_event,
				false,
				req.headers['x-socket-id'] as string | undefined
			);
		} else {
			res
				.status(HttpCode.NOT_MODIFIED)
				.header('Content-Type', 'application/json')
				.send();
		}
	} catch (err) {
		next(err);
	}
};
