import bcrypt from 'bcrypt';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as EmployeeServices from '../services/employee.services';

export const getEmployees: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const employees = await EmployeeServices.getEmployees();

		res
			.status(HttpCode.OK)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(employees));
	} catch (err) {
		next(err);
	}
};

export const getEmployee: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const employeeId = parseInt(req.params.employee_id);

		const employee = await EmployeeServices.getEmployee(employeeId);

		if (employee) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(employee));
		} else {
			res
				.status(HttpCode.NOT_FOUND)
				.header('Content-Type', 'application/json')
				.send();
		}
	} catch (err) {
		next(err);
	}
};

export const updateEmployee: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const employeeId = parseInt(req.params.employee_id);

		const employee = await EmployeeServices.updateEmployee(
			employeeId,
			req.body.username,
			req.body.first_name,
			req.body.last_name,
			req.body.gender,
			req.body.role,
			req.body.permissions,
			req.body.body_rate,
			req.body.feet_rate,
			req.body.acupuncture_rate,
			req.body.per_hour
		);

		if (employee) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(employee));
		} else {
			res
				.status(HttpCode.NOT_FOUND)
				.header('Content-Type', 'application/json')
				.send();
		}
	} catch (err) {
		next(err);
	}
};

export const addEmployee: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);

		const employee = await EmployeeServices.createEmployee(
			req.body.username,
			hashedPassword,
			req.body.first_name,
			req.body.last_name,
			req.body.gender,
			req.body.role,
			req.body.permissions,
			req.body.body_rate,
			req.body.feet_rate,
			req.body.acupuncture_rate,
			req.body.per_hour
		);

		const respEmployee = Object(employee);
		delete respEmployee['password'];

		res
			.status(HttpCode.CREATED)
			.header('Content-Type', 'application/json')
			.send(JSON.stringify(respEmployee));
	} catch (err) {
		next(err);
	}
};

export const deleteEmployee: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const employeeId = parseInt(req.params.employee_id);

		const employee = await EmployeeServices.deleteEmployee(employeeId);

		if (employee) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(employee));
		} else {
			res
				.status(HttpCode.NOT_FOUND)
				.header('Content-Type', 'application/json')
				.send();
		}
	} catch (err) {
		next(err);
	}
};
