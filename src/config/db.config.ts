import * as dotenv from 'dotenv';

dotenv.config();

const MY_SQL_DATA_SOURCES = {
	DB_HOST: process.env.MY_SQL_DB_HOST,
	DB_USER: process.env.MY_SQL_DB_USER,
	DB_PASSWORD: process.env.MY_SQL_DB_PASSWORD,
	DB_PORT: process.env.MY_SQL_DB_PORT
		? parseInt(process.env.MY_SQL_DB_PORT)
		: 3306,
	DB_DATABASE: process.env.MY_SQL_DB_DATABASE,
	DB_POOL_SIZE: process.env.MY_SQL_DB_POOL_SIZE
		? parseInt(process.env.MY_SQL_DB_POOL_SIZE)
		: 10,
};

export default MY_SQL_DATA_SOURCES;
