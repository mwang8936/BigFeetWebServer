import { Not } from 'typeorm';
import { DuplicateIdentifierError } from '../exceptions/duplicate-identifier-error';
import { Employee } from '../models/employee.models';
import { Gender, Permissions, Role } from '../models/enums';

export const getEmployees = async (withDeleted?: boolean) => {
	return Employee.find({
		withDeleted,
		order: {
			username: 'ASC',
		},
	});
};

export const getEmployee = async (
	employeeId: number,
	withDeleted?: boolean
) => {
	return Employee.findOne({
		where: {
			employee_id: employeeId,
		},
		withDeleted,
	});
};

export const getEmployeeHashedPassword = async (
	employeeId: number,
	withDeleted?: boolean
) => {
	return Employee.findOne({
		select: {
			password: true,
		},
		where: {
			employee_id: employeeId,
		},
		withDeleted,
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
			await duplicateUsernameChecker(username, employeeId);
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
	await duplicateUsernameChecker(username);

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
	const employee = await getEmployee(employeeId, false);

	if (employee) {
		return employee.softRemove();
	} else {
		return null;
	}
};

export const recoverEmployee = async (employeeId: number) => {
	const employee = await getEmployee(employeeId, true);

	if (employee) {
		await duplicateUsernameChecker(employee.username);

		return employee.recover();
	} else {
		return null;
	}
};

const duplicateUsernameChecker = async (
	username: string,
	employeeId?: number
) => {
	const duplicates = await Employee.find({
		where: {
			employee_id: employeeId && Not(employeeId),
			username,
		},
	});

	if (duplicates.length > 0) {
		throw new DuplicateIdentifierError('Employee', 'Username', username);
	}
};
