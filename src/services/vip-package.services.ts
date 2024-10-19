import AppDataSource from '../config/orm.config';

import * as ScheduleServices from './schedule.services';

import { PaymentMethod } from '../models/enums';
import { Schedule } from '../models/schedule.models';
import { VipPackage } from '../models/vip-package.models';

export const getVipPackages = async (
	start?: { year: number; month: number; day: number },
	end?: { year: number; month: number; day: number },
	employeeIds?: number[]
) => {
	const vipPackagesRepository = AppDataSource.getRepository(VipPackage);

	const queryBuilder = vipPackagesRepository
		.createQueryBuilder('vip_packages_sold')
		.leftJoinAndSelect('vip_packages_sold.schedules', 'schedules');

	if (start) {
		queryBuilder.andWhere(
			`MAKE_DATE(schedules.year, schedules.month, schedules.day) >= MAKE_DATE(:startYear, :startMonth, :startDay)`,
			{ startYear: start.year, startMonth: start.month, startDay: start.day }
		);
	}

	if (end) {
		queryBuilder.andWhere(
			`MAKE_DATE(schedules.year, schedules.month, schedules.day) <= MAKE_DATE(:endYear, :endMonth, :endDay)`,
			{ endYear: end.year, endMonth: end.month, endDay: end.day }
		);
	}

	if (employeeIds) {
		queryBuilder.andWhere('schedules.employee_id IN (:...employeeIds)', {
			employeeIds,
		});
	}

	queryBuilder.orderBy('vip_packages_sold.serial', 'ASC');

	return queryBuilder.getMany();
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
