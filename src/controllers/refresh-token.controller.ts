import bcrypt from 'bcrypt';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpCode } from '../exceptions/custom-error';
import {
	getRefreshToken,
	replaceRefreshToken,
} from '../services/refresh-token.services';
import {
	generateAccessToken,
	generateRefreshToken,
	validateRefreshToken,
} from '../utils/jwt.utils';
import saltRounds from '../config/password.config';
import { AuthorizationError } from '../exceptions/authorization-error';
import { ForbiddenError } from '../exceptions/forbidden-error';

export const refreshToken: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// Get the refresh token from the cookie
		const { refresh_token } = req.cookies;
		if (!refresh_token) {
			throw new AuthorizationError(undefined, 'Refresh token missing');
		}

		// Validate the JWT refresh token (this checks the signature and expiry)
		const decodedToken = await validateRefreshToken(refresh_token);
		const employeeId = decodedToken.employee_id;

		// Hash the refresh token to compare with the stored one (note: using secure random string for refresh token is an alternative)
		const hashedRefreshToken = await bcrypt.hash(refresh_token, saltRounds);

		// Get the refresh token from the database (check if it exists and is valid)
		const storedRefreshToken = await getRefreshToken(
			employeeId,
			hashedRefreshToken
		);
		if (!storedRefreshToken) throw new ForbiddenError();

		// Compare hashed refresh token with the stored value
		const validRefreshToken = await bcrypt.compare(
			hashedRefreshToken,
			storedRefreshToken.hashed_refresh_token
		);
		if (!validRefreshToken) throw new ForbiddenError();

		// Generate a new refresh token and set it in the cookies
		const newRefreshToken = generateRefreshToken(employeeId);
		res.cookie('refresh_token', newRefreshToken, {
			httpOnly: true, // Makes cookie inaccessible to JavaScript (more secure)
			secure: process.env.NODE_ENV !== 'development', // Use only with HTTPS
			maxAge: 1000 * 60 * 60 * 24 * 7, // Expiration time (7 days)
			sameSite: 'strict', // CSRF protection
		});

		// Hash and store the new refresh token in the database
		const newHashedRefreshToken = await bcrypt.hash(
			newRefreshToken,
			saltRounds
		);
		const newRefreshTokenExpiryDate = new Date(
			new Date().getTime() + 1000 * 60 * 60 * 24 * 7
		);

		// Replace the old refresh token from the database
		await replaceRefreshToken(
			employeeId,
			hashedRefreshToken,
			newHashedRefreshToken,
			newRefreshTokenExpiryDate
		);

		// Generate and send the new access token
		res.status(HttpCode.OK).json({
			accessToken: generateAccessToken(
				employeeId,
				storedRefreshToken.employee.permissions
			),
		});
	} catch (err) {
		next(err);
	}
};
