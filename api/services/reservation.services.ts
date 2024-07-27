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
	phoneNumber?: string | null,
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

			if (service) {
				updates.service = service;
			}
		}

		if (
			phoneNumber !== undefined ||
			customerName !== undefined ||
			notes !== undefined
		) {
			if (phoneNumber === null) {
				updates.customer = null;
			} else {
				let customer = await Customer.findOne({
					where: {
						phone_number: phoneNumber,
					},
				});

				if (customer) {
					const customer_updates: Partial<Customer> = {};

					if (customerName !== undefined) {
						customer_updates.customer_name = customerName;
					}

					if (notes !== undefined) {
						customer_updates.notes = notes;
					}

					Object.assign(customer, customer_updates);
				} else {
					customer = Customer.create({
						phone_number: phoneNumber,
						customer_name: customerName,
						notes,
					});
				}

				updates.customer = customer;
			}
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
	phoneNumber?: string | null,
	customerName?: string | null,
	notes?: string | null,
	requestedGender?: Gender | null,
	requestedEmployee?: boolean,
	message?: string | null
) => {
	let customer = null;
	if (phoneNumber) {
		customer = await Customer.findOne({
			where: {
				phone_number: phoneNumber,
			},
		});

		if (customer) {
			const customer_updates: Partial<Customer> = {};

			if (customerName !== undefined) {
				customer_updates.customer_name = customerName;
			}

			if (notes !== undefined) {
				customer_updates.notes = notes;
			}

			Object.assign(customer, customer_updates);
		} else {
			customer = Customer.create({
				phone_number: phoneNumber,
				customer_name: customerName,
				notes,
			});
		}
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
