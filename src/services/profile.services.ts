import AppDataSource from '../config/orm.config';

import { AcupunctureReport } from '../models/acupuncture-report.models';
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
	const schedulesRepository = AppDataSource.getRepository(Schedule);

	const queryBuilder = schedulesRepository.createQueryBuilder('schedules');

	queryBuilder.where(`schedules.employee_id = :employeeId`, { employeeId });

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

	queryBuilder
		.orderBy('schedules.year', 'ASC')
		.addOrderBy('schedules.month', 'ASC')
		.addOrderBy('schedules.day', 'ASC');

	queryBuilder.setFindOptions({ loadEagerRelations: true });

	return queryBuilder.getMany();
};

export const getProfilePayrolls = async (
	employeeId: number,
	start?: { year: number; month: number; day: number },
	end?: { year: number; month: number; day: number }
) => {
	const payrollsRepository = AppDataSource.getRepository(Payroll);

	const queryBuilder = payrollsRepository.createQueryBuilder('payroll');

	queryBuilder.where(`payroll.employee_id = :employeeId`, { employeeId });

	if (start) {
		queryBuilder.andWhere(
			`MAKE_DATE(payroll.year, payroll.month, 1) >= MAKE_DATE(:startYear, :startMonth, 1)`,
			{ startYear: start.year, startMonth: start.month }
		);
	}

	if (end) {
		queryBuilder.andWhere(
			`MAKE_DATE(payroll.year, payroll.month, 1) <= MAKE_DATE(:endYear, :endMonth, 1)`,
			{ endYear: end.year, endMonth: end.month }
		);
	}

	queryBuilder
		.orderBy('payroll.year', 'ASC')
		.addOrderBy('payroll.month', 'ASC')
		.addOrderBy('payroll.part', 'ASC');

	queryBuilder.setFindOptions({ loadEagerRelations: true });

	return queryBuilder.getMany();
};

export const getProfileAcupunctureReports = async (
	employeeId: number,
	start?: { year: number; month: number; day: number },
	end?: { year: number; month: number; day: number }
) => {
	const acupunctureReportsRepository =
		AppDataSource.getRepository(AcupunctureReport);

	const queryBuilder =
		acupunctureReportsRepository.createQueryBuilder('acupuncture_report');

	queryBuilder.where(`acupuncture_report.employee_id = :employeeId`, {
		employeeId,
	});

	if (start) {
		queryBuilder.andWhere(
			`MAKE_DATE(acupuncture_report.year, acupuncture_report.month, 1) >= MAKE_DATE(:startYear, :startMonth, 1)`,
			{ startYear: start.year, startMonth: start.month }
		);
	}

	if (end) {
		queryBuilder.andWhere(
			`MAKE_DATE(acupuncture_report.year, acupuncture_report.month, 1) <= MAKE_DATE(:endYear, :endMonth, 1)`,
			{ endYear: end.year, endMonth: end.month }
		);
	}

	queryBuilder
		.orderBy('acupuncture_report.year', 'ASC')
		.addOrderBy('acupuncture_report.month', 'ASC');

	queryBuilder.setFindOptions({ loadEagerRelations: true });

	return queryBuilder.getMany();
};

export const updateProfile = async (
	employeeId: number,
	language?: Language
) => {
	const profile = await getProfile(employeeId);

	if (profile) {
		const updates: Partial<Employee> = {};

		if (language !== undefined) {
			updates.language = language;
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
