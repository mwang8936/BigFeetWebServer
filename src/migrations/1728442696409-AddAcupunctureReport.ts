import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAcupunctureReport1728442696409 implements MigrationInterface {
	name = 'AddAcupunctureReport1728442696409';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "acupuncture_report" ("year" integer NOT NULL, "month" integer NOT NULL, "employee_id" integer NOT NULL, "acupuncture_percentage" numeric(5,4) NOT NULL DEFAULT '0.7', "massage_percentage" numeric(5,4) NOT NULL DEFAULT '0.3', "insurance_percentage" numeric(5,4) NOT NULL DEFAULT '0.3', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "CHK_73a313fa0aee740841e873412b" CHECK ("month" >= 1 AND month <= 12), CONSTRAINT "CHK_3e6db8ae27ae084c9c10a2cec0" CHECK ("year" >= 2020), CONSTRAINT "PK_893bee81aeb729868ba285a8935" PRIMARY KEY ("year", "month", "employee_id"))`
		);
		await queryRunner.query(
			`ALTER TABLE "acupuncture_report" ADD CONSTRAINT "FK_894d4b44caf767757bc0b17cd64" FOREIGN KEY ("employee_id") REFERENCES "employees"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "acupuncture_report" DROP CONSTRAINT "FK_894d4b44caf767757bc0b17cd64"`
		);
		await queryRunner.query(`DROP TABLE "acupuncture_report"`);
	}
}
