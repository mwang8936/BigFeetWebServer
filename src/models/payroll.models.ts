import {
	Entity,
	BaseEntity,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryColumn,
	ManyToOne,
	JoinColumn,
	OneToMany,
	AfterLoad,
	Column,
	Check,
	FindOptionsWhere,
	Between,
	AfterInsert,
} from 'typeorm';

import { PayrollOption, PayrollPart, TipMethod } from './enums';
import { Employee } from './employee.models';
import { Schedule } from './schedule.models';

interface DataRow {
	date: string;
	start: Date | null;
	end: Date | null;
	body_sessions: number;
	requested_body_sessions: number;
	feet_sessions: number;
	requested_feet_sessions: number;
	acupuncture_sessions: number;
	requested_acupuncture_sessions: number;
	total_cash: number;
	total_machine: number;
	total_vip: number;
	total_gift_card: number;
	total_insurance: number;
	total_cash_out: number;
	tips: number;
	vip_amount: number;
}

@Check(`"year" >= 2020`)
@Check(`"month" >= 1 AND month <= 12`)
@Entity('payroll')
export class Payroll extends BaseEntity {
	@PrimaryColumn()
	year: number;

	@PrimaryColumn()
	month: number;

	@PrimaryColumn({
		type: 'enum',
		enum: PayrollPart,
	})
	part: PayrollPart;

	@PrimaryColumn()
	employee_id: number;

	@ManyToOne(() => Employee, (employee) => employee.payrolls, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
		eager: true,
	})
	@JoinColumn({
		name: 'employee_id',
	})
	employee: Employee;

	@OneToMany(() => Schedule, (schedule) => schedule.payroll)
	schedules: Schedule[];

	@Column({
		type: 'enum',
		enum: PayrollOption,
	})
	option: PayrollOption;

	@Column({
		type: 'decimal',
		precision: 8,
		scale: 2,
		nullable: true,
		transformer: {
			to(cheque_amount: number | null) {
				return cheque_amount;
			},
			from(cheque_amount: string | null) {
				return cheque_amount === null ? null : Number(cheque_amount);
			},
		},
	})
	cheque_amount: number | null;

	data: DataRow[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@AfterInsert()
	async assignSchedules() {
		const { year, month, part, employee_id } = this;

		const whereCondition: FindOptionsWhere<Schedule> = {
			year,
			month,
			employee_id,
		};
		whereCondition.day =
			part === PayrollPart.PART_1 ? Between(1, 15) : Between(16, 31);

		Schedule.createQueryBuilder()
			.update(Schedule)
			.set({ part })
			.where(whereCondition)
			.execute();
	}

	@AfterLoad()
	async setData() {
		const { year, month, part, employee_id } = this;

		const schedules = await Schedule.find({
			where: {
				year,
				month,
				part,
				employee_id,
			},
		});

		this.data = [];

		schedules.forEach((schedule) => {
			const { date, start, end, reservations, vip_packages } = schedule;

			const bodyReservations = reservations.filter(
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

			const feetReservations = reservations.filter(
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

			const acupunctureReservations = reservations.filter(
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

			const total_cash = reservations
				.map((reservation) => reservation.cash ?? 0)
				.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

			const total_machine = reservations
				.map((reservation) => reservation.machine ?? 0)
				.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

			const total_vip = reservations
				.map((reservation) => reservation.vip ?? 0)
				.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

			const total_gift_card = reservations
				.map((reservation) => reservation.gift_card ?? 0)
				.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

			const total_insurance = reservations
				.map((reservation) => reservation.insurance ?? 0)
				.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

			const total_cash_out = reservations
				.map((reservation) => reservation.cash_out ?? 0)
				.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

			const tips = reservations
				.map((reservation) =>
					reservation.tip_method !== TipMethod.CASH ? reservation.tips ?? 0 : 0
				)
				.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

			const vip_amount = vip_packages
				.map(
					(vipPackage) =>
						vipPackage.commission_amount / vipPackage.employee_ids.length
				)
				.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

			const dataRow: DataRow = {
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
				vip_amount,
			};

			this.data.push(dataRow);
		});
	}
}
