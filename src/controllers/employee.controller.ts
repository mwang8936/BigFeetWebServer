import bcrypt from 'bcrypt';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import * as EmployeeServices from '../services/employee.services';
import pusher from '../config/pusher.config';
import {
	add_employee_event,
	delete_employee_event,
	EmployeeEventMessage,
	employees_channel,
	recover_employee_event,
	update_employee_event,
} from '../events/employee.events';
import saltRounds from '../config/password.config';
import { Employee } from '../models/employee.models';

const sendPusherEvent = async (
	employee: Employee,
	event: string,
	socketID: string | undefined
) => {
	if (socketID) {
		const message: EmployeeEventMessage = {
			username: employee.username,
		};

		try {
			pusher.trigger(employees_channel, event, message, {
				socket_id: socketID,
			});
		} catch (err) {
			if (
				err instanceof Error &&
				(err.message?.includes('Invalid socket id') ||
					err.message?.includes('Invalid channel name'))
			) {
				console.error(err.message);
			}
		}
	}
};

export const getEmployees: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const withDeleted = req.query.with_deleted === 'true';

		const employees = await EmployeeServices.getEmployees(withDeleted);

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
		const withDeleted = req.query.with_deleted === 'true';

		const employee = await EmployeeServices.getEmployee(
			employeeId,
			withDeleted
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

export const updateEmployee: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const employeeId = parseInt(req.params.employee_id);

		let hashedPassword = undefined;
		if (req.body.password) {
			hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
		}

		const employee = await EmployeeServices.updateEmployee(
			employeeId,
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

		if (employee) {
			const respEmployee = Object(employee);
			delete respEmployee['password'];

			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(respEmployee));

			sendPusherEvent(
				employee,
				update_employee_event,
				req.headers['x-socket-id'] as string | undefined
			);
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
		const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

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

		sendPusherEvent(
			employee,
			add_employee_event,
			req.headers['x-socket-id'] as string | undefined
		);
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

			sendPusherEvent(
				employee,
				delete_employee_event,
				req.headers['x-socket-id'] as string | undefined
			);
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

export const recoverEmployee: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const employeeId = parseInt(req.params.employee_id);

		const employee = await EmployeeServices.recoverEmployee(employeeId);

		if (employee) {
			res
				.status(HttpCode.OK)
				.header('Content-Type', 'application/json')
				.send(JSON.stringify(employee));

			sendPusherEvent(
				employee,
				recover_employee_event,
				req.headers['x-socket-id'] as string | undefined
			);
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
