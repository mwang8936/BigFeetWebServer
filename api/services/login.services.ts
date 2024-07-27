import { Employee } from '../models/employee.models';

export const getUserInfo = async (username: string) => {
	return Employee.findOne({
		select: {
			employee_id: true,
			username: true,
			password: true,
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
			username: username,
		},
	});
};
