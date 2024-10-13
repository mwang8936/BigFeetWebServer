import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCashOutToReservations1728695026593
	implements MigrationInterface
{
	name = 'AddCashOutToReservations1728695026593';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "reservations" ADD "cash_out" numeric(5,2)`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "reservations" DROP COLUMN "cash_out"`
		);
	}
}
