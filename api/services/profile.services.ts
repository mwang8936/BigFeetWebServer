import { Employee } from '../models/employee.models';
import { Language } from '../models/enums';
import { Schedule } from '../models/schedule.models';

export const getProfile = async (employeeId: number) => {
	return await Employee.findOne({
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
			is_active: true,
		},
	});
};

export const getProfileSchedules = async (employeeId: number) => {
	return await Schedule.find({
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
	const employee = Employee.create({
		language: language,
		dark_mode: darkMode,
	});

	return await Employee.update(
		{
			employee_id: employeeId,
			is_active: true,
		},
		employee
	);
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
