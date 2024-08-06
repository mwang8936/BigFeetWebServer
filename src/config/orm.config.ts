import { DataSource } from 'typeorm';
import MY_SQL_DATA_SOURCES from './db.config';
import ENV_VARIABLES from './env.config';
import { Employee } from '../models/employee.models';
import { Service } from '../models/service.models';
import { Reservation } from '../models/reservation.models';
import { Customer } from '../models/customer.models';
import { Schedule } from '../models/schedule.models';
import { VipPackage } from '../models/vip-package.models';
import { GiftCard } from '../models/gift-card.models';

const AppDataSource = new DataSource({
	type: 'mysql',
	host: MY_SQL_DATA_SOURCES.DB_HOST,
	port: MY_SQL_DATA_SOURCES.DB_PORT,
	timezone: '-08:00',
	username: MY_SQL_DATA_SOURCES.DB_USER,
	password: MY_SQL_DATA_SOURCES.DB_PASSWORD,
	database: MY_SQL_DATA_SOURCES.DB_DATABASE,
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
		ENV_VARIABLES.NODE_ENV === 'development'
			? ['src/migrations/*.ts']
			: ['dist/migrations/*.js'],
});

export default AppDataSource;
