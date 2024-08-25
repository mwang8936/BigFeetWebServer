import { Not } from 'typeorm';
import { DuplicateIdentifierError } from '../exceptions/duplicate-identifier-error';
import { Customer } from '../models/customer.models';

export const getCustomers = async (withDeleted?: boolean) => {
	return Customer.find({
		withDeleted,
		order: {
			customer_name: 'ASC',
			phone_number: 'ASC',
			vip_serial: 'ASC',
		},
	});
};

export const getCustomer = async (
	customerId: number,
	withDeleted?: boolean
) => {
	return Customer.findOne({
		where: {
			customer_id: customerId,
		},
		withDeleted,
	});
};

export const updateCustomer = async (
	customerId: number,
	phoneNumber: string | null,
	vipSerial: string | null,
	customerName?: string | null,
	notes?: string | null
) => {
	const customer = await getCustomer(customerId);

	if (customer) {
		const updates: Partial<Customer> = {};

		if (phoneNumber !== undefined) {
			if (phoneNumber !== null) {
				await duplicatePhoneNumberChecker(phoneNumber, customerId);
			}

			updates.phone_number = phoneNumber;
		}

		if (vipSerial !== undefined) {
			if (vipSerial !== null) {
				await duplicateVipSerialChecker(vipSerial, customerId);
			}

			updates.vip_serial = vipSerial;
		}

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
	phoneNumber?: string,
	vipSerial?: string,
	customerName?: string,
	notes?: string
) => {
	if (phoneNumber !== undefined) {
		await duplicatePhoneNumberChecker(phoneNumber);
	}

	if (vipSerial !== undefined) {
		await duplicateVipSerialChecker(vipSerial);
	}

	const customer = Customer.create({
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
		if (customer.phone_number) {
			await duplicatePhoneNumberChecker(customer.phone_number);
		}

		if (customer.vip_serial) {
			await duplicateVipSerialChecker(customer.vip_serial);
		}

		return customer.recover();
	} else {
		return null;
	}
};

const duplicatePhoneNumberChecker = async (
	phoneNumber: string,
	customerId?: number
) => {
	const duplicates = await Customer.find({
		where: {
			customer_id: customerId && Not(customerId),
			phone_number: phoneNumber,
		},
	});

	if (duplicates.length > 0) {
		throw new DuplicateIdentifierError('Customer', 'Phone Number', phoneNumber);
	}
};

const duplicateVipSerialChecker = async (
	vipSerial: string,
	customerId?: number
) => {
	const duplicates = await Customer.find({
		where: {
			customer_id: customerId && Not(customerId),
			vip_serial: vipSerial,
		},
	});

	if (duplicates.length > 0) {
		throw new DuplicateIdentifierError('Customer', 'VIP Serial', vipSerial);
	}
};
