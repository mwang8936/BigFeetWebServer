import {
	Entity,
	BaseEntity,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryColumn,
} from 'typeorm';
import { PaymentMethod } from './enums';

@Entity('GiftCardsSold')
export class GiftCard extends BaseEntity {
	@PrimaryColumn({
		length: 8,
	})
	gift_card_id: string;

	@Column({
		type: 'date',
	})
	date: string;

	@Column({
		type: 'enum',
		enum: PaymentMethod,
	})
	payment_method: PaymentMethod;

	@Column({
		type: 'decimal',
		precision: 6,
		scale: 2,
		unsigned: true,
		transformer: {
			to(tips: number) {
				return tips;
			},
			from(tips: number) {
				return Number(tips);
			},
		},
	})
	payment_amount: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
