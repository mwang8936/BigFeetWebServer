import {
	Entity,
	BaseEntity,
	Column,
	PrimaryColumn,
	ManyToMany,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

import { Schedule } from './schedule.models';

@Entity('vip_packages_sold')
export class VipPackage extends BaseEntity {
	@PrimaryColumn({
		length: 6,
	})
	serial: string;

	@Column({
		type: 'decimal',
		precision: 8,
		scale: 2,
		transformer: {
			to(soldAmount: number) {
				return soldAmount;
			},
			from(soldAmount: string) {
				return Number(soldAmount);
			},
		},
	})
	sold_amount: number;

	@Column({
		type: 'decimal',
		precision: 8,
		scale: 2,
		transformer: {
			to(commissionAmount: number) {
				return commissionAmount;
			},
			from(commissionAmount: string) {
				return Number(commissionAmount);
			},
		},
	})
	commission_amount: number;

	@Column({
		type: 'integer',
		array: true,
		transformer: {
			to(employeeIds: number[]) {
				return employeeIds;
			},
			from(employeeIds: number[] | null) {
				return employeeIds || [];
			},
		},
	})
	employee_ids: number[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@ManyToMany(() => Schedule, (schedule) => schedule.vip_packages)
	schedules: Schedule[];
}
