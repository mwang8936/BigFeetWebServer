import {
	Entity,
	BaseEntity,
	Column,
	ManyToOne,
	JoinColumn,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	AfterInsert,
} from 'typeorm';

import { Employee } from './employee.models';

@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
	@PrimaryGeneratedColumn()
	refresh_token_id: number;

	@ManyToOne(() => Employee, (employee) => employee.refresh_tokens, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
		eager: true,
	})
	@JoinColumn({ name: 'employee_id' })
	employee: Employee;

	@Column({ type: 'varchar', length: 255 })
	hashed_refresh_token: string;

	@Column({ type: 'timestamp' })
	expires_at: Date;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
