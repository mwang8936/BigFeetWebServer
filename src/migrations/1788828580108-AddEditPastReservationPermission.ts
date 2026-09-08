import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEditPastReservationPermission1788828580108
	implements MigrationInterface
{
	name = 'AddEditPastReservationPermission1788828580108';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TYPE "public"."employees_permissions_enum" RENAME TO "employees_permissions_enum_old"`
		);
		await queryRunner.query(
			`CREATE TYPE "public"."employees_permissions_enum" AS ENUM('GET CUSTOMER PERMISSION', 'UPDATE CUSTOMER PERMISSION', 'ADD CUSTOMER PERMISSION', 'DELETE CUSTOMER PERMISSION', 'GET EMPLOYEE PERMISSION', 'UPDATE EMPLOYEE PERMISSION', 'ADD EMPLOYEE PERMISSION', 'DELETE EMPLOYEE PERMISSION', 'GET GIFT CARD PERMISSION', 'UPDATE GIFT CARD PERMISSION', 'ADD GIFT CARD PERMISSION', 'DELETE GIFT CARD PERMISSION', 'GET PAYROLL PERMISSION', 'UPDATE PAYROLL PERMISSION', 'ADD PAYROLL PERMISSION', 'DELETE PAYROLL PERMISSION', 'GET SCHEDULE PERMISSION', 'UPDATE SCHEDULE PERMISSION', 'ADD SCHEDULE PERMISSION', 'DELETE SCHEDULE PERMISSION', 'GET SERVICE PERMISSION', 'UPDATE SERVICE PERMISSION', 'ADD SERVICE PERMISSION', 'DELETE SERVICE PERMISSION', 'GET RESERVATION PERMISSION', 'UPDATE RESERVATION PERMISSION', 'ADD RESERVATION PERMISSION', 'DELETE RESERVATION PERMISSION', 'EDIT PAST RESERVATION PERMISSION', 'GET VIP PACKAGE PERMISSION', 'UPDATE VIP PACKAGE PERMISSION', 'ADD VIP PACKAGE PERMISSION', 'DELETE VIP PACKAGE PERMISSION')`
		);
		await queryRunner.query(
			`ALTER TABLE "employees" ALTER COLUMN "permissions" DROP DEFAULT`
		);
		await queryRunner.query(
			`ALTER TABLE "employees" ALTER COLUMN "permissions" TYPE "public"."employees_permissions_enum"[] USING "permissions"::"text"::"public"."employees_permissions_enum"[]`
		);
		await queryRunner.query(
			`ALTER TABLE "employees" ALTER COLUMN "permissions" SET DEFAULT '{}'`
		);
		await queryRunner.query(
			`DROP TYPE "public"."employees_permissions_enum_old"`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// The permission has to be taken away from everyone holding it before the
		// enum can be narrowed back down.
		await queryRunner.query(
			`UPDATE "employees" SET "permissions" = array_remove("permissions", 'EDIT PAST RESERVATION PERMISSION'::"public"."employees_permissions_enum")`
		);
		await queryRunner.query(
			`CREATE TYPE "public"."employees_permissions_enum_old" AS ENUM('GET CUSTOMER PERMISSION', 'UPDATE CUSTOMER PERMISSION', 'ADD CUSTOMER PERMISSION', 'DELETE CUSTOMER PERMISSION', 'GET EMPLOYEE PERMISSION', 'UPDATE EMPLOYEE PERMISSION', 'ADD EMPLOYEE PERMISSION', 'DELETE EMPLOYEE PERMISSION', 'GET GIFT CARD PERMISSION', 'UPDATE GIFT CARD PERMISSION', 'ADD GIFT CARD PERMISSION', 'DELETE GIFT CARD PERMISSION', 'GET PAYROLL PERMISSION', 'UPDATE PAYROLL PERMISSION', 'ADD PAYROLL PERMISSION', 'DELETE PAYROLL PERMISSION', 'GET SCHEDULE PERMISSION', 'UPDATE SCHEDULE PERMISSION', 'ADD SCHEDULE PERMISSION', 'DELETE SCHEDULE PERMISSION', 'GET SERVICE PERMISSION', 'UPDATE SERVICE PERMISSION', 'ADD SERVICE PERMISSION', 'DELETE SERVICE PERMISSION', 'GET RESERVATION PERMISSION', 'UPDATE RESERVATION PERMISSION', 'ADD RESERVATION PERMISSION', 'DELETE RESERVATION PERMISSION', 'GET VIP PACKAGE PERMISSION', 'UPDATE VIP PACKAGE PERMISSION', 'ADD VIP PACKAGE PERMISSION', 'DELETE VIP PACKAGE PERMISSION')`
		);
		await queryRunner.query(
			`ALTER TABLE "employees" ALTER COLUMN "permissions" DROP DEFAULT`
		);
		await queryRunner.query(
			`ALTER TABLE "employees" ALTER COLUMN "permissions" TYPE "public"."employees_permissions_enum_old"[] USING "permissions"::"text"::"public"."employees_permissions_enum_old"[]`
		);
		await queryRunner.query(
			`ALTER TABLE "employees" ALTER COLUMN "permissions" SET DEFAULT '{}'`
		);
		await queryRunner.query(`DROP TYPE "public"."employees_permissions_enum"`);
		await queryRunner.query(
			`ALTER TYPE "public"."employees_permissions_enum_old" RENAME TO "employees_permissions_enum"`
		);
	}
}
