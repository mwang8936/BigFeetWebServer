import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveDarkMode1735499376455 implements MigrationInterface {
	name = 'RemoveDarkMode1735499376455';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN "dark_mode"`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "employees" ADD "dark_mode" boolean NOT NULL DEFAULT false`
		);
	}
}
