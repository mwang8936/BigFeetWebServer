import { RequestHandler, Request, Response, NextFunction } from 'express';

import pusher from '../config/pusher.config';

import { HttpCode } from '../exceptions/custom-error';

import * as CustomerServices from '../services/customer.services';
import * as CustomerRecordServices from '../services/customer-record.services';

import {
	add_customer_event,
	CustomerEventMessage,
	customers_channel,
	delete_customer_event,
	recover_customer_event,
	update_customer_event,
} from '../events/customer.events';

import { formatDateToYYYYMMDD } from '../utils/date.utils';

export const getCustomers: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const date: string = req.query.date
			? (req.query.date as string)
			: new Date().toISOString();
		const withDeleted = req.query.with_deleted === 'true';

		const customers = await CustomerServices.getCustomers(
			formatDateToYYYYMMDD(date),
			withDeleted
		);

		res
			.status(HttpCode.OK)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(customers));
	} catch (err) {
		next(err);
	}
};

export const getCustomerRecords: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const date: string = req.query.date
			? (req.query.date as string)
			: new Date().toISOString();

		const customers = await CustomerRecordServices.getCustomerRecords(
			formatDateToYYYYMMDD(date)
		);

		res
			.status(HttpCode.OK)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(customers));
	} catch (err) {
		next(err);
	}
};

export const getCustomer: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const customerId = parseInt(req.params.customer_id);
		const withDeleted = req.query.with_deleted === 'true';
		const withRecords = req.query.with_records === 'true';

		const customer = await CustomerServices.getCustomer(
			customerId,
			withDeleted,
			withRecords
		);

		if (customer) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(customer));
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

export const updateCustomerRecord: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const customerId = parseInt(req.params.customer_id);
		const date = formatDateToYYYYMMDD(req.params.date);

		const customer = await CustomerRecordServices.updateCustomerRecord(
			customerId,
			date,
			req.body.phone_number,
			req.body.vip_serial,
			req.body.customer_name,
			req.body.notes
		);

		if (customer) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(customer));

			const message: CustomerEventMessage = {
				valid_from: customer.valid_from,
				valid_to: customer.valid_to,
				phone_number: customer.phone_number,
				vip_serial: customer.vip_serial,
			};

			pusher.trigger(customers_channel, update_customer_event, message, {
				socket_id: req.body.socket_id,
			});
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

export const addCustomerRecord: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const customerId = parseInt(req.params.customer_id);
		const date = formatDateToYYYYMMDD(req.params.date);

		const customer = await CustomerRecordServices.addCustomerRecord(
			customerId,
			date,
			req.body.phone_number,
			req.body.vip_serial,
			req.body.customer_name,
			req.body.notes
		);

		if (customer) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(customer));

			const message: CustomerEventMessage = {
				valid_from: customer.valid_from,
				valid_to: customer.valid_to,
				phone_number: customer.phone_number,
				vip_serial: customer.vip_serial,
			};

			pusher.trigger(customers_channel, update_customer_event, message, {
				socket_id: req.body.socket_id,
			});
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

export const addCustomer: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const date = formatDateToYYYYMMDD(req.params.date);

		const customer = await CustomerServices.createCustomer(
			date,
			req.body.phone_number,
			req.body.vip_serial,
			req.body.customer_name,
			req.body.notes
		);

		res
			.status(HttpCode.CREATED)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(customer));

		const message: CustomerEventMessage = {
			valid_from: customer.valid_from,
			phone_number: customer.phone_number,
			vip_serial: customer.vip_serial,
		};

		pusher.trigger(customers_channel, add_customer_event, message, {
			socket_id: req.body.socket_id,
		});
	} catch (err) {
		next(err);
	}
};

export const deleteCustomer: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const customerId = parseInt(req.params.customer_id);

		const customer = await CustomerServices.deleteCustomer(customerId);

		if (customer) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(customer));

			const message: CustomerEventMessage = {
				phone_number: customer.phone_number,
				vip_serial: customer.vip_serial,
			};

			pusher.trigger(customers_channel, delete_customer_event, message, {
				socket_id: req.body.socket_id,
			});
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

export const recoverCustomer: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const customerId = parseInt(req.params.customer_id);

		const customer = await CustomerServices.recoverCustomer(customerId);

		if (customer) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(customer));

			const message: CustomerEventMessage = {
				phone_number: customer.phone_number,
				vip_serial: customer.vip_serial,
			};

			pusher.trigger(customers_channel, recover_customer_event, message, {
				socket_id: req.body.socket_id,
			});
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
