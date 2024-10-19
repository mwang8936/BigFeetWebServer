import AppDataSource from '../config/orm.config';

import { PayrollOption, PayrollPart } from '../models/enums';
import { Payroll } from '../models/payroll.models';

export const getPayrolls = async (
	start?: { year: number; month: number },
	end?: { year: number; month: number },
	employeeIds?: number[]
) => {
	const payrollsRepository = AppDataSource.getRepository(Payroll);

	const queryBuilder = payrollsRepository.createQueryBuilder('payroll');

	if (start) {
		queryBuilder.andWhere(
			`MAKE_DATE(payroll.year, payroll.month, 1) >= MAKE_DATE(:startYear, :startMonth, 1)`,
			{ startYear: start.year, startMonth: start.month }
		);
	}

	if (end) {
		queryBuilder.andWhere(
			`MAKE_DATE(payroll.year, payroll.month, 1) <= MAKE_DATE(:endYear, :endMonth, 1)`,
			{ endYear: end.year, endMonth: end.month }
		);
	}

	if (employeeIds) {
		queryBuilder.andWhere('payroll.employee_id IN (:...employeeIds)', {
			employeeIds,
		});
	}

	queryBuilder
		.orderBy('payroll.year', 'ASC')
		.addOrderBy('payroll.month', 'ASC')
		.addOrderBy('payroll.part', 'ASC')
		.addOrderBy('payroll.employee_id', 'ASC');

	queryBuilder.setFindOptions({ loadEagerRelations: true });

	return queryBuilder.getMany();
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
