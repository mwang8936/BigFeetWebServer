import {
	Between,
	FindOptionsWhere,
	In,
	LessThanOrEqual,
	MoreThanOrEqual,
} from 'typeorm';
import { DuplicateIdentifierError } from '../exceptions/duplicate-identifier-error';
import { Schedule } from '../models/schedule.models';
import { VipPackage } from '../models/vip-package.models';
import * as ScheduleServices from './schedule.services';

export const getVipPackages = async (
	start?: string,
	end?: string,
	employeeIds?: number[]
) => {
	const whereCondition: FindOptionsWhere<Schedule>[] = [];
	if (start && end) {
		whereCondition.push({ date: Between(start, end) });
	} else if (start) {
		whereCondition.push({ date: MoreThanOrEqual(start) });
	} else if (end) {
		whereCondition.push({ date: LessThanOrEqual(end) });
	}
	employeeIds &&
		whereCondition.push({
			employee_id: In(employeeIds),
		});

	return VipPackage.find({
		where: {
			schedules: whereCondition,
		},
	});
};

export const getVipPackage = async (serial: string) => {
	return VipPackage.findOne({
		where: {
			serial,
		},
	});
};

export const updateVipPackage = async (
	serial: string,
	soldAmount?: number,
	commissionAmount?: number,
	date?: string,
	employeeIds?: number[]
) => {
	const vipPackage = await getVipPackage(serial);

	if (vipPackage) {
		const updates: Partial<VipPackage> = {};

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
	soldAmount: number,
	commissionAmount: number,
	date: string,
	employeeIds: number[]
) => {
	await duplicateSerialChecker(serial);

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
		sold_amount: soldAmount,
		commission_amount: commissionAmount,
		employee_ids: employeeIds,
		schedules,
	});

	return vipPackage.save();
};

export const deleteVipPackage = async (serial: string) => {
	const vipPackage = await getVipPackage(serial);

	if (vipPackage) {
		return vipPackage.remove();
	} else {
		return null;
	}
};

const duplicateSerialChecker = async (serial: string) => {
	const duplicates = await VipPackage.find({
		where: {
			serial,
		},
	});

	if (duplicates.length > 0) {
		throw new DuplicateIdentifierError('VIP Package', 'Serial', serial);
	}
};
