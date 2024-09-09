import { FindOptionsWhere, LessThan, MoreThan, MoreThanOrEqual } from 'typeorm';
import AppDataSource from '../config/orm.config';

import { ExistingRecordError } from '../exceptions/existing-record-error';
import { MissingRecordError } from '../exceptions/missing-record-error';

import { CustomerRecord } from '../models/customer-record.models';
import { Reservation } from '../models/reservation.models';

export const getCustomerRecords = async (date: string) => {
	const customerRecordsRepository = AppDataSource.getRepository(CustomerRecord);

	return customerRecordsRepository
		.createQueryBuilder('customer_history')
		.where('customer_history.valid_from <= :date', { date })
		.andWhere(
			'(customer_history.valid_to IS NULL OR customer_history.valid_to > :date)',
			{ date }
		)
		.distinctOn(['customer_history.customer_id'])
		.orderBy('customer_history.valid_from', 'ASC')
		.getMany();
};

const sameCustomers = (
	customer1: CustomerRecord,
	customer2: CustomerRecord
): boolean => {
	const compareFields = (field1: any, field2: any): boolean => {
		// If either field is undefined, treat as the same
		if (field1 === undefined || field2 === undefined) {
			return true;
		}

		// If both fields are null, treat as the same
		if (field1 === null && field2 === null) {
			return true;
		}

		// If both fields are strictly equal (and not null/undefined), treat as the same
		return field1 === field2;
	};

	return (
		compareFields(customer1.customer_name, customer2.customer_name) &&
		compareFields(customer1.notes, customer2.notes)
	);
};

const findPreviousCustomerRecord = async (
	customerId: number,
	date: string
): Promise<CustomerRecord | null> => {
	const customerRecordsRepository = AppDataSource.getRepository(CustomerRecord);

	return customerRecordsRepository
		.createQueryBuilder('customer_history')
		.where('customer_history.customer_id = :customerId', { customerId })
		.andWhere('customer_history.valid_from < :date', { date })
		.orderBy('customer_history.valid_from', 'DESC')
		.getOne();
};

const findNextCustomerRecord = async (
	customerId: number,
	date: string
): Promise<CustomerRecord | null> => {
	const customerRecordsRepository = AppDataSource.getRepository(CustomerRecord);

	return customerRecordsRepository
		.createQueryBuilder('customer_history')
		.where('customer_history.customer_id = :customerId', { customerId })
		.andWhere('customer_history.valid_from > :date', { date })
		.orderBy('customer_history.valid_from', 'ASC')
		.getOne();
};

export const updateCustomerRecord = async (
	customerId: number,
	validFrom: string,
	customerName?: string | null,
	notes?: string | null
): Promise<CustomerRecord | null> => {
	const currentCustomerRecord = await CustomerRecord.findOne({
		where: {
			customer_id: customerId,
			valid_from: validFrom,
		},
	});

	if (!currentCustomerRecord)
		throw new MissingRecordError('Customer', customerId, validFrom);

	const updatedCustomerRecord = CustomerRecord.create({
		customer_id: currentCustomerRecord.customer_id,
		valid_from: currentCustomerRecord.valid_from,
		valid_to: currentCustomerRecord.valid_to,
		customer_name: customerName,
		notes,
	});

	if (sameCustomers(currentCustomerRecord, updatedCustomerRecord)) return null;

	// Check to see if there was a previous customer record before the given date
	const prevCustomerRecord = await findPreviousCustomerRecord(
		customerId,
		validFrom
	);

	const nextCustomerRecord = await findNextCustomerRecord(
		customerId,
		validFrom
	);

	if (
		prevCustomerRecord &&
		sameCustomers(prevCustomerRecord, updatedCustomerRecord)
	) {
		// If previous customer is the same as the updated customer record,
		// then extend previous customer record's valid to and remove current customer record.

		// If next customer record is also equal to updated customer record, then also delete next customer record,
		// and extend previous customer record's valid to to the end of next customer record's valid to.
		if (
			nextCustomerRecord &&
			sameCustomers(updatedCustomerRecord, nextCustomerRecord)
		) {
			prevCustomerRecord.valid_to = nextCustomerRecord.valid_to;

			await AppDataSource.transaction(async (transactionalEntityManager) => {
				await transactionalEntityManager.update(
					Reservation,
					{ customer: currentCustomerRecord },
					{ customer: prevCustomerRecord }
				);
				await transactionalEntityManager.update(
					Reservation,
					{ customer: nextCustomerRecord },
					{ customer: prevCustomerRecord }
				);

				await transactionalEntityManager.save(prevCustomerRecord);
				await transactionalEntityManager.remove(currentCustomerRecord);
				await transactionalEntityManager.remove(nextCustomerRecord);
			});
		} else {
			prevCustomerRecord.valid_to = currentCustomerRecord.valid_to;

			await AppDataSource.transaction(async (transactionalEntityManager) => {
				await transactionalEntityManager.update(
					Reservation,
					{ customer: currentCustomerRecord },
					{ customer: prevCustomerRecord }
				);

				await transactionalEntityManager.save(prevCustomerRecord);
				await transactionalEntityManager.remove(currentCustomerRecord);
			});
		}

		return prevCustomerRecord;
	} else {
		const nextCustomerRecord = await findNextCustomerRecord(
			customerId,
			validFrom
		);

		if (
			nextCustomerRecord &&
			sameCustomers(updatedCustomerRecord, nextCustomerRecord)
		) {
			// If next customer record is the same as the udpated customer record, then delete the next customer record
			// and extend the current customer record's valid to to the end of next customer record's valid to.
			currentCustomerRecord.valid_to = nextCustomerRecord.valid_to;

			await AppDataSource.transaction(async (transactionalEntityManager) => {
				await transactionalEntityManager.update(
					Reservation,
					{ customer: nextCustomerRecord },
					{ customer: currentCustomerRecord }
				);

				await transactionalEntityManager.save(currentCustomerRecord);
				await transactionalEntityManager.remove(nextCustomerRecord);
			});

			return currentCustomerRecord;
		} else {
			// If previous customer record/next customer record do not exist, or are not the same,
			// then just update the fields of the current customer record.
			const updates: Partial<CustomerRecord> = {};

			if (customerName !== undefined) {
				updates.customer_name = customerName;
			}

			if (notes !== undefined) {
				updates.notes = notes;
			}

			Object.assign(currentCustomerRecord, updates);

			return currentCustomerRecord.save();
		}
	}
};

export const addCustomerRecord = async (
	customerId: number,
	date: string,
	customerName?: string,
	notes?: string
): Promise<CustomerRecord | null> => {
	const newCustomerRecord = CustomerRecord.create({
		customer_id: customerId,
		valid_from: date,
		customer_name: customerName,
		notes,
	});

	// Check to see if there was a previous customer record before the given date
	const prevCustomerRecord = await findPreviousCustomerRecord(customerId, date);
	const nextCustomerRecord = await findNextCustomerRecord(customerId, date);

	if (prevCustomerRecord) {
		// If a record already exists with the same customer id and date, you should be using the update record API call.
		if (prevCustomerRecord.valid_from === date)
			throw new ExistingRecordError('Customer', customerId, date);

		// If previous customer is the same as the new customer record, then no need to add a new record.
		if (sameCustomers(prevCustomerRecord, newCustomerRecord)) return null;

		if (
			nextCustomerRecord &&
			sameCustomers(newCustomerRecord, nextCustomerRecord)
		) {
			// If our next customer record is the same as our new customer record,
			// just extend our next customer record's valid from date to the specified date.
			nextCustomerRecord.valid_from = date;
			prevCustomerRecord.valid_to = date;

			await AppDataSource.transaction(async (transactionalEntityManager) => {
				await transactionalEntityManager.save(prevCustomerRecord);
				await transactionalEntityManager.save(nextCustomerRecord);

				const whereCondition: FindOptionsWhere<Reservation> = {
					customer: prevCustomerRecord,
				};

				if (nextCustomerRecord.valid_to === null) {
					whereCondition.date = MoreThanOrEqual(nextCustomerRecord.valid_from);
				} else {
					whereCondition.date =
						MoreThanOrEqual(nextCustomerRecord.valid_from) &&
						LessThan(nextCustomerRecord.valid_to);
				}

				await transactionalEntityManager.update(Reservation, whereCondition, {
					customer: nextCustomerRecord,
				});
			});

			return nextCustomerRecord;
		} else {
			// Our new customer record is valid to the previous customer record's valid to or null if it did not exist.
			newCustomerRecord.valid_to = prevCustomerRecord.valid_to;
			prevCustomerRecord.valid_to = date;

			await AppDataSource.transaction(async (transactionalEntityManager) => {
				await transactionalEntityManager.save(prevCustomerRecord);
				await transactionalEntityManager.save(newCustomerRecord);

				const whereCondition: FindOptionsWhere<Reservation> = {
					customer: prevCustomerRecord,
				};

				if (newCustomerRecord.valid_to === null) {
					whereCondition.date = MoreThanOrEqual(newCustomerRecord.valid_from);
				} else {
					whereCondition.date =
						MoreThanOrEqual(newCustomerRecord.valid_from) &&
						LessThan(newCustomerRecord.valid_to);
				}

				await transactionalEntityManager.update(Reservation, whereCondition, {
					customer: newCustomerRecord,
				});
			});

			return newCustomerRecord;
		}
	} else if (nextCustomerRecord) {
		if (sameCustomers(newCustomerRecord, nextCustomerRecord)) {
			// If our next customer record is the same as our new customer record,
			// just extend our next customer record's valid from date to the specified date.
			nextCustomerRecord.valid_from = date;

			return nextCustomerRecord.save();
		} else {
			// Our new customer record is valid to the next customer record.
			newCustomerRecord.valid_to = nextCustomerRecord.valid_from;

			return newCustomerRecord.save();
		}
	} else {
		// If no previous or next customer records exist, then our new customer record is valid to indefinitely.
		return newCustomerRecord.save();
	}
};
