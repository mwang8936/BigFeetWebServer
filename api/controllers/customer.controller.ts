import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as CustomerServices from '../services/customer.services';

export const getCustomers: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const customers = await CustomerServices.getCustomers();

		res.status(HttpCode.OK)
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
		const phoneNumber = req.params.phone_number;

		const customer = await CustomerServices.getCustomer(phoneNumber);

		if (customer) {
			res.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(customer));
		} else {
			res.status(HttpCode.NOT_FOUND)
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
		const phoneNumber = req.params.phone_number;

		const updated = await CustomerServices.updateCustomer(
			phoneNumber,
			req.body.customer_name,
			req.body.notes
		);

		if (!updated.affected) {
			res.status(HttpCode.NOT_MODIFIED)
				.header('Content-Type', 'application/json')
				.send();
		} else {
			res.status(HttpCode.NO_CONTENT)
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
			req.body.customer_name,
			req.body.notes
		);

		res.status(HttpCode.CREATED)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(customer));
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
		const phoneNumber = req.params.phone_number;

		const updated = await CustomerServices.deleteCustomer(phoneNumber);

		if (!updated.affected) {
			res.status(HttpCode.NOT_MODIFIED)
				.header('Content-Type', 'application/json')
				.send();
		} else {
			res.status(HttpCode.NO_CONTENT)
				.header('Content-Type', 'application/json')
				.send();
		}
	} catch (err) {
		next(err);
	}
};
