import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeviceTable1749172587892 implements MigrationInterface {
	name = 'AddDeviceTable1749172587892';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "devices" ("device_id" character varying NOT NULL, "employee_id" integer NOT NULL, "device_name" text, "device_model" text, "push_token" text, "refresh_token" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3246c7199482a3fb6053b26eb0d" PRIMARY KEY ("device_id", "employee_id"))`
		);
		await queryRunner.query(
			`ALTER TABLE "devices" ADD CONSTRAINT "FK_03b364f3c9a17cb28b07001acf4" FOREIGN KEY ("employee_id") REFERENCES "employees"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "devices" DROP CONSTRAINT "FK_03b364f3c9a17cb28b07001acf4"`
		);
		await queryRunner.query(`DROP TABLE "devices"`);
	}
}
