import { Reservation } from '../models/reservation.models';
import { Gender, TipMethod } from '../models/enums';
import {
	Between,
	FindOptionsWhere,
	In,
	LessThanOrEqual,
	MoreThanOrEqual,
	Not,
} from 'typeorm';
import { Service } from '../models/service.models';
import { Customer } from '../models/customer.models';
import { NotFoundError } from '../exceptions/not-found-error';
import { DuplicateIdentifierError } from '../exceptions/duplicate-identifier-error';
import { CustomerHistory } from '../models/customer-history.models';
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

		if (customerId) {
			const customerHistoryRepository =
				AppDataSource.getRepository(CustomerHistory);

			const customerHistory = await customerHistoryRepository
				.createQueryBuilder('customer_history')
				.where('customer_history.customer_id = :customerId', { customerId })
				.andWhere('customer_history.valid_from <= :date', {
					date: reservedDate,
				})
				.andWhere(
					'(customer_history.valid_to IS NULL OR customer_history.valid_to > :date)',
					{ date: reservedDate }
				)
				.orderBy('customer_history.valid_from', 'DESC')
				.getOne();

			if (!customerHistory) {
				throw new NotFoundError('Customer', 'customer id', customerId);
			}

			updates.customer = customerHistory;
		} else if (phoneNumber || vipSerial) {
			if (phoneNumber) {
				await duplicatePhoneNumberChecker(phoneNumber);
			}

			if (vipSerial) {
				await duplicateVipSerialChecker(vipSerial);
			}

			const customer = Customer.create({
				phone_number: phoneNumber,
				vip_serial: vipSerial,
				customer_name: customerName,
				notes,
			});
			await customer.save();

			const customerHistory = CustomerHistory.create({
				customer_id: customer.customer_id,
				valid_from: new Date(Date.UTC(1900, 0, 1)),
				phone_number: customer.phone_number,
				vip_serial: customer.vip_serial,
				customer_name: customer.customer_name,
				notes: customer.notes,
			});

			updates.customer = customerHistory;
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
	let customerHistory: CustomerHistory | null = null;
	if (customerId !== undefined && customerId !== null) {
		const customerHistoryRepository =
			AppDataSource.getRepository(CustomerHistory);

		customerHistory = await customerHistoryRepository
			.createQueryBuilder('customer_history')
			.where('customer_history.customer_id = :customerId', { customerId })
			.andWhere('customer_history.valid_from <= :date', {
				date: reservedDate,
			})
			.andWhere(
				'(customer_history.valid_to IS NULL OR customer_history.valid_to > :date)',
				{ date: reservedDate }
			)
			.orderBy('customer_history.valid_from', 'DESC')
			.getOne();

		if (!customerHistory) {
			throw new NotFoundError('Customer', 'customer id', customerId);
		}
	} else if (phoneNumber || vipSerial) {
		if (phoneNumber) {
			await duplicatePhoneNumberChecker(phoneNumber);
		}

		if (vipSerial) {
			await duplicateVipSerialChecker(vipSerial);
		}

		const customer = Customer.create({
			phone_number: phoneNumber,
			vip_serial: vipSerial,
			customer_name: customerName,
			notes,
		});

		await customer.save();

		const customerHistory = CustomerHistory.create({
			customer_id: customer.customer_id,
			valid_from: new Date(Date.UTC(1900, 0, 1)),
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
		customer: customerHistory,
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
