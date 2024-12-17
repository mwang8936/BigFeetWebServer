import {
	Between,
	FindOptionsWhere,
	In,
	LessThanOrEqual,
	MoreThanOrEqual,
} from 'typeorm';
import { PayrollOption, PayrollPart } from '../models/enums';
import { Payroll } from '../models/payroll.models';

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

	return Payroll.find({
		where: whereCondition,
		order: {
			year: 'ASC',
			month: 'ASC',
			part: 'ASC',
			employee_id: 'ASC',
		},
	});
};

export const getPayroll = async (
	year: number,
	month: number,
	part: PayrollPart,
	employeeId: number
) => {
	return Payroll.findOne({
		where: {
			year,
			month,
			part,
			employee_id: employeeId,
		},
	});
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
