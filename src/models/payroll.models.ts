import {
	Entity,
	BaseEntity,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryColumn,
	ManyToOne,
	JoinColumn,
	OneToMany,
	Column,
	Check,
	FindOptionsWhere,
	Between,
	AfterInsert,
} from 'typeorm';

import { PayrollOption, PayrollPart } from './enums';
import { Employee } from './employee.models';
import { Schedule } from './schedule.models';

export interface PayrollDataRow {
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
	award_amount: number;
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

	data: PayrollDataRow[];

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

}
