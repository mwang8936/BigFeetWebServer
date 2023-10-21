import {
	FindOptionsWhere,
	In,
	IsNull,
	LessThanOrEqual,
	MoreThanOrEqual,
} from 'typeorm';
import { Schedule } from '../models/schedule.models';
import { VipPackage } from '../models/vip-package.models';

export const getSchedules = async (
	fromDate?: Date,
	toDate?: Date,
	employeeIds?: (number | null)[]
) => {
	const whereCondition: FindOptionsWhere<Schedule>[] = [];
	fromDate && whereCondition.push({ date: MoreThanOrEqual(fromDate) });
	toDate && whereCondition.push({ date: LessThanOrEqual(toDate) });
	employeeIds &&
		whereCondition.push({
			employee: {
				employee_id: In(employeeIds),
			},
		});

	return await Schedule.find({
		where: whereCondition,
		order: {
			date: 'DESC',
		},
	});
};

export const getSchedule = async (date: Date, employeeId: number | null) => {
	return await Schedule.findOne({
		where: {
			date,
			employee: {
				employee_id: employeeId == null ? IsNull() : employeeId,
			},
		},
	});
};

export const updateSchedule = async (
	date: Date,
	employeeId: number | null,
	isWorking?: boolean,
	start?: Date | null,
	end?: Date | null,
	vipPackages?: VipPackage[] | null,
	signed?: boolean
) => {
	const schedule = Schedule.create({
		is_working: isWorking,
		start,
		end,
		vip_packages: vipPackages,
		signed,
	});

	return await Schedule.update(
		{
			date,
			employee:
				employeeId == null
					? IsNull()
					: {
							employee_id: employeeId,
					  },
		},
		schedule
	);
};

export const createSchedule = async (date: Date, employeeId: number | null) => {
	const schedule = Schedule.create({
		date,
		employee:
			employeeId == null
				? null
				: {
						employee_id: employeeId,
				  },
	});

	return await schedule.save();
};

export const deleteSchedule = async (date: Date, employeeId: number | null) => {
	return await Schedule.delete({
		date,
		employee:
			employeeId == null
				? IsNull()
				: {
						employee_id: employeeId,
				  },
	});
};
