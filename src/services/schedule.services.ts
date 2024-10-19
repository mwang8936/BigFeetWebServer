import AppDataSource from '../config/orm.config';

import { NotFoundError } from '../exceptions/not-found-error';

import { Employee } from '../models/employee.models';
import { Schedule } from '../models/schedule.models';

export const getSchedules = async (
	start?: { year: number; month: number; day: number },
	end?: { year: number; month: number; day: number },
	employeeIds?: number[]
) => {
	const schedulesRepository = AppDataSource.getRepository(Schedule);

	const queryBuilder = schedulesRepository.createQueryBuilder('schedules');

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

	queryBuilder
		.orderBy('schedules.year', 'ASC')
		.addOrderBy('schedules.month', 'ASC')
		.addOrderBy('schedules.day', 'ASC')
		.addOrderBy('schedules.employee_id', 'ASC');

	queryBuilder.setFindOptions({ loadEagerRelations: true });

	return queryBuilder.getMany();
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
		employee_id: employeeId,
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
