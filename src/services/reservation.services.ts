import {
	Between,
	FindOptionsWhere,
	In,
	LessThanOrEqual,
	MoreThanOrEqual,
	Not,
} from 'typeorm';

import { DuplicateIdentifierError } from '../exceptions/duplicate-identifier-error';
import { NotFoundError } from '../exceptions/not-found-error';

import { Customer } from '../models/customer.models';
import { Gender, TipMethod } from '../models/enums';
import { Reservation } from '../models/reservation.models';
import { ServiceRecord } from '../models/service-record.models';

export const getReservations = async (
	start?: Date,
	end?: Date,
	employeeIds?: number[]
) => {
	const whereCondition: FindOptionsWhere<Reservation> = {};

	if (start && end) {
		whereCondition.reserved_date = Between(start, end);
	} else if (start) {
		whereCondition.reserved_date = MoreThanOrEqual(start);
	} else if (end) {
		whereCondition.reserved_date = LessThanOrEqual(end);
	}

	if (employeeIds) {
		whereCondition.employee_id = In(employeeIds);
	}

	return Reservation.find({
		where: whereCondition,
		order: {
			reserved_date: 'ASC',
			employee_id: 'ASC',
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
	date?: { year: number; month: number; day: number },
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
	cashOut?: number | null,
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
			updates.year = date.year;
			updates.month = date.month;
			updates.day = date.day;
		}

		if (employeeId !== undefined) {
			updates.employee_id = employeeId;
		}

		if (serviceId !== undefined) {
			updates.service = ServiceRecord.create({
				service_id: serviceId,
			});
		}

		if (time !== undefined) {
			updates.time = time;
		}

		if (bedsRequired !== undefined) {
			updates.beds_required = bedsRequired;
		}

		if (customerId !== undefined && customerId !== null) {
			const customer = await Customer.findOne({
				where: {
					customer_id: customerId,
				},
			});

			if (!customer) {
				throw new NotFoundError('Customer', 'customer id', customerId);
			}

			const customer_updates: Partial<Customer> = {};

			if (phoneNumber !== undefined) {
				if (phoneNumber) {
					await duplicatePhoneNumberChecker(phoneNumber, customerId);
				}

				customer_updates.phone_number = phoneNumber;
			}

			if (vipSerial !== undefined) {
				if (vipSerial) {
					await duplicateVipSerialChecker(vipSerial, customerId);
				}

				customer_updates.vip_serial = vipSerial;
			}

			if (customerName !== undefined) {
				customer_updates.customer_name = customerName;
			}

			if (notes !== undefined) {
				customer_updates.notes = notes;
			}

			Object.assign(customer, customer_updates);

			updates.customer = customer;
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

			updates.customer = customer;
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

		if (cashOut !== undefined) {
			updates.cash_out = cashOut;
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
	date: { year: number; month: number; day: number },
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
	let customer: Customer | null = null;
	if (customerId !== undefined && customerId !== null) {
		customer = await Customer.findOne({
			where: {
				customer_id: customerId,
			},
		});

		if (!customer) {
			throw new NotFoundError('Customer', 'customer id', customerId);
		}

		const customer_updates: Partial<Customer> = {};

		if (phoneNumber !== undefined) {
			if (phoneNumber) {
				await duplicatePhoneNumberChecker(phoneNumber, customerId);
			}

			customer_updates.phone_number = phoneNumber;
		}

		if (vipSerial !== undefined) {
			if (vipSerial) {
				await duplicateVipSerialChecker(vipSerial, customerId);
			}

			customer_updates.vip_serial = vipSerial;
		}

		if (customerName !== undefined) {
			customer_updates.customer_name = customerName;
		}

		if (notes !== undefined) {
			customer_updates.notes = notes;
		}

		Object.assign(customer, customer_updates);
	} else if (phoneNumber || vipSerial) {
		if (phoneNumber) {
			await duplicatePhoneNumberChecker(phoneNumber);
		}

		if (vipSerial) {
			await duplicateVipSerialChecker(vipSerial);
		}

		customer = Customer.create({
			phone_number: phoneNumber,
			vip_serial: vipSerial,
			customer_name: customerName,
			notes,
		});
	}

	const reservation = Reservation.create({
		reserved_date: reservedDate,
		year: date.year,
		month: date.month,
		day: date.day,
		employee_id: employeeId,
		service: {
			service_id: serviceId,
		},
		time,
		beds_required: bedsRequired,
		customer,
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
