import bcrypt from 'bcrypt';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import saltRounds from '../config/password.config';
import rateLimiter from '../config/rate-limiter.config';
import { REFRESH_TOKEN_EXPIRATION } from '../constants/time.constants';
import { HttpCode } from '../exceptions/custom-error';
import { LoginError } from '../exceptions/login-error';
import { TooManyRequestsError } from '../exceptions/too-many-requests-error';
import { getUserInfo } from '../services/login.services';
import * as DeviceServices from '../services/device.services';
import {
	generateAccessToken,
	generateRefreshToken,
	validateRefreshToken,
} from '../utils/jwt.utils';
import { AuthorizationError } from '../exceptions/authorization-error';
import { ForbiddenError } from '../exceptions/forbidden-error';

export const login: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await rateLimiter.consume(req.ip).catch(() => {
			throw new TooManyRequestsError();
		});

		const account = await getUserInfo(req.body.username);
		if (account == null) throw new LoginError();

		const hashedPassword = account.password;
		const passwordMatch = await bcrypt.compare(
			req.body.password,
			hashedPassword
		);
		if (!passwordMatch) throw new LoginError(account.username);

		const employeeId = account.employee_id;
		const permissions = account.permissions;

		const user = Object(account);
		delete user['password'];

		rateLimiter.delete(req.ip);

		const deviceId = req.body.device_id;
		if (deviceId) {
			const refreshToken = generateRefreshToken(employeeId, deviceId);

			res.cookie('refresh_token', refreshToken, {
				httpOnly: true, // Makes cookie inaccessible to JavaScript (more secure)
				secure: process.env.NODE_ENV !== 'development', // Use only with HTTPSAdd commentMore actions
				maxAge: REFRESH_TOKEN_EXPIRATION, // Expiration time (30 days)
				sameSite: 'lax',
			});

			const hashedRefreshToken = await bcrypt.hash(refreshToken, saltRounds);

			await DeviceServices.upsertDevice(
				deviceId,
				employeeId,
				req.body.device_name,
				req.body.device_model,
				req.body.push_token,
				hashedRefreshToken
			);
		}

		res.status(HttpCode.OK).json({
			user,
			accessToken: generateAccessToken(employeeId, permissions),
		});
	} catch (err) {
		next(err);
	}
};

export const refresh: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await rateLimiter.consume(req.ip).catch(() => {
			throw new TooManyRequestsError();
		});

		const { refresh_token } = req.cookies;
		if (!refresh_token) {
			throw new AuthorizationError(undefined, 'Refresh token missing');
		}

		const { employee_id, device_id } = await validateRefreshToken(
			refresh_token
		);

		const device = await DeviceServices.getDevice(device_id, employee_id);
		if (!device?.refresh_token) {
			throw new ForbiddenError();
		}

		const isRefreshTokenValid = await bcrypt.compare(
			refresh_token,
			device.refresh_token
		);
		if (!isRefreshTokenValid) {
			throw new ForbiddenError();
		}

		const newRefreshToken = generateRefreshToken(employee_id, device_id);
		res.cookie('refresh_token', newRefreshToken, {
			httpOnly: true, // Makes cookie inaccessible to JavaScript (more secure)
			secure: process.env.NODE_ENV !== 'development', // Use only with HTTPSAdd commentMore actions
			maxAge: REFRESH_TOKEN_EXPIRATION, // Expiration time (30 days)
			sameSite: 'lax',
		});

		const newHashedRefreshToken = await bcrypt.hash(
			newRefreshToken,
			saltRounds
		);

		await DeviceServices.upsertDevice(
			device_id,
			employee_id,
			undefined,
			undefined,
			newHashedRefreshToken
		);

		const employee = device.employee;

		res.status(HttpCode.OK).json({
			user: employee,
			accessToken: generateAccessToken(employee_id, employee.permissions),
		});
	} catch (err) {
		next(err);
	}
};
