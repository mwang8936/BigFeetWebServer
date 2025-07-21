import {
	Between,
	FindOptionsWhere,
	In,
	LessThanOrEqual,
	MoreThanOrEqual,
} from 'typeorm';
import { PaymentMethod } from '../models/enums';
import { Schedule } from '../models/schedule.models';
import { VipPackage } from '../models/vip-package.models';
import * as ScheduleServices from './schedule.services';

export const getVipPackages = async (
	start?: { year: number; month: number; day: number },
	end?: { year: number; month: number; day: number },
	employeeIds?: number[]
) => {
	const whereCondition: FindOptionsWhere<Schedule> = {};
	if (start && end) {
		whereCondition.year = Between(start.year, end.year);
		whereCondition.month = Between(start.month, end.month);
		whereCondition.day = Between(start.day, end.day);
	} else if (start) {
		whereCondition.year = MoreThanOrEqual(start.year);
		whereCondition.month = MoreThanOrEqual(start.month);
		whereCondition.day = MoreThanOrEqual(start.day);
	} else if (end) {
		whereCondition.year = LessThanOrEqual(end.year);
		whereCondition.month = LessThanOrEqual(end.month);
		whereCondition.day = LessThanOrEqual(end.day);
	}

	if (employeeIds) {
		whereCondition.employee_id = In(employeeIds);
	}

	return VipPackage.find({
		where: {
			schedules: whereCondition,
		},
		order: {
			serial: 'ASC',
		},
	});
};

export const getVipPackage = async (vipPackageId: number) => {
	return VipPackage.findOne({
		where: {
			vip_package_id: vipPackageId,
		},
	});
};

export const updateVipPackage = async (
	vipPackageId: number,
	serial?: string,
	paymentMethod?: PaymentMethod,
	soldAmount?: number,
	commissionAmount?: number,
	date?: { year: number; month: number; day: number },
	employeeIds?: number[]
) => {
	const vipPackage = await getVipPackage(vipPackageId);

	if (vipPackage) {
		const updates: Partial<VipPackage> = {};

		if (serial !== undefined) {
			updates.serial = serial;
		}

		if (paymentMethod !== undefined) {
			updates.payment_method = paymentMethod;
		}

		if (soldAmount !== undefined) {
			updates.sold_amount = soldAmount;
		}

		if (commissionAmount !== undefined) {
			updates.commission_amount = commissionAmount;
		}

		if (date !== undefined && employeeIds !== undefined) {
			updates.employee_ids = employeeIds;

			const schedules: Schedule[] = [];

			for (const employeeId of employeeIds) {
				let schedule = await ScheduleServices.getSchedule(date, employeeId);

				if (!schedule) {
					schedule = await ScheduleServices.createSchedule(date, employeeId);
				}

				if (schedule) {
					schedules.push(schedule);
				}
			}

			if (
				vipPackage.employee_ids.some((employeeId) =>
					employeeIds.includes(employeeId)
				)
			) {
				vipPackage.schedules = [];

				await vipPackage.save();
			}

			updates.schedules = schedules;
		}

		Object.assign(vipPackage, updates);

		return vipPackage.save();
	} else {
		return null;
	}
};

export const createVipPackage = async (
	serial: string,
	paymentMethod: PaymentMethod,
	soldAmount: number,
	commissionAmount: number,
	date: { year: number; month: number; day: number },
	employeeIds: number[]
) => {
	const schedules: Schedule[] = [];

	for (const employeeId of employeeIds) {
		let schedule = await ScheduleServices.getSchedule(date, employeeId);

		if (!schedule) {
			schedule = await ScheduleServices.createSchedule(date, employeeId);
		}

		if (schedule) {
			schedules.push(schedule);
		}
	}

	const vipPackage = VipPackage.create({
		serial,
		payment_method: paymentMethod,
		sold_amount: soldAmount,
		commission_amount: commissionAmount,
		employee_ids: employeeIds,
		schedules,
	});

	return vipPackage.save();
};

export const deleteVipPackage = async (vipPackageId: number) => {
	const vipPackage = await getVipPackage(vipPackageId);

	if (vipPackage) {
		return vipPackage.remove();
	} else {
		return null;
	}
};
