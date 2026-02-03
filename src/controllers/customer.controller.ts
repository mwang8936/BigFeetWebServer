import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as CustomerServices from '../services/customer.services';
import pusher from '../config/pusher.config';
import {
	add_customer_event,
	CustomerEventMessage,
	customers_channel,
	delete_customer_event,
	recover_customer_event,
	update_customer_event,
} from '../events/customer.events';
import { Customer } from '../models/customer.models';

const sendPusherEvent = async (
	customer: Customer,
	event: string,
	socketID: string | undefined
) => {
	if (socketID) {
		const message: CustomerEventMessage = {
			phone_number: customer.phone_number,
			vip_serial: customer.vip_serial,
		};

		try {
			await pusher.trigger(customers_channel, event, message, {
				socket_id: socketID,
			});
		} catch (err) {
			if (err instanceof Error) {
				console.error('Pusher error:', err.message);
			}
		}
	}
};

export const getCustomers: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const page = req.query.page ? parseInt(req.query.page as string) : undefined;
		const pageSize = req.query.page_size
			? parseInt(req.query.page_size as string)
			: undefined;
		const search = req.query.search as string | undefined;
		const withDeleted = req.query.with_deleted === 'true';

		const result = await CustomerServices.getCustomers({
			page,
			pageSize,
			search,
			withDeleted,
		});

		res
			.status(HttpCode.OK)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(result));
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

		const customer = await CustomerServices.getCustomer({
			customerId,
			withDeleted,
		});

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

export const searchCustomer: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const phoneNumber = req.query.phone_number as string | undefined;
		const vipSerial = req.query.vip_serial as string | undefined;
		const withDeleted = req.query.with_deleted === 'true';

		const customer = await CustomerServices.getCustomer({
			phoneNumber,
			vipSerial,
			withDeleted,
		});

		res
			.status(HttpCode.OK)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(customer));
	} catch (err) {
		next(err);
	}
};

export const updateCustomer: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const customerId = parseInt(req.params.customer_id);

		const customer = await CustomerServices.updateCustomer(
			customerId,
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

			sendPusherEvent(
				customer,
				update_customer_event,
				req.headers['x-socket-id'] as string | undefined
			);
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
		const customer = await CustomerServices.createCustomer(
			req.body.phone_number,
			req.body.vip_serial,
			req.body.customer_name,
			req.body.notes
		);

		res
			.status(HttpCode.CREATED)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(customer));

		sendPusherEvent(
			customer,
			add_customer_event,
			req.headers['x-socket-id'] as string | undefined
		);
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

			sendPusherEvent(
				customer,
				delete_customer_event,
				req.headers['x-socket-id'] as string | undefined
			);
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

			sendPusherEvent(
				customer,
				recover_customer_event,
				req.headers['x-socket-id'] as string | undefined
			);
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
