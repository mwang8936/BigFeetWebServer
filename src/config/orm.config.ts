import { DataSource } from 'typeorm';
import POSTGRESQL_DATA_SOURCE from './db.config';
import ENV_VARIABLES from './env.config';
import { Employee } from '../models/employee.models';
import { Service } from '../models/service.models';
import { Reservation } from '../models/reservation.models';
import { Customer } from '../models/customer.models';
import { Schedule } from '../models/schedule.models';
import { VipPackage } from '../models/vip-package.models';
import { GiftCard } from '../models/gift-card.models';

const AppDataSource = new DataSource({
	type: 'postgres',
	host: POSTGRESQL_DATA_SOURCE.DB_HOST,
	port: POSTGRESQL_DATA_SOURCE.DB_PORT,
	username: POSTGRESQL_DATA_SOURCE.DB_USER,
	password: POSTGRESQL_DATA_SOURCE.DB_PASSWORD,
	database: POSTGRESQL_DATA_SOURCE.DB_DATABASE,
	poolSize: POSTGRESQL_DATA_SOURCE.DB_POOL_SIZE,
	ssl: {
		rejectUnauthorized: false,
	},
	extra: {
		max: POSTGRESQL_DATA_SOURCE.DB_POOL_SIZE,
		idleTimeoutMillis: 10000,
		connectionTimeoutMillis: 2000,
	},
	entities: [
		Employee,
		Schedule,
		Reservation,
		Service,
		Customer,
		VipPackage,
		GiftCard,
	],
	synchronize: false,
	migrations:
		ENV_VARIABLES.NODE_ENV !== 'development'
			? ['dist/migrations/*.js']
			: ['src/migrations/*.ts'],
});

export default AppDataSource;
