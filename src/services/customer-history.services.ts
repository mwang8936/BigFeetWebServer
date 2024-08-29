import AppDataSource from '../config/orm.config';

import { CustomerHistory } from '../models/customer-history.models';

export const getCustomerHistories = async (date: Date) => {
	const customerHistoryRepository =
		AppDataSource.getRepository(CustomerHistory);

	return customerHistoryRepository
		.createQueryBuilder('customer_history')
		.where('customer_history.valid_from <= :date', { date })
		.andWhere(
			'(customer_history.valid_to IS NULL OR customer_history.valid_to > :date)',
			{ date }
		)
		.distinctOn(['customer_history.customer_id'])
		.getMany();
};
