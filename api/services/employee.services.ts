import { Employee } from '../models/employee.models';
import { Gender, Permissions, Role } from '../models/enums';

export const getEmployees = async () => {
	return await Employee.find({
		where: {
			is_active: true,
		},
	});
};

export const getEmployee = async (employeeId: number) => {
	return await Employee.findOne({
		where: {
			employee_id: employeeId,
			is_active: true,
		},
	});
};

export const updateEmployee = async (
	employeeId: number,
	username?: string,
	firstName?: string,
	lastName?: string,
	gender?: Gender,
	role?: Role,
	permissions?: Permissions[],
	bodyRate?: number | null,
	feetRate?: number | null,
	perHour?: number | null
) => {
	const employee = Employee.create({
		employee_id: employeeId,
		username: username,
		first_name: firstName,
		last_name: lastName,
		gender: gender,
		role: role,
		permissions: permissions,
		body_rate: bodyRate,
		feet_rate: feetRate,
		per_hour: perHour,
	});

	return await Employee.update(
		{
			employee_id: employeeId,
			is_active: true,
		},
		employee
	);
};

export const createEmployee = async (
	username: string,
	password: string,
	firstName: string,
	lastName: string,
	gender: Gender,
	role: Role,
	permissions: Permissions[],
	bodyRate?: number | null,
	feetRate?: number | null,
	perHour?: number | null
) => {
	const employee = Employee.create({
		username: username,
		password: password,
		first_name: firstName,
		last_name: lastName,
		gender: gender,
		role: role,
		permissions: permissions,
		body_rate: bodyRate,
		feet_rate: feetRate,
		per_hour: perHour,
	});

	return await employee.save();
};

export const deleteEmployee = async (employeeId: number) => {
	return await Employee.update(
		{
			employee_id: employeeId,
			is_active: true,
		},
		{
			is_active: false,
		}
	);
};
