import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshToken1735760805980 implements MigrationInterface {
	name = 'AddRefreshToken1735760805980';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "refresh_tokens" ("refresh_token_id" SERIAL NOT NULL, "hashed_refresh_token" character varying(255) NOT NULL, "expires_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "employee_id" integer, CONSTRAINT "PK_9dbdad80950b681a645b4f6373a" PRIMARY KEY ("refresh_token_id"))`
		);
		await queryRunner.query(
			`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_b8b76bed7270f26e59ff5561715" FOREIGN KEY ("employee_id") REFERENCES "employees"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_b8b76bed7270f26e59ff5561715"`
		);
		await queryRunner.query(`DROP TABLE "refresh_tokens"`);
	}
}
