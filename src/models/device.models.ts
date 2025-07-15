import {
	Entity,
	BaseEntity,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	PrimaryColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';

import { Employee } from './employee.models';

@Entity('devices')
export class Device extends BaseEntity {
	@PrimaryColumn()
	device_id: string;

	@PrimaryColumn()
	employee_id: number;

	@ManyToOne(() => Employee, (employee) => employee.devices, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
		eager: true,
	})
	@JoinColumn({
		name: 'employee_id',
	})
	employee: Employee;

	@Column({
		type: 'text',
		nullable: true,
	})
	device_name: string | null;

	@Column({
		type: 'text',
		nullable: true,
	})
	device_model: string | null;

	@Column({
		type: 'text',
		nullable: true,
	})
	push_token: string | null;

	@Column({
		type: 'text',
		nullable: true,
	})
	refresh_token: string | null;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
