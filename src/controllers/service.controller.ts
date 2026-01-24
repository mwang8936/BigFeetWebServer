import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as ServiceServices from '../services/service.services';
import pusher from '../config/pusher.config';
import {
	add_service_event,
	delete_service_event,
	recover_service_event,
	ServiceEventMessage,
	services_channel,
	update_service_event,
} from '../events/service.events';
import { Service } from '../models/service.models';

const sendPusherEvent = async (
	service: Service,
	event: string,
	socketID: string | undefined
) => {
	if (socketID) {
		const message: ServiceEventMessage = {
			service_name: service.service_name,
		};

		try {
			await pusher.trigger(services_channel, event, message, {
				socket_id: socketID,
			});
		} catch (err) {
			if (err instanceof Error) {
				console.error('Pusher error:', err.message);
			}
		}
	}
};

export const getServices: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const withDeleted = req.query.with_deleted === 'true';

		const services = await ServiceServices.getServices(withDeleted);

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
		const withDeleted = req.query.with_deleted === 'true';

		const service = await ServiceServices.getService(serviceId, withDeleted);

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

		const service = await ServiceServices.updateService(
			serviceId,
			req.body.service_name,
			req.body.shorthand,
			req.body.time,
			req.body.money,
			req.body.body,
			req.body.feet,
			req.body.acupuncture,
			req.body.beds_required,
			req.body.color
		);

		if (service) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(service));

			sendPusherEvent(
				service,
				update_service_event,
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
			req.body.beds_required,
			req.body.color,
			req.body.body,
			req.body.feet,
			req.body.acupuncture
		);

		res
			.status(HttpCode.CREATED)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(service));

		sendPusherEvent(
			service,
			add_service_event,
			req.headers['x-socket-id'] as string | undefined
		);
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

		const service = await ServiceServices.deleteService(serviceId);

		if (service) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(service));

			sendPusherEvent(
				service,
				delete_service_event,
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

export const recoverService: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const serviceId = parseInt(req.params.service_id);

		const service = await ServiceServices.recoverService(serviceId);

		if (service) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(service));

			sendPusherEvent(
				service,
				recover_service_event,
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
