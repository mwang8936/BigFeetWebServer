import {
	Entity,
	BaseEntity,
	Column,
	ManyToOne,
	JoinColumn,
	PrimaryColumn,
	OneToMany,
	ManyToMany,
	JoinTable,
} from 'typeorm';
import { Employee } from './employee.models';
import { Reservation } from './reservation.models';
import { VipPackage } from './vip-package.models';

@Entity('Schedules')
export class Schedule extends BaseEntity {
	@PrimaryColumn({
		type: 'date',
	})
	date: string;

	@PrimaryColumn()
	employee_id: number;

	@ManyToOne(() => Employee, (employee) => employee.schedules, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
		eager: true,
	})
	@JoinColumn({
		name: 'employee_id',
	})
	employee: Employee;

	@Column({
		name: 'working',
		default: false,
	})
	is_working: boolean;

	@Column({
		type: 'time',
		nullable: true,
	})
	start: Date | null;

	@Column({
		type: 'time',
		nullable: true,
	})
	end: Date | null;

	@Column({
		type: 'integer',
		width: 2,
		unsigned: true,
		nullable: true,
	})
	priority: number | null;

	@OneToMany(() => Reservation, (reservation) => reservation.schedule, {
		eager: true,
	})
	reservations: Reservation[];

	@ManyToMany(() => VipPackage, (vipPackage) => vipPackage.schedules, {
		cascade: true,
		eager: true,
	})
	@JoinTable({
		joinColumns: [
			{ name: 'date', referencedColumnName: 'date' },
			{ name: 'employee_id', referencedColumnName: 'employee_id' },
		],
		inverseJoinColumns: [{ name: 'serial', referencedColumnName: 'serial' }],
	})
	vip_packages: VipPackage[];

	@Column({
		default: false,
	})
	signed: boolean;
}
