import {
	Entity,
	BaseEntity,
	Column,
	ManyToMany,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryGeneratedColumn,
} from 'typeorm';

import { PaymentMethod } from './enums';
import { Schedule } from './schedule.models';

@Entity('vip_packages_sold')
export class VipPackage extends BaseEntity {
	@PrimaryGeneratedColumn()
	vip_package_id: number;

	@Column({
		length: 6,
	})
	serial: string;

	@Column({
		type: 'enum',
		enum: PaymentMethod,
	})
	payment_method: PaymentMethod;

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
