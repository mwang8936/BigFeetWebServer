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

@Entity('VipPackagesSold')
export class VipPackage extends BaseEntity {
	@PrimaryColumn({
		length: 6,
	})
	serial: string;

	@Column({
		type: 'decimal',
		precision: 8,
		scale: 2,
		unsigned: true,
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
		unsigned: true,
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
		type: 'simple-array',
		transformer: {
			to(employeeIds: number[]) {
				return employeeIds;
			},
			from(employeeIds: string[]) {
				return employeeIds.map((employeeId) => Number(employeeId));
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
