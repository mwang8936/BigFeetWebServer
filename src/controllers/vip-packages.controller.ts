import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as VipPackagesServices from '../services/vip-package.services';
import { formatDateToYYYYMMDD } from '../utils/date.utils';

export const getVipPackages: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const start: string | undefined = req.query.start
			? formatDateToYYYYMMDD(req.query.start as string)
			: undefined;
		const end: string | undefined = req.query.end
			? formatDateToYYYYMMDD(req.query.end as string)
			: undefined;
		const employeeIds: number[] | undefined = (req.query
			.employee_ids as string[])
			? (req.query.employee_ids as string[]).map((employee_id) =>
					parseInt(employee_id)
			  )
			: undefined;

		const vipPackages = await VipPackagesServices.getVipPackages(
			start as string | undefined,
			end as string | undefined,
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
		const vipPackage = await VipPackagesServices.updateVipPackage(
			req.params.serial,
			req.body.sold_amount,
			req.body.commission_amount,
			req.body.date ? formatDateToYYYYMMDD(req.body.date) : undefined,
			req.body.employee_ids
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

export const addVipPackage: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const vipPackage = await VipPackagesServices.createVipPackage(
			req.body.serial,
			req.body.sold_amount,
			req.body.commission_amount,
			formatDateToYYYYMMDD(req.body.date),
			req.body.employee_ids
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
		const vipPackage = await VipPackagesServices.deleteVipPackage(
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