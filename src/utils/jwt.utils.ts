import { sign, SignOptions, VerifyOptions, verify } from 'jsonwebtoken';
import { Permissions } from '../models/enums';
import * as fs from 'fs';
import * as path from 'path';

export function generateToken(
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

interface TokenPayload {
	exp: number;
	employee_id: number;
	permissions: Permissions[];
}

export function validateToken(token: string): Promise<TokenPayload> {
	const publicKey = process.env.PUBLIC_KEY as string;

	const verifyOptions: VerifyOptions = {
		algorithms: ['RS256'],
	};

	return new Promise((resolve, reject) => {
		verify(token, publicKey, verifyOptions, (error, decoded) => {
			if (error) return reject(error);
			else resolve(decoded as TokenPayload);
		});
	});
}
