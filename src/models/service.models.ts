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

import { ServiceColor } from './enums';
import { Reservation } from './reservation.models';

@Entity('services')
export class Service extends BaseEntity {
	@PrimaryGeneratedColumn()
	service_id: number;

	@Column({
		length: 30,
	})
	service_name: string;

	@Column({
		length: 20,
	})
	shorthand: string;

	@Column({
		type: 'integer',
	})
	time: number;

	@Column({
		type: 'decimal',
		precision: 5,
		scale: 2,
		transformer: {
			to(money: number) {
				return money;
			},
			from(money: string) {
				return Number(money);
			},
		},
	})
	money: number;

	@Column({
		type: 'decimal',
		precision: 2,
		scale: 1,
		default: 0,
		transformer: {
			to(body: number) {
				return body;
			},
			from(body: string) {
				return Number(body);
			},
		},
	})
	body: number;

	@Column({
		type: 'decimal',
		precision: 2,
		scale: 1,
		default: 0,
		transformer: {
			to(feet: number) {
				return feet;
			},
			from(feet: string) {
				return Number(feet);
			},
		},
	})
	feet: number;

	@Column({
		type: 'decimal',
		precision: 2,
		scale: 1,
		default: 0,
		transformer: {
			to(acupuncture: number) {
				return acupuncture;
			},
			from(acupuncture: string) {
				return Number(acupuncture);
			},
		},
	})
	acupuncture: number;

	@Column({
		type: 'integer',
		default: 0,
	})
	beds_required: number;

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
