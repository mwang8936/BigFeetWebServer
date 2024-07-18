import { Customer } from '../models/customer.models';

export const getCustomers = async () => {
	return Customer.find();
};

export const getCustomer = async (phoneNumber: string) => {
	return Customer.findOne({
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
	const customer = await getCustomer(phoneNumber);

	if (customer) {
		const updates: Partial<Customer> = {};

		if (customerName !== undefined) {
			updates.customer_name = customerName;
		}

		if (notes !== undefined) {
			updates.notes = notes;
		}

		Object.assign(customer, updates);

		return customer.save();
	} else {
		return null;
	}
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

	return customer.save();
};

export const deleteCustomer = async (phoneNumber: string) => {
	const customer = await getCustomer(phoneNumber);

	if (customer) {
		return customer.remove();
	} else {
		return null;
	}
};
