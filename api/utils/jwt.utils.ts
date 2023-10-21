import { sign, SignOptions, VerifyOptions, verify } from 'jsonwebtoken';
import { Permissions } from '../models/enums';
import * as fs from 'fs';
import * as path from 'path';

export function generateToken(
	employee_id: number,
	permissions: Permissions[]
): string {
	const privateKey = fs.readFileSync(
		path.join(__dirname, '../../Private.key')
	);

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
	const publicKey = fs.readFileSync(path.join(__dirname, '../../Public.key'));

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
