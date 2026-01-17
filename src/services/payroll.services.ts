import {
	Between,
	FindOptionsWhere,
	In,
	LessThanOrEqual,
	MoreThanOrEqual,
} from 'typeorm';
import { PayrollOption, PayrollPart, TipMethod } from '../models/enums';
import { Payroll, PayrollDataRow } from '../models/payroll.models';
import { Schedule } from '../models/schedule.models';

export const PAYROLL_RELATIONS = [
	'schedules',
	'schedules.reservations',
	'schedules.reservations.service',
	'schedules.vip_packages',
];

// Computes payroll data from already-loaded schedules (no additional queries)
export const computePayrollData = (payroll: Payroll): void => {
	payroll.data = [];

	if (!payroll.schedules) {
		return;
	}

	payroll.schedules.forEach((schedule) => {
		const { date, start, end, reservations, vip_packages } = schedule;

		const validReservations = (reservations ?? []).filter(
			(reservation) => reservation.service !== null
		);

		const bodyReservations = validReservations.filter(
			(reservation) => reservation.service.body > 0
		);
		const body_sessions = bodyReservations
			.map((reservation) => reservation.service.body)
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
		const requested_body_sessions = bodyReservations
			.map((reservation) =>
				reservation.requested_employee ? reservation.service.body : 0
			)
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

		const feetReservations = validReservations.filter(
			(reservation) => reservation.service.feet > 0
		);
		const feet_sessions = feetReservations
			.map((reservation) => reservation.service.feet)
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
		const requested_feet_sessions = feetReservations
			.map((reservation) =>
				reservation.requested_employee ? reservation.service.feet : 0
			)
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

		const acupunctureReservations = validReservations.filter(
			(reservation) => reservation.service.acupuncture > 0
		);
		const acupuncture_sessions = acupunctureReservations
			.map((reservation) => reservation.service.acupuncture)
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
		const requested_acupuncture_sessions = acupunctureReservations
			.map((reservation) =>
				reservation.requested_employee ? reservation.service.acupuncture : 0
			)
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

		const total_cash = validReservations
			.map((reservation) => reservation.cash ?? 0)
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

		const total_machine = validReservations
			.map((reservation) => reservation.machine ?? 0)
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

		const total_vip = validReservations
			.map((reservation) => reservation.vip ?? 0)
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

		const total_gift_card = validReservations
			.map((reservation) => reservation.gift_card ?? 0)
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

		const total_insurance = validReservations
			.map((reservation) => reservation.insurance ?? 0)
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

		const total_cash_out = validReservations
			.map((reservation) => reservation.cash_out ?? 0)
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

		const tips = validReservations
			.map((reservation) =>
				reservation.tip_method !== TipMethod.CASH ? reservation.tips ?? 0 : 0
			)
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

		const award_amount = Math.max(schedule.award - 40, 0);

		const vip_amount = (vip_packages ?? [])
			.map(
				(vipPackage) =>
					vipPackage.commission_amount / vipPackage.employee_ids.length
			)
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

		const dataRow: PayrollDataRow = {
			date,
			start,
			end,
			body_sessions,
			requested_body_sessions,
			feet_sessions,
			requested_feet_sessions,
			acupuncture_sessions,
			requested_acupuncture_sessions,
			total_cash,
			total_machine,
			total_vip,
			total_gift_card,
			total_insurance,
			total_cash_out,
			tips,
			award_amount,
			vip_amount,
		};

		payroll.data.push(dataRow);
	});
};

// Loads payroll data by fetching schedules (for single payroll use)
export const loadPayrollData = async (payroll: Payroll): Promise<void> => {
	const { year, month, part, employee_id } = payroll;

	const schedules = await Schedule.find({
		where: {
			year,
			month,
			part,
			employee_id,
		},
		withDeleted: true,
	});

	payroll.schedules = schedules;
	computePayrollData(payroll);
};

export const getPayrolls = async (
	start?: { year: number; month: number },
	end?: { year: number; month: number },
	employeeIds?: number[]
) => {
	const whereCondition: FindOptionsWhere<Payroll> = {};

	if (start && end) {
		whereCondition.year = Between(start.year, end.year);
		whereCondition.month = Between(start.month, end.month);
	} else if (start) {
		whereCondition.year = MoreThanOrEqual(start.year);
		whereCondition.month = MoreThanOrEqual(start.month);
	} else if (end) {
		whereCondition.year = LessThanOrEqual(end.year);
		whereCondition.month = LessThanOrEqual(end.month);
	}

	if (employeeIds) {
		whereCondition.employee_id = In(employeeIds);
	}

	const payrolls = await Payroll.find({
		where: whereCondition,
		relations: PAYROLL_RELATIONS,
		withDeleted: true,
		order: {
			year: 'ASC',
			month: 'ASC',
			part: 'ASC',
			employee_id: 'ASC',
		},
	});

	for (const payroll of payrolls) {
		computePayrollData(payroll);
	}

	return payrolls;
};

export const getPayroll = async (
	year: number,
	month: number,
	part: PayrollPart,
	employeeId: number
) => {
	const payroll = await Payroll.findOne({
		where: {
			year,
			month,
			part,
			employee_id: employeeId,
		},
		relations: PAYROLL_RELATIONS,
		withDeleted: true,
	});

	if (payroll) {
		computePayrollData(payroll);
	}

	return payroll;
};

export const updatePayroll = async (
	year: number,
	month: number,
	part: PayrollPart,
	employeeId: number,
	option?: PayrollOption,
	chequeAmount?: number | null
) => {
	const payroll = await getPayroll(year, month, part, employeeId);

	if (payroll) {
		const updates: Partial<Payroll> = {};

		if (option !== undefined) {
			updates.option = option;
		}

		if (chequeAmount !== undefined) {
			updates.cheque_amount = chequeAmount;
		}

		Object.assign(payroll, updates);

		return payroll.save();
	} else {
		return null;
	}
};

export const createPayroll = async (
	year: number,
	month: number,
	part: PayrollPart,
	employeeId: number,
	option: PayrollOption,
	chequeAmount?: number | null
) => {
	const payroll = Payroll.create({
		year,
		month,
		part,
		employee_id: employeeId,
		option,
		cheque_amount: chequeAmount,
	});

	return payroll.save();
};

export const deletePayroll = async (
	year: number,
	month: number,
	part: PayrollPart,
	employeeId: number
) => {
	const payroll = await getPayroll(year, month, part, employeeId);

	if (payroll) {
		return payroll.remove();
	} else {
		return null;
	}
};

export const refreshPayroll = async (
	year: number,
	month: number,
	part: PayrollPart,
	employeeId: number
) => {
	const payroll = await getPayroll(year, month, part, employeeId);

	if (payroll) {
		await payroll.assignSchedules();

		return payroll;
	} else {
		return null;
	}
};
