import {
	Entity,
	BaseEntity,
	Column,
	PrimaryColumn,
	ManyToMany,
	JoinTable,
} from 'typeorm';
import { Schedule } from './schedule.models';

@Entity('VipPackagesSold')
export class VipPackage extends BaseEntity {
	@PrimaryColumn({
		type: 'integer',
		width: 6,
		unsigned: true,
	})
	serial: number;

	@Column({
		type: 'decimal',
		precision: 5,
		scale: 2,
		unsigned: true,
	})
	amount: number;

	@ManyToMany(() => Schedule, (schedule) => schedule.vip_packages)
	@JoinTable()
	schedules: Schedule[];
}
