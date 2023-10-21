import supertest from 'supertest';
import {
	mockEmployees,
	mockEmployeeServices,
} from '../employee/employee.mockdata';
import { generateToken } from '../../../../utils/jwt.utils';
import createServer from '../../../../utils/server.utils';
import {
	Employee,
	Role,
	Permissions,
} from '../../../../models/employee.models';
import { HttpCode } from '../../../../exceptions/custom-error';

const app = createServer();

const employeePayload = {
	username: 'IThomas',
	password: 'BadBoys',
	first_name: 'Isaiah',
	last_name: 'Thomas',
	role: Role.RECEPTIONIST,
	permissions: [
		Permissions.PERMISSION_GET_EMPLOYEE,
		Permissions.PERMISSION_ADD_EMPLOYEE,
	],
	body_rate: 12.34,
	feet_rate: 19,
	per_hour: 10,
};

describe('employee', () => {
	describe('get employees route', () => {
		describe('without logging in', () => {
			it('should return a 401 status', async () => {
				await supertest(app)
					.get('/api/employee')
					.expect(HttpCode.UNAUTHORIZED);
			});
		});

		describe('after logging in with missing permissions', () => {
			it('should return a 401 status', async () => {
				const jwt = generateToken([]);

				await supertest(app)
					.get('/api/employee')
					.set('Authorization', `Bearer ${jwt}`)
					.expect(HttpCode.UNAUTHORIZED);
			});
		});

		describe('after logging in with correct permissions', () => {
			it('should return a 200 status along with array of active employees', async () => {
				const jwt = generateToken([
					Permissions.PERMISSION_GET_EMPLOYEE,
				]);

				const { body, statusCode } = await supertest(app)
					.get('/api/employee')
					.set('Authorization', `Bearer ${jwt}`);

				expect(statusCode).toBe(HttpCode.OK);

				const employees = mockEmployees.filter(
					(employee) => employee.is_active
				);
				expect(
					(body as Employee[]).map((employee) => employee.employee_id)
				).toEqual(
					expect.arrayContaining(
						employees.map((employee) => employee.employee_id)
					)
				);
			});
		});
	});

	describe('get employee route', () => {
		describe('without logging in', () => {
			it('should return a 401 status', async () => {
				const employeeId = 8;

				await supertest(app)
					.get(`/api/employee/${employeeId}`)
					.expect(HttpCode.UNAUTHORIZED);
			});
		});

		describe('after logging in with missing permissions', () => {
			it('should return a 401 status', async () => {
				const employeeId = 8;
				const jwt = generateToken([]);

				await supertest(app)
					.get(`/api/employee/${employeeId}`)
					.set('Authorization', `Bearer ${jwt}`)
					.expect(HttpCode.UNAUTHORIZED);
			});
		});

		describe('after logging in with correct permissions', () => {
			describe('given invalid param: employee_id', () => {
				describe('employee_id (string instead of number)', () => {
					it('should return a 400 status', async () => {
						const employeeId = 'test';
						const jwt = generateToken([
							Permissions.PERMISSION_GET_EMPLOYEE,
						]);

						await supertest(app)
							.get(`/api/employee/${employeeId}`)
							.set('Authorization', `Bearer ${jwt}`)
							.expect(HttpCode.BAD_REQUEST);
					});
				});

				describe('employee_id (negative number)', () => {
					it('should return a 400 status', async () => {
						const employeeId = -1;
						const jwt = generateToken([
							Permissions.PERMISSION_GET_EMPLOYEE,
						]);

						await supertest(app)
							.get(`/api/employee/${employeeId}`)
							.set('Authorization', `Bearer ${jwt}`)
							.expect(HttpCode.BAD_REQUEST);
					});
				});

				describe('employee_id (0)', () => {
					it('should return a 400 status', async () => {
						const employeeId = 0;
						const jwt = generateToken([
							Permissions.PERMISSION_GET_EMPLOYEE,
						]);

						await supertest(app)
							.get(`/api/employee/${employeeId}`)
							.set('Authorization', `Bearer ${jwt}`)
							.expect(HttpCode.BAD_REQUEST);
					});
				});

				describe('employee_id (float)', () => {
					it('should return a 400 status', async () => {
						const employeeId = 1.35;
						const jwt = generateToken([
							Permissions.PERMISSION_GET_EMPLOYEE,
						]);

						await supertest(app)
							.get(`/api/employee/${employeeId}`)
							.set('Authorization', `Bearer ${jwt}`)
							.expect(HttpCode.BAD_REQUEST);
					});
				});
			});

			describe('given employee does not exist/inactive', () => {
				it('should return a 200 status and an empty body', async () => {
					const employeeId = 6;
					const jwt = generateToken([
						Permissions.PERMISSION_GET_EMPLOYEE,
					]);

					const { body, statusCode } = await supertest(app)
						.get(`/api/employee/${employeeId}`)
						.set('Authorization', `Bearer ${jwt}`);

					expect(statusCode).toBe(HttpCode.OK);
					expect(body as Employee | null).toBe(null);
				});
			});

			describe('given employee is active', () => {
				it('should return a 200 status and the active employee with the employee_id', async () => {
					const employeeId = 1;
					const jwt = generateToken([
						Permissions.PERMISSION_GET_EMPLOYEE,
					]);

					const { body, statusCode } = await supertest(app)
						.get(`/api/employee/${employeeId}`)
						.set('Authorization', `Bearer ${jwt}`);

					expect(statusCode).toBe(HttpCode.OK);
					expect(body as Employee | null).toEqual(
						mockEmployees.find(
							(employee) => employee.employee_id == employeeId
						)
					);
				});
			});
		});
	});

	describe('update employee route', () => {
		describe('without logging in', () => {
			it('should return a 401 status', async () => {
				const employeeId = 8;

				await supertest(app)
					.patch(`/api/employee/${employeeId}`)
					.expect(HttpCode.UNAUTHORIZED);
			});
		});

		describe('after logging in with missing permissions', () => {
			it('should return a 401 status', async () => {
				const employeeId = 8;
				const jwt = generateToken([]);

				await supertest(app)
					.patch(`/api/employee/${employeeId}`)
					.set('Authorization', `Bearer ${jwt}`)
					.expect(HttpCode.UNAUTHORIZED);
			});
		});

		describe('after logging in with correct permissions', () => {
			describe('given invalid param: employee_id', () => {
				describe('employee_id (string instead of number)', () => {
					it('should return a 400 status', async () => {
						const employeeId = 'test';
						const jwt = generateToken([
							Permissions.PERMISSION_UPDATE_EMPLOYEE,
						]);

						await supertest(app)
							.patch(`/api/employee/${employeeId}`)
							.set('Authorization', `Bearer ${jwt}`)
							.expect(HttpCode.BAD_REQUEST);
					});
				});

				describe('employee_id (negative number)', () => {
					it('should return a 400 status', async () => {
						const employeeId = -1;
						const jwt = generateToken([
							Permissions.PERMISSION_UPDATE_EMPLOYEE,
						]);

						await supertest(app)
							.patch(`/api/employee/${employeeId}`)
							.set('Authorization', `Bearer ${jwt}`)
							.expect(HttpCode.BAD_REQUEST);
					});
				});

				describe('employee_id (0)', () => {
					it('should return a 400 status', async () => {
						const employeeId = 0;
						const jwt = generateToken([
							Permissions.PERMISSION_UPDATE_EMPLOYEE,
						]);

						await supertest(app)
							.patch(`/api/employee/${employeeId}`)
							.set('Authorization', `Bearer ${jwt}`)
							.expect(HttpCode.BAD_REQUEST);
					});
				});

				describe('employee_id (float)', () => {
					it('should return a 400 status', async () => {
						const employeeId = 1.35;
						const jwt = generateToken([
							Permissions.PERMISSION_UPDATE_EMPLOYEE,
						]);

						await supertest(app)
							.patch(`/api/employee/${employeeId}`)
							.set('Authorization', `Bearer ${jwt}`)
							.expect(HttpCode.BAD_REQUEST);
					});
				});
			});

			describe('given invalid body', () => {
				describe('given empty body', () => {
					it('should return a 400 status', async () => {
						const employeeId = 1;
						const jwt = generateToken([
							Permissions.PERMISSION_UPDATE_EMPLOYEE,
						]);

						await supertest(app)
							.patch(`/api/employee/${employeeId}`)
							.set('Authorization', `Bearer ${jwt}`)
							.expect(HttpCode.BAD_REQUEST);
					});
				});

				describe('given invalid username', () => {
					describe('username: (empty)', () => {
						it('should return a 400 status', async () => {
							const employeeId = 1;
							const jwt = generateToken([
								Permissions.PERMISSION_UPDATE_EMPLOYEE,
							]);

							await supertest(app)
								.patch(`/api/employee/${employeeId}`)
								.set('Authorization', `Bearer ${jwt}`)
								.send({ username: '' })
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('username: (over 20 characters)', () => {
						it('should return a 400 status', async () => {
							const employeeId = 1;
							const jwt = generateToken([
								Permissions.PERMISSION_UPDATE_EMPLOYEE,
							]);

							await supertest(app)
								.patch(`/api/employee/${employeeId}`)
								.set('Authorization', `Bearer ${jwt}`)
								.send({
									username: 'MyVeryLongUserNameForTesting',
								})
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('username: (containing non-alphanum characters)', () => {
						it('should return a 400 status', async () => {
							const employeeId = 1;
							const jwt = generateToken([
								Permissions.PERMISSION_UPDATE_EMPLOYEE,
							]);

							await supertest(app)
								.patch(`/api/employee/${employeeId}`)
								.set('Authorization', `Bearer ${jwt}`)
								.send({
									username: '%#asdf*234',
								})
								.expect(HttpCode.BAD_REQUEST);
						});
					});
				});

				describe('given invalid first_name', () => {
					describe('first_name: (empty)', () => {
						it('should return a 400 status', async () => {
							const employeeId = 1;
							const jwt = generateToken([
								Permissions.PERMISSION_UPDATE_EMPLOYEE,
							]);

							await supertest(app)
								.patch(`/api/employee/${employeeId}`)
								.set('Authorization', `Bearer ${jwt}`)
								.send({ first_name: '' })
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('first_name: (over 20 characters)', () => {
						it('should return a 400 status', async () => {
							const employeeId = 1;
							const jwt = generateToken([
								Permissions.PERMISSION_UPDATE_EMPLOYEE,
							]);

							await supertest(app)
								.patch(`/api/employee/${employeeId}`)
								.set('Authorization', `Bearer ${jwt}`)
								.send({
									first_name: 'MyVeryLongFirstNameForTesting',
								})
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('first_name: (containing non-alphanum characters)', () => {
						it('should return a 400 status', async () => {
							const employeeId = 1;
							const jwt = generateToken([
								Permissions.PERMISSION_UPDATE_EMPLOYEE,
							]);

							await supertest(app)
								.patch(`/api/employee/${employeeId}`)
								.set('Authorization', `Bearer ${jwt}`)
								.send({
									first_name: '%#asdf*234',
								})
								.expect(HttpCode.BAD_REQUEST);
						});
					});
				});

				describe('given invalid last_name', () => {
					describe('last_name: (empty)', () => {
						it('should return a 400 status', async () => {
							const employeeId = 1;
							const jwt = generateToken([
								Permissions.PERMISSION_UPDATE_EMPLOYEE,
							]);

							await supertest(app)
								.patch(`/api/employee/${employeeId}`)
								.set('Authorization', `Bearer ${jwt}`)
								.send({ last_name: '' })
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('last_name: (over 20 characters)', () => {
						it('should return a 400 status', async () => {
							const employeeId = 1;
							const jwt = generateToken([
								Permissions.PERMISSION_UPDATE_EMPLOYEE,
							]);

							await supertest(app)
								.patch(`/api/employee/${employeeId}`)
								.set('Authorization', `Bearer ${jwt}`)
								.send({
									last_name: 'MyVeryLongLastNameForTesting',
								})
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('last_name: (containing non-alphanum characters)', () => {
						it('should return a 400 status', async () => {
							const employeeId = 1;
							const jwt = generateToken([
								Permissions.PERMISSION_UPDATE_EMPLOYEE,
							]);

							await supertest(app)
								.patch(`/api/employee/${employeeId}`)
								.set('Authorization', `Bearer ${jwt}`)
								.send({
									last_name: '%#asdf*234',
								})
								.expect(HttpCode.BAD_REQUEST);
						});
					});
				});

				describe('given invalid role', () => {
					describe('role: (number instead of string)', () => {
						it('should return a 400 status', async () => {
							const employeeId = 1;
							const jwt = generateToken([
								Permissions.PERMISSION_UPDATE_EMPLOYEE,
							]);

							await supertest(app)
								.patch(`/api/employee/${employeeId}`)
								.set('Authorization', `Bearer ${jwt}`)
								.send({
									role: 1,
								})
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('role: (not a valid role)', () => {
						it('should return a 400 status', async () => {
							const employeeId = 1;
							const jwt = generateToken([
								Permissions.PERMISSION_UPDATE_EMPLOYEE,
							]);

							await supertest(app)
								.patch(`/api/employee/${employeeId}`)
								.set('Authorization', `Bearer ${jwt}`)
								.send({
									role: 'INVALID ROLE NAME',
								})
								.expect(HttpCode.BAD_REQUEST);
						});
					});
				});

				describe('given invalid permissions', () => {
					describe('permissions: (number instead of string[])', () => {
						it('should return a 400 status', async () => {
							const employeeId = 1;
							const jwt = generateToken([
								Permissions.PERMISSION_UPDATE_EMPLOYEE,
							]);

							await supertest(app)
								.patch(`/api/employee/${employeeId}`)
								.set('Authorization', `Bearer ${jwt}`)
								.send({
									permissions: 1,
								})
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('permissions: (not valid permissions)', () => {
						it('should return a 400 status', async () => {
							const employeeId = 1;
							const jwt = generateToken([
								Permissions.PERMISSION_UPDATE_EMPLOYEE,
							]);

							await supertest(app)
								.patch(`/api/employee/${employeeId}`)
								.set('Authorization', `Bearer ${jwt}`)
								.send({
									permissions: [
										'Invalid Permission',
										'Another Invalid Permission',
									],
								})
								.expect(HttpCode.BAD_REQUEST);
						});
					});
				});

				describe('given invalid body_rate', () => {
					describe('body_rate: (string instead of number)', () => {
						it('should return a 400 status', async () => {
							const employeeId = 1;
							const jwt = generateToken([
								Permissions.PERMISSION_UPDATE_EMPLOYEE,
							]);

							await supertest(app)
								.patch(`/api/employee/${employeeId}`)
								.set('Authorization', `Bearer ${jwt}`)
								.send({
									body_rate: 'test',
								})
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('body_rate: (negative number)', () => {
						it('should return a 400 status', async () => {
							const employeeId = 1;
							const jwt = generateToken([
								Permissions.PERMISSION_UPDATE_EMPLOYEE,
							]);

							await supertest(app)
								.patch(`/api/employee/${employeeId}`)
								.set('Authorization', `Bearer ${jwt}`)
								.send({
									body_rate: -1,
								})
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('body_rate: (0)', () => {
						it('should return a 400 status', async () => {
							const employeeId = 1;
							const jwt = generateToken([
								Permissions.PERMISSION_UPDATE_EMPLOYEE,
							]);

							await supertest(app)
								.patch(`/api/employee/${employeeId}`)
								.set('Authorization', `Bearer ${jwt}`)
								.send({
									body_rate: 0,
								})
								.expect(HttpCode.BAD_REQUEST);
						});
					});
				});

				describe('given invalid feet_rate', () => {
					describe('feet_rate: (string instead of number)', () => {
						it('should return a 400 status', async () => {
							const employeeId = 1;
							const jwt = generateToken([
								Permissions.PERMISSION_UPDATE_EMPLOYEE,
							]);

							await supertest(app)
								.patch(`/api/employee/${employeeId}`)
								.set('Authorization', `Bearer ${jwt}`)
								.send({
									feet_rate: 'test',
								})
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('feet_rate: (negative number)', () => {
						it('should return a 400 status', async () => {
							const employeeId = 1;
							const jwt = generateToken([
								Permissions.PERMISSION_UPDATE_EMPLOYEE,
							]);

							await supertest(app)
								.patch(`/api/employee/${employeeId}`)
								.set('Authorization', `Bearer ${jwt}`)
								.send({
									feet_rate: -1,
								})
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('feet_rate: (0)', () => {
						it('should return a 400 status', async () => {
							const employeeId = 1;
							const jwt = generateToken([
								Permissions.PERMISSION_UPDATE_EMPLOYEE,
							]);

							await supertest(app)
								.patch(`/api/employee/${employeeId}`)
								.set('Authorization', `Bearer ${jwt}`)
								.send({
									feet_rate: 0,
								})
								.expect(HttpCode.BAD_REQUEST);
						});
					});
				});

				describe('given invalid per_hour', () => {
					describe('per_hour: (string instead of number)', () => {
						it('should return a 400 status', async () => {
							const employeeId = 1;
							const jwt = generateToken([
								Permissions.PERMISSION_UPDATE_EMPLOYEE,
							]);

							await supertest(app)
								.patch(`/api/employee/${employeeId}`)
								.set('Authorization', `Bearer ${jwt}`)
								.send({
									per_hour: 'test',
								})
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('per_hour: (negative number)', () => {
						it('should return a 400 status', async () => {
							const employeeId = 1;
							const jwt = generateToken([
								Permissions.PERMISSION_UPDATE_EMPLOYEE,
							]);

							await supertest(app)
								.patch(`/api/employee/${employeeId}`)
								.set('Authorization', `Bearer ${jwt}`)
								.send({
									per_hour: -1,
								})
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('per_hour: (0)', () => {
						it('should return a 400 status', async () => {
							const employeeId = 1;
							const jwt = generateToken([
								Permissions.PERMISSION_UPDATE_EMPLOYEE,
							]);

							await supertest(app)
								.patch(`/api/employee/${employeeId}`)
								.set('Authorization', `Bearer ${jwt}`)
								.send({
									per_hour: 0,
								})
								.expect(HttpCode.BAD_REQUEST);
						});
					});
				});
			});

			describe('given valid request', () => {
				describe('given employee does not exist/inactive', () => {
					it('should return a 304 status', async () => {
						const employeeId = 6;
						const jwt = generateToken([
							Permissions.PERMISSION_UPDATE_EMPLOYEE,
						]);

						await supertest(app)
							.patch(`/api/employee/${employeeId}`)
							.set('Authorization', `Bearer ${jwt}`)
							.send({
								username: 'test',
							})
							.expect(HttpCode.NOT_MODIFIED);
					});
				});

				describe('given employee is active', () => {
					it('should return a 204 status', async () => {
						const employeeId = 1;
						const jwt = generateToken([
							Permissions.PERMISSION_UPDATE_EMPLOYEE,
						]);

						await supertest(app)
							.patch(`/api/employee/${employeeId}`)
							.set('Authorization', `Bearer ${jwt}`)
							.send({
								username: 'test',
							})
							.expect(HttpCode.NO_CONTENT);
					});
				});
			});
		});
	});

	describe('add employee route', () => {
		describe('without logging in', () => {
			it('should return a 401 status', async () => {
				await supertest(app)
					.post('/api/employee')
					.expect(HttpCode.UNAUTHORIZED);
			});
		});

		describe('after logging in with missing permissions', () => {
			it('should return a 401 status', async () => {
				const jwt = generateToken([]);

				await supertest(app)
					.post('/api/employee')
					.set('Authorization', `Bearer ${jwt}`)
					.expect(HttpCode.UNAUTHORIZED);
			});
		});

		describe('after logging in with correct permissions', () => {
			describe('given invalid body', () => {
				describe('given empty body', () => {
					it('should return a 400 status', async () => {
						const jwt = generateToken([
							Permissions.PERMISSION_ADD_EMPLOYEE,
						]);

						await supertest(app)
							.post('/api/employee')
							.set('Authorization', `Bearer ${jwt}`)
							.expect(HttpCode.BAD_REQUEST);
					});
				});

				describe('given invalid username', () => {
					describe('username: (empty)', () => {
						it('should return a 400 status', async () => {
							const jwt = generateToken([
								Permissions.PERMISSION_ADD_EMPLOYEE,
							]);

							const payload = Object.assign({}, employeePayload);
							payload.username = '';

							await supertest(app)
								.post('/api/employee')
								.set('Authorization', `Bearer ${jwt}`)
								.send(payload)
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('username: (over 20 characters)', () => {
						it('should return a 400 status', async () => {
							const jwt = generateToken([
								Permissions.PERMISSION_ADD_EMPLOYEE,
							]);

							const payload = Object.assign({}, employeePayload);
							payload.username = 'MyVeryLongUserNameForTesting';

							await supertest(app)
								.post('/api/employee')
								.set('Authorization', `Bearer ${jwt}`)
								.send(payload)
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('username: (containing non-alphanum characters)', () => {
						it('should return a 400 status', async () => {
							const jwt = generateToken([
								Permissions.PERMISSION_ADD_EMPLOYEE,
							]);

							const payload = Object.assign({}, employeePayload);
							payload.username = '%#asdf*234';

							await supertest(app)
								.post('/api/employee')
								.set('Authorization', `Bearer ${jwt}`)
								.send(payload)
								.expect(HttpCode.BAD_REQUEST);
						});
					});
				});

				describe('given invalid first_name', () => {
					describe('first_name: (empty)', () => {
						it('should return a 400 status', async () => {
							const jwt = generateToken([
								Permissions.PERMISSION_ADD_EMPLOYEE,
							]);

							const payload = Object.assign({}, employeePayload);
							payload.first_name = '';

							await supertest(app)
								.post('/api/employee')
								.set('Authorization', `Bearer ${jwt}`)
								.send(payload)
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('first_name: (over 20 characters)', () => {
						it('should return a 400 status', async () => {
							const jwt = generateToken([
								Permissions.PERMISSION_ADD_EMPLOYEE,
							]);

							const payload = Object.assign({}, employeePayload);
							payload.first_name =
								'MyVeryLongFirstNameForTesting';

							await supertest(app)
								.post('/api/employee')
								.set('Authorization', `Bearer ${jwt}`)
								.send(payload)
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('first_name: (containing non-alphanum characters)', () => {
						it('should return a 400 status', async () => {
							const jwt = generateToken([
								Permissions.PERMISSION_ADD_EMPLOYEE,
							]);

							const payload = Object.assign({}, employeePayload);
							payload.first_name = '%#asdf*234';

							await supertest(app)
								.post('/api/employee')
								.set('Authorization', `Bearer ${jwt}`)
								.send(payload)
								.expect(HttpCode.BAD_REQUEST);
						});
					});
				});

				describe('given invalid last_name', () => {
					describe('last_name: (empty)', () => {
						it('should return a 400 status', async () => {
							const jwt = generateToken([
								Permissions.PERMISSION_ADD_EMPLOYEE,
							]);

							const payload = Object.assign({}, employeePayload);
							payload.last_name = '';

							await supertest(app)
								.post('/api/employee')
								.set('Authorization', `Bearer ${jwt}`)
								.send(payload)
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('last_name: (over 20 characters)', () => {
						it('should return a 400 status', async () => {
							const jwt = generateToken([
								Permissions.PERMISSION_ADD_EMPLOYEE,
							]);

							const payload = Object.assign({}, employeePayload);
							payload.last_name = 'MyVeryLongLastNameForTesting';

							await supertest(app)
								.post('/api/employee')
								.set('Authorization', `Bearer ${jwt}`)
								.send(payload)
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('last_name: (containing non-alphanum characters)', () => {
						it('should return a 400 status', async () => {
							const jwt = generateToken([
								Permissions.PERMISSION_ADD_EMPLOYEE,
							]);

							const payload = Object.assign({}, employeePayload);
							payload.last_name = '%#asdf*234';

							await supertest(app)
								.post('/api/employee')
								.set('Authorization', `Bearer ${jwt}`)
								.send(payload)
								.expect(HttpCode.BAD_REQUEST);
						});
					});
				});

				describe('given invalid role', () => {
					describe('role: (number instead of string)', () => {
						it('should return a 400 status', async () => {
							const jwt = generateToken([
								Permissions.PERMISSION_ADD_EMPLOYEE,
							]);

							const payload = {
								username: 'IThomas',
								password: 'BadBoys',
								first_name: 'Isaiah',
								last_name: 'Thomas',
								role: 1,
								permissions: [
									Permissions.PERMISSION_GET_EMPLOYEE,
									Permissions.PERMISSION_ADD_EMPLOYEE,
								],
								body_rate: 12.34,
								feet_rate: 19,
								per_hour: 10,
							};

							await supertest(app)
								.post('/api/employee')
								.set('Authorization', `Bearer ${jwt}`)
								.send(payload)
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('role: (not a valid role)', () => {
						it('should return a 400 status', async () => {
							const jwt = generateToken([
								Permissions.PERMISSION_ADD_EMPLOYEE,
							]);

							const payload = {
								username: 'IThomas',
								password: 'BadBoys',
								first_name: 'Isaiah',
								last_name: 'Thomas',
								role: 'InvalidRole',
								permissions: [
									Permissions.PERMISSION_GET_EMPLOYEE,
									Permissions.PERMISSION_ADD_EMPLOYEE,
								],
								body_rate: 12.34,
								feet_rate: 19,
								per_hour: 10,
							};

							await supertest(app)
								.post('/api/employee')
								.set('Authorization', `Bearer ${jwt}`)
								.send(payload)
								.expect(HttpCode.BAD_REQUEST);
						});
					});
				});

				describe('given invalid permissions', () => {
					describe('permissions: (number instead of string[])', () => {
						it('should return a 400 status', async () => {
							const jwt = generateToken([
								Permissions.PERMISSION_ADD_EMPLOYEE,
							]);

							const payload = {
								username: 'IThomas',
								password: 'BadBoys',
								first_name: 'Isaiah',
								last_name: 'Thomas',
								role: Role.RECEPTIONIST,
								permissions: 1,
								body_rate: 12.34,
								feet_rate: 19,
								per_hour: 10,
							};

							await supertest(app)
								.post('/api/employee')
								.set('Authorization', `Bearer ${jwt}`)
								.send(payload)
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('permissions: (not valid permissions)', () => {
						it('should return a 400 status', async () => {
							const jwt = generateToken([
								Permissions.PERMISSION_ADD_EMPLOYEE,
							]);

							const payload = {
								username: 'IThomas',
								password: 'BadBoys',
								first_name: 'Isaiah',
								last_name: 'Thomas',
								role: Role.RECEPTIONIST,
								permissions: [
									'Invalid Permission',
									'Another Invalid Permission',
								],
								body_rate: 12.34,
								feet_rate: 19,
								per_hour: 10,
							};

							await supertest(app)
								.post('/api/employee')
								.set('Authorization', `Bearer ${jwt}`)
								.send(payload)
								.expect(HttpCode.BAD_REQUEST);
						});
					});
				});

				describe('given invalid body_rate', () => {
					describe('body_rate: (string instead of number)', () => {
						it('should return a 400 status', async () => {
							const jwt = generateToken([
								Permissions.PERMISSION_ADD_EMPLOYEE,
							]);

							const payload = {
								username: 'IThomas',
								password: 'BadBoys',
								first_name: 'Isaiah',
								last_name: 'Thomas',
								role: Role.RECEPTIONIST,
								permissions: [
									Permissions.PERMISSION_GET_EMPLOYEE,
									Permissions.PERMISSION_ADD_EMPLOYEE,
								],
								body_rate: 'test',
								feet_rate: 19,
								per_hour: 10,
							};

							await supertest(app)
								.post('/api/employee')
								.set('Authorization', `Bearer ${jwt}`)
								.send(payload)
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('body_rate: (negative number)', () => {
						it('should return a 400 status', async () => {
							const jwt = generateToken([
								Permissions.PERMISSION_ADD_EMPLOYEE,
							]);

							const payload = {
								username: 'IThomas',
								password: 'BadBoys',
								first_name: 'Isaiah',
								last_name: 'Thomas',
								role: Role.RECEPTIONIST,
								permissions: [
									Permissions.PERMISSION_GET_EMPLOYEE,
									Permissions.PERMISSION_ADD_EMPLOYEE,
								],
								body_rate: -1,
								feet_rate: 19,
								per_hour: 10,
							};

							await supertest(app)
								.post('/api/employee')
								.set('Authorization', `Bearer ${jwt}`)
								.send(payload)
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('body_rate: (0)', () => {
						it('should return a 400 status', async () => {
							const jwt = generateToken([
								Permissions.PERMISSION_ADD_EMPLOYEE,
							]);

							const payload = {
								username: 'IThomas',
								password: 'BadBoys',
								first_name: 'Isaiah',
								last_name: 'Thomas',
								role: Role.RECEPTIONIST,
								permissions: [
									Permissions.PERMISSION_GET_EMPLOYEE,
									Permissions.PERMISSION_ADD_EMPLOYEE,
								],
								body_rate: 0,
								feet_rate: 19,
								per_hour: 10,
							};

							await supertest(app)
								.post('/api/employee')
								.set('Authorization', `Bearer ${jwt}`)
								.send(payload)
								.expect(HttpCode.BAD_REQUEST);
						});
					});
				});

				describe('given invalid feet_rate', () => {
					describe('feet_rate: (string instead of number)', () => {
						it('should return a 400 status', async () => {
							const jwt = generateToken([
								Permissions.PERMISSION_ADD_EMPLOYEE,
							]);

							const payload = {
								username: 'IThomas',
								password: 'BadBoys',
								first_name: 'Isaiah',
								last_name: 'Thomas',
								role: Role.RECEPTIONIST,
								permissions: [
									Permissions.PERMISSION_GET_EMPLOYEE,
									Permissions.PERMISSION_ADD_EMPLOYEE,
								],
								body_rate: 12.34,
								feet_rate: 'test',
								per_hour: 10,
							};

							await supertest(app)
								.post('/api/employee')
								.set('Authorization', `Bearer ${jwt}`)
								.send(payload)
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('feet_rate: (negative number)', () => {
						it('should return a 400 status', async () => {
							const jwt = generateToken([
								Permissions.PERMISSION_ADD_EMPLOYEE,
							]);

							const payload = {
								username: 'IThomas',
								password: 'BadBoys',
								first_name: 'Isaiah',
								last_name: 'Thomas',
								role: Role.RECEPTIONIST,
								permissions: [
									Permissions.PERMISSION_GET_EMPLOYEE,
									Permissions.PERMISSION_ADD_EMPLOYEE,
								],
								body_rate: 12.34,
								feet_rate: -1,
								per_hour: 10,
							};

							await supertest(app)
								.post('/api/employee')
								.set('Authorization', `Bearer ${jwt}`)
								.send(payload)
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('feet_rate: (0)', () => {
						it('should return a 400 status', async () => {
							const jwt = generateToken([
								Permissions.PERMISSION_ADD_EMPLOYEE,
							]);

							const payload = {
								username: 'IThomas',
								password: 'BadBoys',
								first_name: 'Isaiah',
								last_name: 'Thomas',
								role: Role.RECEPTIONIST,
								permissions: [
									Permissions.PERMISSION_GET_EMPLOYEE,
									Permissions.PERMISSION_ADD_EMPLOYEE,
								],
								body_rate: 12.34,
								feet_rate: 0,
								per_hour: 10,
							};

							await supertest(app)
								.post('/api/employee')
								.set('Authorization', `Bearer ${jwt}`)
								.send(payload)
								.expect(HttpCode.BAD_REQUEST);
						});
					});
				});

				describe('given invalid per_hour', () => {
					describe('per_hour: (string instead of number)', () => {
						it('should return a 400 status', async () => {
							const jwt = generateToken([
								Permissions.PERMISSION_ADD_EMPLOYEE,
							]);

							const payload = {
								username: 'IThomas',
								password: 'BadBoys',
								first_name: 'Isaiah',
								last_name: 'Thomas',
								role: Role.RECEPTIONIST,
								permissions: [
									Permissions.PERMISSION_GET_EMPLOYEE,
									Permissions.PERMISSION_ADD_EMPLOYEE,
								],
								body_rate: 12.34,
								feet_rate: 19,
								per_hour: 'test',
							};

							await supertest(app)
								.post('/api/employee')
								.set('Authorization', `Bearer ${jwt}`)
								.send(payload)
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('per_hour: (negative number)', () => {
						it('should return a 400 status', async () => {
							const jwt = generateToken([
								Permissions.PERMISSION_ADD_EMPLOYEE,
							]);

							const payload = {
								username: 'IThomas',
								password: 'BadBoys',
								first_name: 'Isaiah',
								last_name: 'Thomas',
								role: Role.RECEPTIONIST,
								permissions: [
									Permissions.PERMISSION_GET_EMPLOYEE,
									Permissions.PERMISSION_ADD_EMPLOYEE,
								],
								body_rate: 12.34,
								feet_rate: 19,
								per_hour: -1,
							};

							await supertest(app)
								.post('/api/employee')
								.set('Authorization', `Bearer ${jwt}`)
								.send(payload)
								.expect(HttpCode.BAD_REQUEST);
						});
					});

					describe('per_hour: (0)', () => {
						it('should return a 400 status', async () => {
							const jwt = generateToken([
								Permissions.PERMISSION_ADD_EMPLOYEE,
							]);

							const payload = {
								username: 'IThomas',
								password: 'BadBoys',
								first_name: 'Isaiah',
								last_name: 'Thomas',
								role: Role.RECEPTIONIST,
								permissions: [
									Permissions.PERMISSION_GET_EMPLOYEE,
									Permissions.PERMISSION_ADD_EMPLOYEE,
								],
								body_rate: 12.34,
								feet_rate: 19,
								per_hour: 0,
							};

							await supertest(app)
								.post('/api/employee')
								.set('Authorization', `Bearer ${jwt}`)
								.send(payload)
								.expect(HttpCode.BAD_REQUEST);
						});
					});
				});
			});

			describe('given valid request', () => {
				/*describe('given username already exists', () => {
					it('should return a 409 status', async () => {
						const jwt = generateToken([
							Permissions.PERMISSION_ADD_EMPLOYEE,
						]);

						const payload = {
							username: 'LBird',
							password: 'BadBoys',
							first_name: 'Isaiah',
							last_name: 'Thomas',
							role: Role.RECEPTIONIST,
							permissions: [
								Permissions.PERMISSION_GET_EMPLOYEE,
								Permissions.PERMISSION_ADD_EMPLOYEE,
							],
							body_rate: 12.34,
							feet_rate: 19,
							per_hour: 10,
						};

						await supertest(app)
							.post('/api/employee')
							.set('Authorization', `Bearer ${jwt}`)
							.send(payload)
							.expect(HttpCode.CONFLICT);
					});
				});*/

				describe('given username does not already exist', () => {
					it('should return a 200 status along with newly created employee', async () => {
						const jwt = generateToken([
							Permissions.PERMISSION_ADD_EMPLOYEE,
						]);

						const { body, statusCode } = await supertest(app)
							.post('/api/employee')
							.set('Authorization', `Bearer ${jwt}`)
							.send(employeePayload);

						expect(statusCode).toBe(HttpCode.CREATED);
						expect(body.username).toEqual(employeePayload.username);
					});
				});
			});
		});
	});

	describe('delete employee route', () => {
		describe('without logging in', () => {
			it('should return a 401 status', async () => {
				const employeeId = 8;

				await supertest(app)
					.delete(`/api/employee/${employeeId}`)
					.expect(HttpCode.UNAUTHORIZED);
			});
		});

		describe('after logging in with missing permissions', () => {
			it('should return a 401 status', async () => {
				const employeeId = 8;
				const jwt = generateToken([]);

				await supertest(app)
					.delete(`/api/employee/${employeeId}`)
					.set('Authorization', `Bearer ${jwt}`)
					.expect(HttpCode.UNAUTHORIZED);
			});
		});

		describe('after logging in with correct permissions', () => {
			describe('given invalid param: employee_id', () => {
				describe('employee_id (string instead of number)', () => {
					it('should return a 400 status', async () => {
						const employeeId = 'test';
						const jwt = generateToken([
							Permissions.PERMISSION_DELETE_EMPLOYEE,
						]);

						await supertest(app)
							.delete(`/api/employee/${employeeId}`)
							.set('Authorization', `Bearer ${jwt}`)
							.expect(HttpCode.BAD_REQUEST);
					});
				});

				describe('employee_id (negative number)', () => {
					it('should return a 400 status', async () => {
						const employeeId = -1;
						const jwt = generateToken([
							Permissions.PERMISSION_DELETE_EMPLOYEE,
						]);

						await supertest(app)
							.delete(`/api/employee/${employeeId}`)
							.set('Authorization', `Bearer ${jwt}`)
							.expect(HttpCode.BAD_REQUEST);
					});
				});

				describe('employee_id (0)', () => {
					it('should return a 400 status', async () => {
						const employeeId = 0;
						const jwt = generateToken([
							Permissions.PERMISSION_DELETE_EMPLOYEE,
						]);

						await supertest(app)
							.delete(`/api/employee/${employeeId}`)
							.set('Authorization', `Bearer ${jwt}`)
							.expect(HttpCode.BAD_REQUEST);
					});
				});

				describe('employee_id (float)', () => {
					it('should return a 400 status', async () => {
						const employeeId = 1.35;
						const jwt = generateToken([
							Permissions.PERMISSION_DELETE_EMPLOYEE,
						]);

						await supertest(app)
							.delete(`/api/employee/${employeeId}`)
							.set('Authorization', `Bearer ${jwt}`)
							.expect(HttpCode.BAD_REQUEST);
					});
				});
			});

			describe('given employee does not exist/inactive', () => {
				it('should return a 304 status', async () => {
					const employeeId = 6;
					const jwt = generateToken([
						Permissions.PERMISSION_DELETE_EMPLOYEE,
					]);

					await supertest(app)
						.delete(`/api/employee/${employeeId}`)
						.set('Authorization', `Bearer ${jwt}`)
						.expect(HttpCode.NOT_MODIFIED);
				});
			});

			describe('given employee is active', () => {
				it('should return a 204 status', async () => {
					const employeeId = 1;
					const jwt = generateToken([
						Permissions.PERMISSION_DELETE_EMPLOYEE,
					]);

					await supertest(app)
						.delete(`/api/employee/${employeeId}`)
						.set('Authorization', `Bearer ${jwt}`)
						.expect(HttpCode.NO_CONTENT);
				});
			});
		});
	});
});
