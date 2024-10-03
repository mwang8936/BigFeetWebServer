import {
	Between,
	FindOptionsWhere,
	LessThanOrEqual,
	MoreThanOrEqual,
} from 'typeorm';
import { Employee } from '../models/employee.models';
import { Language } from '../models/enums';
import { Payroll } from '../models/payroll.models';
import { Schedule } from '../models/schedule.models';

export const getProfile = async (employeeId: number) => {
	return Employee.findOne({
		select: {
			employee_id: true,
			username: true,
			first_name: true,
			last_name: true,
			role: true,
			gender: true,
			permissions: true,
			body_rate: true,
			feet_rate: true,
			acupuncture_rate: true,
			per_hour: true,
			language: true,
			dark_mode: true,
			created_at: true,
			updated_at: true,
		},
		where: {
			employee_id: employeeId,
		},
	});
};

export const getProfileSchedules = async (
	employeeId: number,
	start?: { year: number; month: number; day: number },
	end?: { year: number; month: number; day: number }
) => {
	const whereCondition: FindOptionsWhere<Schedule> = {
		employee_id: employeeId,
	};

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

	return Schedule.find({
		where: whereCondition,
		order: {
			year: 'ASC',
			month: 'ASC',
			day: 'ASC',
		},
	});
};

export const getProfilePayrolls = async (
	employeeId: number,
	start?: { year: number; month: number; day: number },
	end?: { year: number; month: number; day: number }
) => {
	const whereCondition: FindOptionsWhere<Payroll> = {
		employee_id: employeeId,
	};

	if (start && end) {
		whereCondition.year = Between(start.year, end.year);
		whereCondition.month = Between(start.month, end.month);
	} else if (start) {
		whereCondition.year = MoreThanOrEqual(start.year);
		whereCondition.month = MoreThanOrEqual(start.month);
	} else if (end) {
		whereCondition.year = LessThanOrEqual(end.year);
		whereCondition.month = LessThanOrEqual(end.month);
	}

	return Payroll.find({
		where: whereCondition,
		order: {
			year: 'ASC',
			month: 'ASC',
			part: 'ASC',
		},
	});
};

export const updateProfile = async (
	employeeId: number,
	language?: Language,
	darkMode?: boolean
) => {
	const profile = await getProfile(employeeId);

	if (profile) {
		const updates: Partial<Employee> = {};

		if (language !== undefined) {
			updates.language = language;
		}

		if (darkMode !== undefined) {
			updates.dark_mode = darkMode;
		}

		Object.assign(profile, updates);

		return profile.save();
	} else {
		return null;
	}
};

export const changeProfilePassword = async (
	employeeId: number,
	newPassword: string
) => {
	const profile = await getProfile(employeeId);

	if (profile) {
		const updates: Partial<Employee> = {};

		updates.password = newPassword;

		Object.assign(profile, updates);

		return profile.save();
	} else {
		return null;
	}
};

export const signProfileSchedule = async (
	date: { year: number; month: number; day: number },
	employeeId: number
) => {
	const schedule = await Schedule.findOne({
		where: {
			year: date.year,
			month: date.month,
			day: date.day,
			employee_id: employeeId,
		},
	});

	if (schedule) {
		schedule.signed = true;

		return schedule.save();
	} else {
		return null;
	}
};
