import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as ServiceServices from '../services/service.services';

export const getServices: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const services = await ServiceServices.getServices();

		res
			.status(HttpCode.OK)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(services));
	} catch (err) {
		next(err);
	}
};

export const getService: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const serviceId = parseInt(req.params.service_id);

		const service = await ServiceServices.getService(serviceId);

		if (service) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(service));
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

export const updateService: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const serviceId = parseInt(req.params.service_id);

		const updated = await ServiceServices.updateService(
			serviceId,
			req.body.service_name,
			req.body.shorthand,
			req.body.time,
			req.body.money,
			req.body.body,
			req.body.feet,
			req.body.acupuncture,
			req.body.color
		);

		if (!updated.affected) {
			res
				.status(HttpCode.NOT_MODIFIED)
				.header('Content-Type', 'application/json')
				.send();
		} else {
			res
				.status(HttpCode.NO_CONTENT)
				.header('Content-Type', 'application/json')
				.send();
		}
	} catch (err) {
		next(err);
	}
};

export const addService: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const service = await ServiceServices.createService(
			req.body.service_name,
			req.body.shorthand,
			req.body.time,
			req.body.money,
			req.body.color,
			req.body.body,
			req.body.feet,
			req.body.acupuncture
		);

		res
			.status(HttpCode.CREATED)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(service));
	} catch (err) {
		next(err);
	}
};

export const deleteService: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const serviceId = parseInt(req.params.service_id);

		const updated = await ServiceServices.deleteService(serviceId);

		if (!updated.affected) {
			res
				.status(HttpCode.NOT_MODIFIED)
				.header('Content-Type', 'application/json')
				.send();
		} else {
			res
				.status(HttpCode.NO_CONTENT)
				.header('Content-Type', 'application/json')
				.send();
		}
	} catch (err) {
		next(err);
	}
};
