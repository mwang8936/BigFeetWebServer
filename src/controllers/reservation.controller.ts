import { RequestHandler, Request, Response, NextFunction } from 'express';
import Expo from 'expo-server-sdk';
import i18next from 'i18next';
import { HttpCode } from '../exceptions/custom-error';
import * as DeviceServices from '../services/device.services';
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
import Logger from '../utils/logger.utils';
import { Employee } from '../models/employee.models';
import { Language } from '../models/enums';

const expo = new Expo();

const sendPushNotification = async (
	reservation: Reservation,
	event: string,
	language: string = 'en'
) => {
	const t = i18next.getFixedT(language);

	const getNotificationMessage = (reservation: Reservation, event: string) => {
		const serviceName = reservation.service.service_name;
		const time = reservation.reserved_date.toLocaleTimeString('en-US', {
			timeZone: 'America/Los_Angeles',
			hour12: true,
			hour: '2-digit',
			minute: '2-digit',
		});

		switch (event) {
			case add_reservation_event:
				return t('Reservation Added', { serviceName, time });
			case delete_reservation_event:
				return t('Reservation Deleted', { serviceName, time });
			case update_reservation_event:
			default:
				return t('Reservation Updated', { serviceName, time });
		}
	};

	const title = t('Reservation Alert');
	const body = getNotificationMessage(reservation, event);
	const messages = [];
	const devices = await DeviceServices.getDevices(
		[reservation.employee_id],
		true
	);

	for (const device of devices) {
		const pushToken = device.push_token;
		if (!Expo.isExpoPushToken(pushToken)) {
			Logger.error(
				`Push token ${pushToken} is not a valid Expo push token for device ${device.device_id}`
			);
			continue;
		}

		messages.push({
			to: pushToken,
			title,
			body,
			data: { reservation },
			sound: 'default',
		});
	}

	const chunks = expo.chunkPushNotifications(messages);
	for (const chunk of chunks) {
		try {
			await expo.sendPushNotificationsAsync(chunk);
		} catch (error) {
			Logger.error('Error sending push notification:', error);
		}
	}
};

const sendPusherEvent = async (
	reservation: Reservation,
	employee: Employee | null,
	event: string,
	customersUpdate: boolean,
	socketID: string | undefined
) => {
	if (socketID) {
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

const isCurrentDate = (reservation: Reservation): boolean => {
	return (
		formatDateToYYYYMMDD(reservation.reserved_date.toISOString()) ===
		formatDateToYYYYMMDD(new Date().toISOString())
	);
};

const sendEvents = async (
	reservation: Reservation,
	event: string,
	customersUpdate: boolean,
	socketID: string | undefined
) => {
	if (isCurrentDate(reservation)) {
		const employee = await EmployeeServices.getEmployee(
			reservation.employee_id
		);
		sendPusherEvent(reservation, employee, event, customersUpdate, socketID);

		let language = 'en';
		switch (employee?.language) {
			case Language.SIMPLIFIED_CHINESE:
				language = 'cn_simp';
				break;
			case Language.TRADITIONAL_CHINESE:
				language = 'cn_trad';
				break;
		}

		sendPushNotification(reservation, event, language);
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

			sendEvents(
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

		sendEvents(
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

			sendEvents(
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
