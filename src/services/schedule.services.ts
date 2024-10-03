import {
	Between,
	FindOptionsWhere,
	In,
	LessThanOrEqual,
	MoreThanOrEqual,
} from 'typeorm';
import { Schedule } from '../models/schedule.models';
import { Employee } from '../models/employee.models';
import { NotFoundError } from '../exceptions/not-found-error';

export const getSchedules = async (
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

	return Schedule.find({
		where: whereCondition,
		order: {
			year: 'ASC',
			month: 'ASC',
			day: 'ASC',
			employee_id: 'ASC',
		},
	});
};

export const getSchedule = async (
	date: { year: number; month: number; day: number },
	employeeId: number
) => {
	return Schedule.findOne({
		where: {
			year: date.year,
			month: date.month,
			day: date.day,
			employee_id: employeeId,
		},
	});
};

export const updateSchedule = async (
	date: { year: number; month: number; day: number },
	employeeId: number,
	isWorking?: boolean,
	onCall?: boolean,
	start?: Date | null,
	end?: Date | null,
	priority?: number | null,
	addAward?: boolean
) => {
	const schedule = await getSchedule(date, employeeId);

	if (schedule) {
		const updates: Partial<Schedule> = {};

		if (isWorking !== undefined) {
			updates.is_working = isWorking;
		}

		if (onCall !== undefined) {
			updates.on_call = onCall;
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

		if (addAward !== undefined) {
			updates.add_award = addAward;
		}

		Object.assign(schedule, updates);

		return schedule.save();
	} else {
		return null;
	}
};

export const signSchedule = async (
	date: { year: number; month: number; day: number },
	employeeId: number
) => {
	const schedule = await getSchedule(date, employeeId);

	if (schedule) {
		schedule.signed = true;

		return schedule.save();
	} else {
		return null;
	}
};

export const createSchedule = async (
	date: { year: number; month: number; day: number },
	employeeId: number,
	isWorking?: boolean,
	onCall?: boolean,
	start?: Date | null,
	end?: Date | null,
	priority?: number | null,
	addAward?: boolean
) => {
	const employee = await Employee.findOne({
		where: {
			employee_id: employeeId,
		},
	});

	if (!employee) throw new NotFoundError('Employee', 'employee id', employeeId);

	const schedule = Schedule.create({
		year: date.year,
		month: date.month,
		day: date.day,
		employee,
		is_working: isWorking,
		on_call: onCall,
		start,
		end,
		priority,
		add_award: addAward,
	});

	return await schedule.save();
};

export const deleteSchedule = async (
	date: { year: number; month: number; day: number },
	employeeId: number
) => {
	const schedule = await getSchedule(date, employeeId);

	if (schedule) {
		return schedule.remove();
	} else {
		return null;
	}
};
