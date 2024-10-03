import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPayrollEntity1727996033725 implements MigrationInterface {
	name = 'AddPayrollEntity1727996033725';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."payroll_part_enum" AS ENUM('1', '2')`
		);
		await queryRunner.query(
			`CREATE TYPE "public"."payroll_option_enum" AS ENUM('ACUPUNCTURIST', 'RECEPTIONIST', 'STORE EMPLOYEE', 'STORE EMPLOYEE + TIPS AND CASH')`
		);
		await queryRunner.query(
			`CREATE TABLE "payroll" ("year" integer NOT NULL, "month" integer NOT NULL, "part" "public"."payroll_part_enum" NOT NULL, "employee_id" integer NOT NULL, "option" "public"."payroll_option_enum" NOT NULL, "cheque_amount" numeric(8,2), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "CHK_d516ad5f0fc5d96c6ff2b07884" CHECK ("month" >= 1 AND month <= 12), CONSTRAINT "CHK_34306141c55cd1fa0878041241" CHECK ("year" >= 2020), CONSTRAINT "PK_d1864a5b9216d50408dd28e54a8" PRIMARY KEY ("year", "month", "part", "employee_id"))`
		);
		await queryRunner.query(
			`ALTER TABLE "schedules" ADD "part" "public"."payroll_part_enum"`
		);
		await queryRunner.query(
			`ALTER TABLE "payroll" ADD CONSTRAINT "FK_877911f59f52f487fb855aa05a2" FOREIGN KEY ("employee_id") REFERENCES "employees"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE`
		);
		await queryRunner.query(
			`ALTER TABLE "schedules" ADD CONSTRAINT "FK_c9d6dc6c9a4b0506255c0423d2c" FOREIGN KEY ("year", "month", "part", "employee_id") REFERENCES "payroll"("year","month","part","employee_id") ON DELETE SET NULL ON UPDATE CASCADE`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "schedules" DROP CONSTRAINT "FK_c9d6dc6c9a4b0506255c0423d2c"`
		);
		await queryRunner.query(
			`ALTER TABLE "payroll" DROP CONSTRAINT "FK_877911f59f52f487fb855aa05a2"`
		);
		await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "part"`);
		await queryRunner.query(`DROP TABLE "payroll"`);
		await queryRunner.query(`DROP TYPE "public"."payroll_option_enum"`);
		await queryRunner.query(`DROP TYPE "public"."payroll_part_enum"`);
	}
}
