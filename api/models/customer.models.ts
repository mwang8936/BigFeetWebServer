import {
	Entity,
	BaseEntity,
	Column,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	PrimaryGeneratedColumn,
	BeforeInsert,
	BeforeUpdate,
} from 'typeorm';
import { Reservation } from './reservation.models';
import { DataStructureError } from '../exceptions/data-structure.error';

@Entity('Customers')
export class Customer extends BaseEntity {
	@PrimaryGeneratedColumn()
	customer_id: number;

	@Column({
		type: 'varchar',
		length: 10,
		nullable: true,
	})
	phone_number: string | null;

	@Column({
		type: 'varchar',
		length: 6,
		nullable: true,
	})
	vip_serial: string | null;

	@Column({
		type: 'varchar',
		charset: 'utf8mb4',
		collation: 'utf8mb4_bin',
		length: 60,
		nullable: true,
	})
	customer_name: string | null;

	@Column({
		type: 'text',
		charset: 'utf8mb4',
		collation: 'utf8mb4_bin',
		nullable: true,
	})
	notes: string | null;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@DeleteDateColumn()
	deleted_at?: Date;

	@OneToMany(() => Reservation, (reservation) => reservation.customer)
	reservations: Reservation[];

	@BeforeInsert()
	@BeforeUpdate()
	async checkPhoneNumberOrVipSerialExists() {
		const { phone_number, vip_serial } = this;

		if (phone_number === null && vip_serial === null) {
			throw new DataStructureError(
				'Schedule',
				'phone number and vip serial cannot both be empty.'
			);
		}
	}
}
