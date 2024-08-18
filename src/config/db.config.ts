import * as dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error('DATABASE_URL environment variable is not defined');
}

const parsedUrl = new URL(databaseUrl);

const POSTGRESQL_DATA_SOURCE = {
	DB_HOST: parsedUrl.hostname,
	DB_USER: parsedUrl.username,
	DB_PASSWORD: parsedUrl.password,
	DB_PORT: parsedUrl.port ? parseInt(parsedUrl.port) : 5432,
	DB_DATABASE: parsedUrl.pathname.slice(1),
	DB_POOL_SIZE: process.env.DATABASE_POOL_SIZE
		? parseInt(process.env.DATABASE_POOL_SIZE)
		: 10,
};

export default POSTGRESQL_DATA_SOURCE;
