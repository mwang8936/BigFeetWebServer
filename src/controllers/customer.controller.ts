import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as CustomerServices from '../services/customer.services';
import pusher from '../config/pusher.config';
import {
	add_customer_event,
	customers_channel,
	delete_customer_event,
	recover_customer_event,
	update_customer_event,
} from '../events/customer.events';

export const getCustomers: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const withDeleted = req.query.with_deleted === 'true';

		const customers = await CustomerServices.getCustomers(withDeleted);

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

		const customer = await CustomerServices.getCustomer(
			customerId,
			withDeleted
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

			pusher.trigger(customers_channel, update_customer_event, customer, {
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

		pusher.trigger(customers_channel, add_customer_event, customer, {
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

			pusher.trigger(customers_channel, delete_customer_event, customer, {
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

			pusher.trigger(customers_channel, recover_customer_event, customer, {
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
