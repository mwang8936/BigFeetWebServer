import {
	Between,
	FindOptionsWhere,
	In,
	LessThanOrEqual,
	MoreThanOrEqual,
} from 'typeorm';
import { Schedule } from '../models/schedule.models';
import { VipPackage } from '../models/vip-package.models';

export const getSchedules = async (
	fromDate?: Date,
	toDate?: Date,
	employeeIds?: number[]
) => {
	const whereCondition: FindOptionsWhere<Schedule>[] = [];
	if (fromDate && toDate) {
		whereCondition.push({ date: Between(fromDate, toDate) });
	} else if (fromDate) {
		whereCondition.push({ date: MoreThanOrEqual(fromDate) });
	} else if (toDate) {
		toDate && whereCondition.push({ date: LessThanOrEqual(toDate) });
	}
	employeeIds &&
		whereCondition.push({
			employee_id: In(employeeIds),
		});

	return await Schedule.find({
		where: whereCondition,
		order: {
			date: 'DESC',
		},
	});
};

export const getSchedule = async (date: Date, employeeId: number) => {
	return await Schedule.findOne({
		where: {
			date,
			employee_id: employeeId,
		},
	});
};

export const updateSchedule = async (
	date: Date,
	employeeId: number,
	isWorking?: boolean,
	start?: Date | null,
	end?: Date | null,
	vipPackages?: VipPackage[]
) => {
	const schedule = Schedule.create({
		is_working: isWorking,
		start,
		end,
		vip_packages: vipPackages,
	});

	return await Schedule.update(
		{
			date,
			employee_id: employeeId,
		},
		schedule
	);
};

export const createSchedule = async (
	date: Date,
	employeeId: number,
	isWorking?: boolean,
	start?: Date | null,
	end?: Date | null,
	vipPackages?: VipPackage[]
) => {
	const schedule = Schedule.create({
		date,
		employee_id: employeeId,
		is_working: isWorking,
		start,
		end,
		vip_packages: vipPackages,
	});

	return await schedule.save();
};

export const deleteSchedule = async (date: Date, employeeId: number) => {
	return await Schedule.delete({
		date,
		employee_id: employeeId,
	});
};
