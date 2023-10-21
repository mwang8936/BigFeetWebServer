import {
	Employee,
	Role,
	Permissions,
} from '../../../../models/employee.models';

import { UpdateResult, QueryFailedError } from 'typeorm';

function createMockEmployee(
	employee_id: number,
	username: string,
	first_name: string,
	last_name: string,
	permissions: Permissions[],
	is_active: boolean = true
): Employee {
	const employee = new Employee();
	employee.employee_id = employee_id;
	employee.username = username;
	employee.first_name = first_name;
	employee.last_name = last_name;
	employee.permissions = permissions;
	employee.is_active = is_active;
	return employee;
}

const mockEmployeeWithNoPerm = createMockEmployee(
	1,
	'LBird',
	'Larry',
	'Bird',
	[]
);

const mockEmployeeWithGetPerm = createMockEmployee(
	2,
	'MJohnson',
	'Magic',
	'Johnson',
	[Permissions.PERMISSION_GET_EMPLOYEE]
);

const mockEmployeeWithUpdatePerm = createMockEmployee(
	3,
	'MJordan',
	'Michael',
	'Jordan',
	[Permissions.PERMISSION_UPDATE_EMPLOYEE]
);

const mockEmployeeWithCreatePerm = createMockEmployee(
	4,
	'CBarkley',
	'Charles',
	'Barkley',
	[Permissions.PERMISSION_ADD_EMPLOYEE]
);

const mockEmployeeWithDeletePerm = createMockEmployee(
	5,
	'KMalone',
	'Karl',
	'Malone',
	[Permissions.PERMISSION_DELETE_EMPLOYEE]
);

const mockInActiveEmployee = createMockEmployee(
	6,
	'JStockton',
	'John',
	'Stockton',
	[],
	false
);

export const mockEmployees = [
	mockEmployeeWithNoPerm,
	mockEmployeeWithGetPerm,
	mockEmployeeWithUpdatePerm,
	mockEmployeeWithCreatePerm,
	mockEmployeeWithDeletePerm,
	mockInActiveEmployee,
];

export const mockEmployeeServices = jest.mock(
	'../../../../services/employee.services',
	() => ({
		getEmployees: async () => {
			return mockEmployees.filter((employee) => employee.is_active);
		},
		getEmployee: async (employeeId: number) => {
			return (
				mockEmployees.find(
					(employee) =>
						employee.employee_id == employeeId && employee.is_active
				) || null
			);
		},
		updateEmployee: async (
			employeeId: number,
			username?: string,
			firstName?: string,
			lastName?: string,
			role?: Role,
			permissions?: Permissions[],
			bodyRate?: number,
			feetRate?: number,
			perHour?: number
		) => {
			const employee = mockEmployees.find(
				(employee) =>
					employee.employee_id == employeeId && employee.is_active
			);

			const updated = new UpdateResult();
			if (employee) updated.affected = 1;
			else updated.affected = 0;

			return updated;
		},
		createEmployee: async (
			username: string,
			password: string,
			firstName: string,
			lastName: string,
			role: Role,
			permissions: Permissions[],
			bodyRate?: number,
			feetRate?: number,
			perHour?: number
		) => {
			if (
				mockEmployees.find(
					(employee) => employee.username == username
				) != undefined
			) {
				const dupEntryError = new QueryFailedError(
					"INSERT INTO `Employees`(`employee_id`, `username`, `password`, `first_name`, `last_name`, `role`, `permissions`, `body_rate`, `feet_rate`, `per_hour`, `active`, `created_at`, `updated_at`) VALUES (DEFAULT, 'newuser', '$2b$10$9LLHRe1mKuB2MI0DZvRUc.GNQmvoFu5S2MFQqm0hucPhcjqEsnaUu', 'John', 'Smith', 'SOFTWARE DEVELOPER', '', DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT)",
					[],
					null
				);
				dupEntryError.message = 'ER_DUP_ENTRY: Duplicate entry';
				throw dupEntryError;
			}

			const employee = createMockEmployee(
				6,
				username,
				firstName,
				lastName,
				permissions
			);

			return employee;
		},
		deleteEmployee: async (employeeId: number) => {
			const employee = mockEmployees.find(
				(employee) =>
					employee.employee_id == employeeId && employee.is_active
			);
			const updated = new UpdateResult();
			if (employee) updated.affected = 1;
			else updated.affected = 0;

			return updated;
		},
	})
);
