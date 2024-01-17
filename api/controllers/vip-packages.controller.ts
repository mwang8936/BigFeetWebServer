import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as VipPackagesServices from '../services/vip-package.services';
import { setTimeToZero } from '../utils/date.utils';

export const getVipPackages: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const vipPackages = await VipPackagesServices.getVipPackages();

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
		const vipPackage = await VipPackagesServices.getVipPackage(
			req.params.serial
		);

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
		const schedules: { date: Date; employee_id: number }[] = req.body.schedules;
		schedules.forEach(
			(schedule) => (schedule.date = setTimeToZero(schedule.date))
		);

		const updated = await VipPackagesServices.updateVipPackage(
			req.params.serial,
			req.body.amount,
			schedules
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

export const addVipPackage: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const schedules: { date: Date; employee_id: number }[] = req.body.schedules;
		schedules.forEach(
			(schedule) => (schedule.date = setTimeToZero(schedule.date))
		);

		const vipPackage = await VipPackagesServices.createVipPackage(
			req.body.serial,
			req.body.amount,
			schedules
		);

		res
			.status(HttpCode.CREATED)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(vipPackage));
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
		const updated = await VipPackagesServices.deleteVipPackage(
			req.params.serial
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
