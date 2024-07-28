import { DuplicateIdentifierError } from '../exceptions/duplicate-identifier-error';
import { Customer } from '../models/customer.models';

export const getCustomers = async (withDeleted?: boolean) => {
	return Customer.find({
		withDeleted,
	});
};

export const getCustomer = async (
	phoneNumber: string,
	withDeleted?: boolean
) => {
	return Customer.findOne({
		where: {
			phone_number: phoneNumber,
		},
		withDeleted,
	});
};

export const updateCustomer = async (
	phoneNumber: string,
	customerName?: string | null,
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
	customerName?: string,
	notes?: string
) => {
	await duplicatePhoneNumberChecker(phoneNumber);

	const customer = Customer.create({
		phone_number: phoneNumber,
		customer_name: customerName,
		notes,
	});

	return customer.save();
};

export const deleteCustomer = async (phoneNumber: string) => {
	const customer = await getCustomer(phoneNumber, false);

	if (customer) {
		return customer.softRemove();
	} else {
		return null;
	}
};

export const recoverCustomer = async (phoneNumber: string) => {
	const customer = await getCustomer(phoneNumber, true);

	if (customer) {
		return customer.recover();
	} else {
		return null;
	}
};

const duplicatePhoneNumberChecker = async (phoneNumber: string) => {
	const duplicates = await Customer.find({
		where: {
			phone_number: phoneNumber,
		},
	});

	if (duplicates.length > 0) {
		throw new DuplicateIdentifierError('Customer', 'Phone Number', phoneNumber);
	}
};
