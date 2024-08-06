import * as dotenv from 'dotenv';

dotenv.config();

const ENV_VARIABLES = {
	HOSTNAME: process.env.HOSTNAME || 'hostname',
	PORT: process.env.PORT ? parseInt(process.env.PORT) : 7000,
	NODE_ENV: process.env.NODE_ENV || 'development',
};

export default ENV_VARIABLES;
