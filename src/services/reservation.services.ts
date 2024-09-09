import { Reservation } from '../models/reservation.models';
import { Gender, TipMethod } from '../models/enums';
import {
	Between,
	FindOptionsWhere,
	In,
	LessThanOrEqual,
	MoreThanOrEqual,
} from 'typeorm';
import { Service } from '../models/service.models';
import { Customer } from '../models/customer.models';
import { NotFoundError } from '../exceptions/not-found-error';

import { CustomerRecord } from '../models/customer-record.models';
import AppDataSource from '../config/orm.config';

export const getReservations = async (
	fromDate?: Date,
	toDate?: Date,
	employeeIds?: number[]
) => {
	const whereCondition: FindOptionsWhere<Reservation>[] = [];
	if (fromDate && toDate) {
		whereCondition.push({ reserved_date: Between(fromDate, toDate) });
	} else if (fromDate) {
		whereCondition.push({ reserved_date: MoreThanOrEqual(fromDate) });
	} else if (toDate) {
		whereCondition.push({ reserved_date: LessThanOrEqual(toDate) });
	}
	employeeIds &&
		whereCondition.push({
			employee_id: In(employeeIds),
		});

	return Reservation.find({
		where: whereCondition,
		order: {
			reserved_date: 'ASC',
		},
	});
};

export const getReservation = async (reservationId: number) => {
	return Reservation.findOne({
		where: {
			reservation_id: reservationId,
		},
	});
};

const getCustomerRecord = async (
	customerId: number,
	date: string
): Promise<CustomerRecord | null> => {
	const customerRecordsRepository = AppDataSource.getRepository(CustomerRecord);

	return await customerRecordsRepository
		.createQueryBuilder('customer_history')
		.where('customer_history.customer_id = :customerId', { customerId })
		.andWhere('customer_history.valid_from <= :date', { date })
		.andWhere(
			'(customer_history.valid_to IS NULL OR customer_history.valid_to > :date)',
			{ date }
		)
		.orderBy('customer_history.valid_from', 'DESC')
		.getOne();
};

export const updateReservation = async (
	reservationId: number,
	updatedBy: string,
	reservedDate?: Date,
	date?: string,
	employeeId?: number,
	serviceId?: number,
	time?: number | null,
	bedsRequired?: number | null,
	customerId?: number | null,
	phoneNumber?: string | null,
	vipSerial?: string | null,
	customerName?: string | null,
	notes?: string | null,
	requestedGender?: Gender | null,
	requestedEmployee?: boolean,
	cash?: number | null,
	machine?: number | null,
	vip?: number | null,
	giftCard?: number | null,
	insurance?: number | null,
	tips?: number | null,
	tipMethod?: TipMethod | null,
	message?: string | null
) => {
	const reservation = await getReservation(reservationId);

	if (reservation) {
		const updates: Partial<Reservation> = {};

		updates.updated_by = updatedBy;

		if (reservedDate !== undefined) {
			updates.reserved_date = reservedDate;
		}

		if (date !== undefined) {
			updates.date = date;
		}

		if (employeeId !== undefined) {
			updates.employee_id = employeeId;
		}

		if (serviceId !== undefined) {
			const service = await Service.findOne({
				where: {
					service_id: serviceId,
				},
			});

			if (!service) throw new NotFoundError('Service', 'service id', serviceId);

			updates.service = service;
		}

		if (time !== undefined) {
			updates.time = time;
		}

		if (bedsRequired !== undefined) {
			updates.beds_required = bedsRequired;
		}

		const reservationDate = date ?? reservation.date;

		if (customerId) {
			const customerRecord = await getCustomerRecord(
				customerId,
				reservationDate
			);

			if (!customerRecord) {
				throw new NotFoundError('Customer', 'customer id', customerId);
			}

			updates.customer = customerRecord;
		} else if (phoneNumber || vipSerial) {
			const customer = Customer.create({
				phone_number: phoneNumber,
				vip_serial: vipSerial,
				customer_name: customerName,
				notes,
			});

			await customer.save();

			const customerRecord = CustomerRecord.create({
				customer_id: customer.customer_id,
				valid_from: reservationDate,
				phone_number: customer.phone_number,
				vip_serial: customer.vip_serial,
				customer_name: customer.customer_name,
				notes: customer.notes,
			});

			updates.customer = customerRecord;
		} else if (customerId === null) {
			updates.customer = null;
		}

		if (requestedGender !== undefined) {
			updates.requested_gender = requestedGender;
		}

		if (requestedEmployee !== undefined) {
			updates.requested_employee = requestedEmployee;
		}

		if (cash !== undefined) {
			updates.cash = cash;
		}

		if (machine !== undefined) {
			updates.machine = machine;
		}

		if (vip !== undefined) {
			updates.vip = vip;
		}

		if (giftCard !== undefined) {
			updates.gift_card = giftCard;
		}

		if (insurance !== undefined) {
			updates.insurance = insurance;
		}

		if (tips !== undefined) {
			updates.tips = tips;
		}

		if (tipMethod !== undefined) {
			updates.tip_method = tipMethod;
		}

		if (message !== undefined) {
			updates.message = message;
		}

		Object.assign(reservation, updates);

		return reservation.save();
	} else {
		return null;
	}
};

export const createReservation = async (
	reservedDate: Date,
	date: string,
	employeeId: number,
	serviceId: number,
	createdBy: string,
	time?: number | null,
	bedsRequired?: number | null,
	customerId?: number | null,
	phoneNumber?: string | null,
	vipSerial?: string | null,
	customerName?: string | null,
	notes?: string | null,
	requestedGender?: Gender | null,
	requestedEmployee?: boolean,
	message?: string | null
) => {
	let customerRecord: CustomerRecord | null = null;
	if (customerId !== undefined && customerId !== null) {
		customerRecord = await getCustomerRecord(customerId, date);

		if (!customerRecord) {
			throw new NotFoundError('Customer', 'customer id', customerId);
		}
	} else if (phoneNumber || vipSerial) {
		const customer = Customer.create({
			phone_number: phoneNumber,
			vip_serial: vipSerial,
			customer_name: customerName,
			notes,
		});

		await customer.save();

		customerRecord = CustomerRecord.create({
			customer_id: customer.customer_id,
			valid_from: date,
			phone_number: customer.phone_number,
			vip_serial: customer.vip_serial,
			customer_name: customer.customer_name,
			notes: customer.notes,
		});
	}

	const service = await Service.findOne({
		where: {
			service_id: serviceId,
		},
	});

	if (!service) throw new NotFoundError('Service', 'service id', serviceId);

	const reservation = Reservation.create({
		reserved_date: reservedDate,
		date,
		employee_id: employeeId,
		service,
		time,
		beds_required: bedsRequired,
		customer: customerRecord,
		requested_gender: requestedGender,
		requested_employee: requestedEmployee,
		message,
		updated_by: createdBy,
		created_by: createdBy,
	});

	return reservation.save();
};

export const deleteReservation = async (reservationId: number) => {
	const reservation = await getReservation(reservationId);

	if (reservation) {
		return reservation.remove();
	} else {
		return null;
	}
};
