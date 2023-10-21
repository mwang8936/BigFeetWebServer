import { Reservation } from '../models/reservation.models';
import { Gender, TipMethod } from '../models/enums';
import {
	FindOptionsWhere,
	In,
	LessThanOrEqual,
	MoreThanOrEqual,
} from 'typeorm';

export const getReservations = async (
	fromDate?: Date,
	toDate?: Date,
	employeeIds?: (number | null)[]
) => {
	const whereCondition: FindOptionsWhere<Reservation>[] = [];
	fromDate &&
		whereCondition.push({ schedule: { date: MoreThanOrEqual(fromDate) } });
	toDate &&
		whereCondition.push({ schedule: { date: LessThanOrEqual(toDate) } });
	employeeIds &&
		whereCondition.push({
			schedule: {
				employee: {
					employee_id: In(employeeIds),
				},
			},
		});

	return await Reservation.find({
		where: whereCondition,
		order: {
			schedule: { date: 'DESC' },
			reserved_time: 'DESC',
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
	date?: Date,
	employeeId?: number | null,
	reservedTime?: Date,
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
	isCompleted?: boolean,
	message?: string | null
) => {
	const reservation = await Reservation.create({
		schedule: {
			date,
			employee:
				employeeId == null
					? null
					: {
							employee_id: employeeId,
					  },
		},
		reserved_time: reservedTime,
		service: {
			service_id: serviceId,
		},
		customer:
			phoneNumber == null
				? null
				: {
						phone_number: phoneNumber,
						customer_name: customerName,
						notes,
				  },
		requested_gender: requestedGender,
		requested_employee: requestedEmployee,
		cash,
		machine,
		vip,
		tips,
		tip_method: tipMethod,
		is_completed: isCompleted,
		message,
		updated_by: updatedBy,
	});

	return await Reservation.update(
		{ reservation_id: reservationId },
		reservation
	);
};

export const createReservation = async (
	date: Date,
	employeeId: number,
	reservedTime: Date,
	serviceId: number,
	createdBy: string,
	phoneNumber?: string,
	customerName?: string,
	notes?: string,
	requestedGender?: Gender,
	requestedEmployee?: boolean,
	message?: string
) => {
	const reservation = Reservation.create({
		schedule: {
			date,
			employee: {
				employee_id: employeeId,
			},
		},
		reserved_time: reservedTime,
		service: {
			service_id: serviceId,
		},
		customer: {
			phone_number: phoneNumber,
			customer_name: customerName,
			notes,
		},
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
