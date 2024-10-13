import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAcupuncturistRole1728360217076 implements MigrationInterface {
	name = 'AddAcupuncturistRole1728360217076';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TYPE "public"."employees_role_enum" RENAME TO "employees_role_enum_old"`
		);
		await queryRunner.query(
			`CREATE TYPE "public"."employees_role_enum" AS ENUM('SOFTWARE DEVELOPER', 'MANAGER', 'RECEPTIONIST', 'ACUPUNCTURIST', 'STORE EMPLOYEE', 'OTHER')`
		);
		await queryRunner.query(
			`ALTER TABLE "employees" ALTER COLUMN "role" TYPE "public"."employees_role_enum" USING "role"::"text"::"public"."employees_role_enum"`
		);
		await queryRunner.query(`DROP TYPE "public"."employees_role_enum_old"`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."employees_role_enum_old" AS ENUM('SOFTWARE DEVELOPER', 'MANAGER', 'RECEPTIONIST', 'STORE EMPLOYEE', 'OTHER')`
		);
		await queryRunner.query(
			`ALTER TABLE "employees" ALTER COLUMN "role" TYPE "public"."employees_role_enum_old" USING "role"::"text"::"public"."employees_role_enum_old"`
		);
		await queryRunner.query(`DROP TYPE "public"."employees_role_enum"`);
		await queryRunner.query(
			`ALTER TYPE "public"."employees_role_enum_old" RENAME TO "employees_role_enum"`
		);
	}
}
