import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBreaksToSchedules1788847727973 implements MigrationInterface {
	name = 'AddBreaksToSchedules1788847727973';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "schedules" ADD "breaks" jsonb NOT NULL DEFAULT '[]'`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "breaks"`);
	}
}
