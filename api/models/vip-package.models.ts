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
		length: 6,
	})
	serial: string;

	@Column({
		type: 'decimal',
		precision: 8,
		scale: 2,
		unsigned: true,
	})
	amount: number;

	@ManyToMany(() => Schedule)
	@JoinTable()
	schedules: Schedule[];
}
