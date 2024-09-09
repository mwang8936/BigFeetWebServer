import { MigrationInterface, QueryRunner } from 'typeorm';

export class LinkReservationToCustomerHistories1724901705000
	implements MigrationInterface
{
	name = 'LinkReservationToCustomerHistories1724901705000';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "reservations" DROP CONSTRAINT "FK_f63cb79a34cdf2d47ab23f31a8b"`
		);
		await queryRunner.query(
			`ALTER TABLE "reservations" ADD "customer_valid_from" TIMESTAMP WITH TIME ZONE`
		);
		await queryRunner.query(`
            UPDATE "reservations"
            SET "customer_valid_from" = '2024-01-01'
            WHERE "customer_id" IS NOT NULL;
        `);
		await queryRunner.query(
			`ALTER TABLE "reservations" ADD CONSTRAINT "FK_01c2b7b98eb1c3c07b18af3d10f" FOREIGN KEY ("customer_id", "customer_valid_from") REFERENCES "customer_history"("customer_id","valid_from") ON DELETE SET NULL ON UPDATE CASCADE`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "reservations" DROP CONSTRAINT "FK_01c2b7b98eb1c3c07b18af3d10f"`
		);
		await queryRunner.query(
			`ALTER TABLE "reservations" DROP COLUMN "customer_valid_from"`
		);
		await queryRunner.query(
			`ALTER TABLE "reservations" ADD CONSTRAINT "FK_f63cb79a34cdf2d47ab23f31a8b" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE`
		);
	}
}
