import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as VipPackagesServices from '../services/vip-package.services';
import {
	convertDateToYearMonthDayObject,
	formatDateToYYYYMMDD,
} from '../utils/date.utils';
import pusher from '../config/pusher.config';
import {
	add_vip_package_event,
	delete_vip_package_event,
	update_vip_package_event,
	VipPackageEventMessage,
} from '../events/vip-package.events';
import { schedules_channel } from '../events/schedule.events';
import { VipPackage } from '../models/vip-package.models';

const sendPusherEvent = async (
	vipPackage: VipPackage,
	event: string,
	socketID: string | undefined
) => {
	if (socketID) {
		const message: VipPackageEventMessage = {
			employee_ids: vipPackage.employee_ids,
			serial: vipPackage.serial,
		};

		try {
			pusher.trigger(schedules_channel, event, message, {
				socket_id: socketID,
			});
		} catch (err) {
			if (
				err instanceof Error &&
				(err.message?.includes('Invalid socket id') ||
					err.message?.includes('Invalid channel name'))
			) {
				console.error(err.message);
			}
		}
	}
};

export const getVipPackages: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const start: { year: number; month: number; day: number } | undefined = req
			.query.start
			? convertDateToYearMonthDayObject(req.query.start as string)
			: undefined;
		const end: { year: number; month: number; day: number } | undefined = req
			.query.end
			? convertDateToYearMonthDayObject(req.query.end as string)
			: undefined;
		const employeeIds: number[] | undefined = (req.query
			.employee_ids as string[])
			? (req.query.employee_ids as string[]).map((employee_id) =>
					parseInt(employee_id)
			  )
			: undefined;

		const vipPackages = await VipPackagesServices.getVipPackages(
			start,
			end,
			employeeIds
		);

		res
			.status(HttpCode.OK)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(vipPackages));
	} catch (err) {
		next(err);
	}
};

export const getVipPackage: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const vipPackageId = parseInt(req.params.vip_package_id);

		const vipPackage = await VipPackagesServices.getVipPackage(vipPackageId);

		if (vipPackage) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(vipPackage));
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

export const updateVipPackage: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const vipPackageId = parseInt(req.params.vip_package_id);

		const vipPackage = await VipPackagesServices.updateVipPackage(
			vipPackageId,
			req.body.serial,
			req.body.payment_method,
			req.body.sold_amount,
			req.body.commission_amount,
			req.body.date
				? convertDateToYearMonthDayObject(req.body.date)
				: undefined,
			req.body.employee_ids
		);

		if (vipPackage) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(vipPackage));

			sendPusherEvent(
				vipPackage,
				update_vip_package_event,
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

export const addVipPackage: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const vipPackage = await VipPackagesServices.createVipPackage(
			req.body.serial,
			req.body.payment_method,
			req.body.sold_amount,
			req.body.commission_amount,
			convertDateToYearMonthDayObject(req.body.date),
			req.body.employee_ids
		);

		res
			.status(HttpCode.CREATED)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(vipPackage));

		sendPusherEvent(
			vipPackage,
			add_vip_package_event,
			req.headers['x-socket-id'] as string | undefined
		);
	} catch (err) {
		next(err);
	}
};

export const deleteVipPackage: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const vipPackageId = parseInt(req.params.vip_package_id);

		const vipPackage = await VipPackagesServices.deleteVipPackage(vipPackageId);

		if (vipPackage) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(vipPackage));

			sendPusherEvent(
				vipPackage,
				delete_vip_package_event,
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
