import { Employee } from '../models/employee.models';
import { Gender, Permissions, Role } from '../models/enums';

export const getEmployees = async () => {
	return Employee.find({
		where: {
			is_active: true,
		},
	});
};

export const getEmployee = async (employeeId: number) => {
	return Employee.findOne({
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
	acupunctureRate?: number | null,
	perHour?: number | null
) => {
	const employee = await getEmployee(employeeId);

	if (employee) {
		const updates: Partial<Employee> = {};

		if (username !== undefined) {
			updates.username = username;
		}

		if (firstName !== undefined) {
			updates.first_name = firstName;
		}

		if (lastName !== undefined) {
			updates.last_name = lastName;
		}

		if (gender !== undefined) {
			updates.gender = gender;
		}

		if (role !== undefined) {
			updates.role = role;
		}

		if (permissions !== undefined) {
			updates.permissions = permissions;
		}

		if (bodyRate !== undefined) {
			updates.body_rate = bodyRate;
		}

		if (feetRate !== undefined) {
			updates.feet_rate = feetRate;
		}

		if (acupunctureRate !== undefined) {
			updates.acupuncture_rate = acupunctureRate;
		}

		if (perHour !== undefined) {
			updates.per_hour = perHour;
		}

		Object.assign(employee, updates);

		return employee.save();
	} else {
		return null;
	}
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
	acupunctureRate?: number | null,
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
		acupuncture_rate: acupunctureRate,
		per_hour: perHour,
	});

	return employee.save();
};

export const deleteEmployee = async (employeeId: number) => {
	const employee = await getEmployee(employeeId);

	if (employee) {
		return employee.remove();
	} else {
		return null;
	}
};
