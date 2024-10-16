import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAcupunctureOptionsToReservations1728594014393
	implements MigrationInterface
{
	name = 'AddAcupunctureOptionsToReservations1728594014393';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "reservations" ADD "cash_out" numeric(5,2)`
		);
		await queryRunner.query(
			`ALTER TABLE "reservations" ADD "acupuncturist_employee_id" integer`
		);
		await queryRunner.query(
			`ALTER TABLE "reservations" ADD CONSTRAINT "FK_ffa9faebd41b8f3bcc87f775f08" FOREIGN KEY ("acupuncturist_employee_id") REFERENCES "employees"("employee_id") ON DELETE SET NULL ON UPDATE CASCADE`
		);

		await queryRunner.query(
			`UPDATE "reservations" 
             SET "acupuncturist_employee_id" = 7
             WHERE "service_id" IN (
                SELECT "service_id" 
                FROM "services" 
                WHERE "acupuncture" IS NOT NULL AND "acupuncture" > 0
            )`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "reservations" DROP CONSTRAINT "FK_ffa9faebd41b8f3bcc87f775f08"`
		);
		await queryRunner.query(
			`ALTER TABLE "reservations" DROP COLUMN "acupuncturist_employee_id"`
		);
		await queryRunner.query(
			`ALTER TABLE "reservations" DROP COLUMN "cash_out"`
		);
	}
}
