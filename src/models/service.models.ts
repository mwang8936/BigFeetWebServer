import {
	Entity,
	BaseEntity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	DeleteDateColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Reservation } from './reservation.models';
import { ServiceColor } from './enums';

@Entity('Services')
export class Service extends BaseEntity {
	@PrimaryGeneratedColumn()
	service_id: number;

	@Column({
		charset: 'utf8mb4',
		collation: 'utf8mb4_bin',
		length: 30,
	})
	service_name: string;

	@Column({
		charset: 'utf8mb4',
		collation: 'utf8mb4_bin',
		length: 20,
	})
	shorthand: string;

	@Column({
		type: 'integer',
		width: 3,
		unsigned: true,
	})
	time: number;

	@Column({
		type: 'decimal',
		precision: 5,
		scale: 2,
		unsigned: true,
		transformer: {
			to(money: number | null) {
				return money;
			},
			from(money: number | null) {
				return money === null ? null : Number(money);
			},
		},
	})
	money: number;

	@Column({
		type: 'decimal',
		precision: 2,
		scale: 1,
		unsigned: true,
		default: 0,
		transformer: {
			to(body: number | null) {
				return body;
			},
			from(body: number | null) {
				return body === null ? null : Number(body);
			},
		},
	})
	body: number;

	@Column({
		type: 'decimal',
		precision: 2,
		scale: 1,
		unsigned: true,
		default: 0,
		transformer: {
			to(feet: number | null) {
				return feet;
			},
			from(feet: number | null) {
				return feet === null ? null : Number(feet);
			},
		},
	})
	feet: number;

	@Column({
		type: 'decimal',
		precision: 2,
		scale: 1,
		unsigned: true,
		default: 0,
		transformer: {
			to(acupuncture: number | null) {
				return acupuncture;
			},
			from(acupuncture: number | null) {
				return acupuncture === null ? null : Number(acupuncture);
			},
		},
	})
	acupuncture: number;

	@Column({
		type: 'integer',
		width: 2,
		unsigned: true,
		default: 0,
	})
	beds_required: number;

	@Column({
		default: false,
	})
	can_overlap: boolean;

	@Column({
		type: 'enum',
		enum: ServiceColor,
	})
	color: ServiceColor;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@DeleteDateColumn()
	deleted_at?: Date;

	@OneToMany(() => Reservation, (reservation) => reservation.service)
	reservations: Reservation[];
}
