import AppDataSource from '../config/orm.config';

import { Customer } from '../models/customer.models';

// export const getCustomers = async (
// 	search?: string,
// 	withDeleted?: boolean,
// 	limit: number = 10,
// 	offset: number = 0
// ) => {
// 	const customerRepository = AppDataSource.getRepository(Customer);

// 	const queryBuilder = customerRepository.createQueryBuilder('customers');

// 	if (withDeleted) {
// 		queryBuilder.withDeleted();
// 	}

// };

export const getCustomers = async (withDeleted?: boolean) => {
	return Customer.find({
		withDeleted,
		order: {
			phone_number: 'ASC',
			vip_serial: 'ASC',
		},
	});
};

export const getCustomer = async (
	customerId: number,
	withDeleted?: boolean,
	withRecords?: boolean
) => {
	return Customer.findOne({
		where: {
			customer_id: customerId,
		},
		withDeleted,
		relations: withRecords ? ['records'] : undefined,
	});
};

export const updateCustomer = async (
	customerId: number,
	phoneNumber?: string | null,
	vipSerial?: string | null
) => {
	const customer = await getCustomer(customerId);

	if (customer) {
		const updates: Partial<Customer> = {};

		if (phoneNumber !== undefined) {
			updates.phone_number = phoneNumber;
		}

		if (vipSerial !== undefined) {
			updates.vip_serial = vipSerial;
		}

		Object.assign(customer, updates);

		return customer.save();
	} else {
		return null;
	}
};

export const createCustomer = async (
	validFrom: string,
	phoneNumber?: string,
	vipSerial?: string,
	customerName?: string,
	notes?: string
) => {
	const customer = Customer.create({
		valid_from: validFrom,
		phone_number: phoneNumber,
		vip_serial: vipSerial,
		customer_name: customerName,
		notes,
	});

	return customer.save();
};

export const deleteCustomer = async (customerId: number) => {
	const customer = await getCustomer(customerId, false);

	if (customer) {
		return customer.softRemove();
	} else {
		return null;
	}
};

export const recoverCustomer = async (customerId: number) => {
	const customer = await getCustomer(customerId, true);

	if (customer) {
		return customer.recover();
	} else {
		return null;
	}
};
