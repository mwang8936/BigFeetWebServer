import {
	Between,
	FindOptionsWhere,
	In,
	LessThanOrEqual,
	MoreThanOrEqual,
} from 'typeorm';
import { Schedule } from '../models/schedule.models';
import { VipPackage } from '../models/vip-package.models';
import { Employee } from '../models/employee.models';
import { NotFoundError } from '../exceptions/not-found-error';

export const getSchedules = async (
	fromDate?: string,
	toDate?: string,
	employeeIds?: number[]
) => {
	const whereCondition: FindOptionsWhere<Schedule>[] = [];
	if (fromDate && toDate) {
		whereCondition.push({ date: Between(fromDate, toDate) });
	} else if (fromDate) {
		whereCondition.push({ date: MoreThanOrEqual(fromDate) });
	} else if (toDate) {
		whereCondition.push({ date: LessThanOrEqual(toDate) });
	}
	employeeIds &&
		whereCondition.push({
			employee_id: In(employeeIds),
		});

	return Schedule.find({
		where: whereCondition,
		order: {
			date: 'DESC',
		},
	});
};

export const getSchedule = async (date: string, employeeId: number) => {
	return Schedule.findOne({
		where: {
			date,
			employee_id: employeeId,
		},
	});
};

export const updateSchedule = async (
	date: string,
	employeeId: number,
	isWorking?: boolean,
	start?: Date | null,
	end?: Date | null,
	priority?: number | null,
	vipPackages?: VipPackage[]
) => {
	const schedule = await getSchedule(date, employeeId);

	if (schedule) {
		const updates: Partial<Schedule> = {};

		if (isWorking !== undefined) {
			updates.is_working = isWorking;
		}

		if (start !== undefined) {
			updates.start = start;
		}

		if (end !== undefined) {
			updates.end = end;
		}

		if (priority !== undefined) {
			updates.priority = priority;
		}

		if (vipPackages !== undefined) {
			updates.vip_packages = vipPackages;
		}

		Object.assign(schedule, updates);

		return schedule.save();
	} else {
		return null;
	}
};

export const createSchedule = async (
	date: string,
	employeeId: number,
	isWorking?: boolean,
	start?: Date | null,
	end?: Date | null,
	priority?: number | null,
	vipPackages?: VipPackage[]
) => {
	const employee = await Employee.findOne({
		where: {
			employee_id: employeeId,
		},
	});

	if (!employee) throw new NotFoundError('Employee', 'employee id', employeeId);

	const schedule = Schedule.create({
		date,
		employee,
		is_working: isWorking,
		start,
		end,
		priority,
		vip_packages: vipPackages,
	});

	return await schedule.save();
};

export const deleteSchedule = async (date: string, employeeId: number) => {
	const schedule = await getSchedule(date, employeeId);

	if (schedule) {
		return schedule.remove();
	} else {
		return null;
	}
};
