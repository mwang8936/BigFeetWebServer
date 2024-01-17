import { DataSource } from 'typeorm';
import MY_SQL_DATA_SOURCES from '../config/db.config';
import ENV_VARIABLES from './env.config';
import { Employee } from '../models/employee.models';
import { Service } from '../models/service.models';
import { Reservation } from '../models/reservation.models';
import { Customer } from '../models/customer.models';
import { Schedule } from '../models/schedule.models';
import { VipPackage } from '../models/vip-package.models';

const AppDataSource = new DataSource({
	type: 'mysql',
	host: MY_SQL_DATA_SOURCES.DB_HOST,
	port: MY_SQL_DATA_SOURCES.DB_PORT,
	timezone: '-08:00',
	username: MY_SQL_DATA_SOURCES.DB_USER,
	password: MY_SQL_DATA_SOURCES.DB_PASSWORD,
	database: MY_SQL_DATA_SOURCES.DB_DATABASE,
	entities: [Employee, Schedule, Reservation, Service, Customer, VipPackage],
	// logging: ENV_VARIABLES.NODE_ENV == 'development',
	//synchronize: ENV_VARIABLES.NODE_ENV == 'development',
	//dropSchema: ENV_VARIABLES.NODE_ENV == 'development',
});

export default AppDataSource;
