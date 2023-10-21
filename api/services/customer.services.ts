import { Customer } from '../models/customer.models';

export const getCustomers = async () => {
	return await Customer.find();
};

export const getCustomer = async (phoneNumber: string) => {
	return await Customer.findOne({
		where: {
			phone_number: phoneNumber,
		},
	});
};

export const updateCustomer = async (
	phoneNumber: string,
	customerName?: string,
	notes?: string | null
) => {
	const customer = Customer.create({
		customer_name: customerName,
		notes,
	});

	return await Customer.update(
		{
			phone_number: phoneNumber,
		},
		customer
	);
};

export const createCustomer = async (
	phoneNumber: string,
	customerName: string,
	notes?: string
) => {
	const customer = Customer.create({
		phone_number: phoneNumber,
		customer_name: customerName,
		notes,
	});

	return await customer.save();
};

export const deleteCustomer = async (phoneNumber: string) => {
	return await Customer.delete({ phone_number: phoneNumber });
};
