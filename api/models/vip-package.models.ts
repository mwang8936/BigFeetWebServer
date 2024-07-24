import {
	Entity,
	BaseEntity,
	Column,
	PrimaryColumn,
	ManyToMany,
	JoinTable,
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
	})
	sold_amount: number;

	@Column({
		type: 'decimal',
		precision: 8,
		scale: 2,
		unsigned: true,
	})
	commission_amount: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@ManyToMany(() => Schedule)
	@JoinTable()
	schedules: Schedule[];
}
