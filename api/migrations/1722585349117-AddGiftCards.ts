import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddGiftCards1722585349117 implements MigrationInterface {
	name = 'AddGiftCards1722585349117';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'GiftCardsSold',
				columns: [
					{
						name: 'gift_card_id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'increment',
					},
					{
						name: 'date',
						type: 'date',
					},
					{
						name: 'payment_method',
						type: 'enum',
						enum: ['CASH', 'MACHINE'],
					},
					{
						name: 'payment_amount',
						type: 'decimal',
						precision: 6,
						scale: 2,
						isNullable: false,
					},
					{
						name: 'created_at',
						type: 'timestamp',
						default: 'CURRENT_TIMESTAMP',
					},
					{
						name: 'updated_at',
						type: 'timestamp',
						default: 'CURRENT_TIMESTAMP',
						onUpdate: 'CURRENT_TIMESTAMP',
					},
				],
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		queryRunner.dropTable('GiftCardsSold');
	}
}
