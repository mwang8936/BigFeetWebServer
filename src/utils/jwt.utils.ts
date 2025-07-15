import { sign, SignOptions, VerifyOptions, verify } from 'jsonwebtoken';
import { Permissions } from '../models/enums';

export function generateAccessToken(
	employee_id: number,
	permissions: Permissions[]
): string {
	const privateKey = process.env.PRIVATE_KEY as string;

	const signInOptions: SignOptions = {
		algorithm: 'RS256',
		expiresIn: '24h',
	};

	return sign({ employee_id, permissions }, privateKey, signInOptions);
}

export function generateRefreshToken(
	employee_id: number,
	device_id: string
): string {
	const privateKey = process.env.PRIVATE_KEY as string;

	const signInOptions: SignOptions = {
		algorithm: 'RS256',
		expiresIn: '30d',
	};

	return sign({ employee_id, device_id }, privateKey, signInOptions);
}

interface AccessTokenPayload {
	exp: number;
	employee_id: number;
	permissions: Permissions[];
}

export function validateAccessToken(
	token: string
): Promise<AccessTokenPayload> {
	const publicKey = process.env.PUBLIC_KEY as string;

	const verifyOptions: VerifyOptions = {
		algorithms: ['RS256'],
	};

	return new Promise((resolve, reject) => {
		verify(token, publicKey, verifyOptions, (error, decoded) => {
			if (error) return reject(error);
			else resolve(decoded as AccessTokenPayload);
		});
	});
}

interface RefreshTokenPayload {
	exp: number;
	employee_id: number;
	device_id: string;
}

export function validateRefreshToken(
	token: string
): Promise<RefreshTokenPayload> {
	const publicKey = process.env.PUBLIC_KEY as string;

	const verifyOptions: VerifyOptions = {
		algorithms: ['RS256'],
	};

	return new Promise((resolve, reject) => {
		verify(token, publicKey, verifyOptions, (error, decoded) => {
			if (error) return reject(error);
			else resolve(decoded as RefreshTokenPayload);
		});
	});
}
