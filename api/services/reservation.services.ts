import { Reservation } from '../models/reservation.models';
import { Gender, TipMethod } from '../models/enums';
import {
	Between,
	FindOptionsWhere,
	In,
	IsNull,
	LessThanOrEqual,
	MoreThanOrEqual,
} from 'typeorm';

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

	return await Reservation.find({
		where: whereCondition,
		order: {
			reserved_date: 'ASC',
		},
	});
};

export const getReservation = async (reservationId: number) => {
	return await Reservation.findOne({
		where: {
			reservation_id: reservationId,
		},
	});
};

export const updateReservation = async (
	reservationId: number,
	updatedBy: string,
	reservedDate?: Date,
	employeeId?: number,
	serviceId?: number,
	phoneNumber?: string | null,
	customerName?: string,
	notes?: string | null,
	requestedGender?: Gender | null,
	requestedEmployee?: boolean,
	cash?: number | null,
	machine?: number | null,
	vip?: number | null,
	tips?: number | null,
	tipMethod?: TipMethod | null,
	message?: string | null
) => {
	const customer =
		phoneNumber === null
			? null
			: {
					phone_number: phoneNumber,
					customer_name: customerName,
					notes,
			  };

	const reservation = await Reservation.create({
		date: reservedDate,
		employee_id: employeeId,
		reserved_date: reservedDate,
		service: {
			service_id: serviceId,
		},
		customer,
		requested_gender: requestedGender,
		requested_employee: requestedEmployee,
		cash,
		machine,
		vip,
		tips,
		tip_method: tipMethod,
		message,
		updated_by: updatedBy,
	});

	return await Reservation.update(
		{ reservation_id: reservationId },
		reservation
	);
};

export const createReservation = async (
	employeeId: number,
	reservedDate: Date,
	serviceId: number,
	createdBy: string,
	phoneNumber?: string | null,
	customerName?: string | null,
	notes?: string | null,
	requestedGender?: Gender | null,
	requestedEmployee?: boolean,
	message?: string | null
) => {
	const customer =
		phoneNumber && customerName
			? {
					phone_number: phoneNumber,
					customer_name: customerName,
					notes,
			  }
			: null;
	const reservation = Reservation.create({
		date: reservedDate,
		employee_id: employeeId,
		reserved_date: reservedDate,
		service: {
			service_id: serviceId,
		},
		customer,
		requested_gender: requestedGender,
		requested_employee: requestedEmployee,
		message,
		updated_by: createdBy,
		created_by: createdBy,
	});

	return await reservation.save();
};

export const deleteReservation = async (reservationId: number) => {
	return await Reservation.delete({
		reservation_id: reservationId,
	});
};
