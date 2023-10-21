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
	date: Date;

	@PrimaryColumn({ type: 'integer', name: 's_employee_id' })
	@ManyToOne(() => Employee, (employee) => employee.schedules, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
		eager: true,
		nullable: true,
	})
	@JoinColumn({
		name: 's_employee_id',
		referencedColumnName: 'employee_id',
	})
	employee: Employee | null;

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

	@OneToMany(() => Reservation, (reservation) => reservation.schedule, {
		eager: true,
		nullable: true,
	})
	reservations: Reservation[] | null;

	@ManyToMany(() => VipPackage, (vipPackage) => vipPackage.schedules, {
		cascade: true,
		eager: true,
		nullable: true,
	})
	@JoinTable()
	vip_packages: VipPackage[] | null;

	@Column({
		default: false,
	})
	signed: boolean;
}
