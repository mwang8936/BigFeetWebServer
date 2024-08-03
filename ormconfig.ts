import { DataSource } from 'typeorm';
import MY_SQL_DATA_SOURCES from './api/config/db.config';
import ENV_VARIABLES from './api/config/env.config';
import { Employee } from './api/models/employee.models';
import { Service } from './api/models/service.models';
import { Reservation } from './api/models/reservation.models';
import { Customer } from './api/models/customer.models';
import { Schedule } from './api/models/schedule.models';
import { VipPackage } from './api/models/vip-package.models';
import { GiftCard } from './api/models/gift-card.models';

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
	migrations: ['api/migrations/*.ts'],
	// logging: ENV_VARIABLES.NODE_ENV == 'development',
	// synchronize: ENV_VARIABLES.NODE_ENV == 'development',
	// dropSchema: ENV_VARIABLES.NODE_ENV == 'development',
});

export default AppDataSource;
