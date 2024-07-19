import { Employee } from '../models/employee.models';
import { Language } from '../models/enums';
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

export const getProfileSchedules = async (employeeId: number) => {
	return Schedule.find({
		where: {
			employee_id: employeeId,
		},
		order: {
			date: 'DESC',
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

export const signProfileSchedule = async (date: string, employeeId: number) => {
	const schedule = await Schedule.findOne({
		where: {
			date,
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
