import { RequestHandler, Request, Response, NextFunction } from 'express';

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

		pusher.trigger(services_channel, event, message, {
			socket_id: socketID,
		});
	}
};

import { HttpCode } from '../exceptions/custom-error';

import * as ServiceServices from '../services/service.services';
import * as ServiceRecordServices from '../services/service-record.services';

import { formatDateToYYYYMMDD } from '../utils/date.utils';

export const getServices: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const withDeleted = Boolean(req.query.with_deleted);
		const withRelations = Boolean(req.query.with_relations);

		const services = await ServiceServices.getServices(
			withDeleted,
			withRelations
		);

		res
			.status(HttpCode.OK)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(services));
	} catch (err) {
		next(err);
	}
};

export const getServiceRecords: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const date = formatDateToYYYYMMDD(req.params.date);

		const serviceRecords = await ServiceRecordServices.getServiceRecordsByDate(
			date
		);

		res
			.status(HttpCode.OK)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(serviceRecords));
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
		const withDeleted = Boolean(req.query.with_deleted);
		const withRelations = Boolean(req.query.with_relations);

		const service = await ServiceServices.getService(
			serviceId,
			withDeleted,
			withRelations
		);

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
		const date = formatDateToYYYYMMDD(req.body.date);

		const service = await ServiceServices.createService(
			date,
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

export const addServiceRecord: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const serviceId = parseInt(req.params.service_id);
		const date = formatDateToYYYYMMDD(req.body.date);

		const service = await ServiceRecordServices.addServiceRecord(
			serviceId,
			date,
			req.body.time,
			req.body.money,
			req.body.beds_required,
			req.body.body,
			req.body.feet,
			req.body.acupuncture
		);

		if (service) {
			res
				.status(HttpCode.CREATED)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(service));

			const message: ServiceEventMessage = {
				service_name: service.service_name,
			};

			pusher.trigger(services_channel, update_service_event, message, {
				socket_id: req.body.socket_id,
			});
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

export const continueService: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const serviceId = parseInt(req.params.service_id);

		const serviceRecord = await ServiceRecordServices.continueService(
			serviceId
		);

		if (serviceRecord) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(serviceRecord));

			const message: ServiceEventMessage = {
				service_name: serviceRecord.service_name,
			};

			pusher.trigger(services_channel, update_service_event, message, {
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

export const disContinueService: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const serviceId = parseInt(req.params.service_id);
		const date = formatDateToYYYYMMDD(req.body.date);

		const serviceRecord = await ServiceRecordServices.discontinueService(
			serviceId,
			date
		);

		if (serviceRecord) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(serviceRecord));

			const message: ServiceEventMessage = {
				service_name: serviceRecord.service_name,
			};

			pusher.trigger(services_channel, update_service_event, message, {
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

export const deleteService: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const serviceId = parseInt(req.params.service_id);
		const discontinueService = Boolean(req.query.discontinue_service);

		const service = await ServiceServices.deleteService(
			serviceId,
			discontinueService
		);

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

export const deleteServiceRecord: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const serviceId = parseInt(req.params.service_id);
		const validFrom = formatDateToYYYYMMDD(req.params.valid_from);

		const serviceRecord = await ServiceRecordServices.deleteServiceRecord(
			serviceId,
			validFrom
		);

		if (serviceRecord) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(serviceRecord));

			const message: ServiceEventMessage = {
				service_name: serviceRecord.service_name,
			};

			pusher.trigger(services_channel, update_service_event, message, {
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

export const recoverService: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const serviceId = parseInt(req.params.service_id);
		const continueService = Boolean(req.query.continue_service);

		const service = await ServiceServices.recoverService(
			serviceId,
			continueService
		);

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
