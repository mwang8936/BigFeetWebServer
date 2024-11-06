import { MigrationInterface, QueryRunner } from 'typeorm';

export class ServiceVersioningSystem1730875148583
	implements MigrationInterface
{
	name = 'ServiceVersioningSystem1730875148583';

	public async up(queryRunner: QueryRunner): Promise<void> {
		// Create history table
		await queryRunner.query(
			`CREATE TABLE "service_history" ("service_id" integer NOT NULL, "valid_from" date NOT NULL, "valid_to" date, "service_name" character varying(30) NOT NULL, "shorthand" character varying(20) NOT NULL, "time" integer NOT NULL, "money" numeric(5,2) NOT NULL, "body" numeric(2,1) NOT NULL DEFAULT '0', "feet" numeric(2,1) NOT NULL DEFAULT '0', "acupuncture" numeric(2,1) NOT NULL DEFAULT '0', "beds_required" integer NOT NULL DEFAULT '0', "color" "public"."services_color_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_b237712f2977799cd0df29ad905" PRIMARY KEY ("service_id", "valid_from"))`
		);

		// Add current history in
		await queryRunner.query(`
            INSERT INTO "service_history" (
                "service_id",
                "valid_from",
                "valid_to",
                "service_name",
                "shorthand",
                "time",
                "money",
                "body",
                "feet",
                "acupuncture",
                "beds_required",
                "color",
                "created_at",
                "updated_at",
                "deleted_at"
            )
            SELECT 
                "service_id",
                '2020-01-01'::date AS "valid_from",
                NULL AS "valid_to",
                "service_name",
                "shorthand",
                "time",
                "money",
                "body",
                "feet",
                "acupuncture",
                "beds_required",
                "color",
                "created_at",
                "updated_at",
                "deleted_at"
            FROM "services";
        `);

		// Drop reservation foreign key constraint
		await queryRunner.query(
			`ALTER TABLE "reservations" DROP CONSTRAINT "FK_f9a66ac5e3a797ee7d588334c18"`
		);

		// Remove base service columns
		await queryRunner.query(`ALTER TABLE "services" DROP COLUMN "time"`);
		await queryRunner.query(`ALTER TABLE "services" DROP COLUMN "money"`);
		await queryRunner.query(`ALTER TABLE "services" DROP COLUMN "body"`);
		await queryRunner.query(`ALTER TABLE "services" DROP COLUMN "feet"`);
		await queryRunner.query(`ALTER TABLE "services" DROP COLUMN "acupuncture"`);
		await queryRunner.query(
			`ALTER TABLE "services" DROP COLUMN "beds_required"`
		);

		// Add unique constraints
		await queryRunner.query(
			`ALTER TABLE "services" ADD CONSTRAINT "UQ_8403b383a9d6ef5b162a2de91c0" UNIQUE ("service_name")`
		);
		await queryRunner.query(
			`ALTER TABLE "services" ADD CONSTRAINT "UQ_3b7b8e8555ee48ef07266c0154e" UNIQUE ("shorthand")`
		);

		// Add service valid from column to reservation
		await queryRunner.query(
			`ALTER TABLE "reservations" ADD "service_valid_from" date`
		);

		// Add date into service valid from
		await queryRunner.query(
			`UPDATE "reservations" SET "service_valid_from" = '2020-01-01'`
		);
		await queryRunner.query(
			`ALTER TABLE "reservations" ALTER COLUMN "service_valid_from" SET NOT NULL`
		);

		// Set foreign key constraint
		await queryRunner.query(
			`ALTER TABLE "service_history" ADD CONSTRAINT "FK_03c46da7e0bf68a84ca4f336aab" FOREIGN KEY ("service_id") REFERENCES "services"("service_id") ON DELETE CASCADE ON UPDATE CASCADE`
		);
		await queryRunner.query(
			`ALTER TABLE "reservations" ADD CONSTRAINT "FK_df2c9e2723d76b308a6c436fdc8" FOREIGN KEY ("service_id", "service_valid_from") REFERENCES "service_history"("service_id","valid_from") ON DELETE CASCADE ON UPDATE CASCADE`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "reservations" DROP CONSTRAINT "FK_df2c9e2723d76b308a6c436fdc8"`
		);
		await queryRunner.query(
			`ALTER TABLE "service_history" DROP CONSTRAINT "FK_03c46da7e0bf68a84ca4f336aab"`
		);

		await queryRunner.query(
			`ALTER TABLE "services" DROP CONSTRAINT "UQ_3b7b8e8555ee48ef07266c0154e"`
		);
		await queryRunner.query(
			`ALTER TABLE "services" DROP CONSTRAINT "UQ_8403b383a9d6ef5b162a2de91c0"`
		);

		await queryRunner.query(
			`ALTER TABLE "reservations" DROP COLUMN "service_valid_from"`
		);

		await queryRunner.query(
			`ALTER TABLE "services" ADD "beds_required" integer DEFAULT '0'`
		);
		await queryRunner.query(
			`ALTER TABLE "services" ADD "acupuncture" numeric(2,1) DEFAULT '0'`
		);
		await queryRunner.query(
			`ALTER TABLE "services" ADD "feet" numeric(2,1) DEFAULT '0'`
		);
		await queryRunner.query(
			`ALTER TABLE "services" ADD "body" numeric(2,1) DEFAULT '0'`
		);
		await queryRunner.query(`ALTER TABLE "services" ADD "money" numeric(5,2)`);
		await queryRunner.query(`ALTER TABLE "services" ADD "time" integer`);

		// Restore service data from service_history to services
		await queryRunner.query(`
			INSERT INTO "services" (
				"service_id",
				"service_name",
				"shorthand",
				"time",
				"money",
				"body",
				"feet",
				"acupuncture",
				"beds_required",
				"color",
				"created_at",
				"updated_at",
				"deleted_at"
			)
			SELECT DISTINCT ON ("service_id")
				"service_id",
				"service_name",
				"shorthand",
				"time",
				"money",
				"body",
				"feet",
				"acupuncture",
				"beds_required",
				"color",
				"created_at",
				"updated_at",
				"deleted_at"
			FROM "service_history"
			ORDER BY "service_id", "valid_from" DESC
		`);

		await queryRunner.query(
			`ALTER TABLE "services" ALTER COLUMN "beds_required" SET NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "services" ALTER COLUMN "acupuncture" SET NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "services" ALTER COLUMN "feet" SET NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "services" ALTER COLUMN "body" SET NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "services" ALTER COLUMN "money" SET NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "services" ALTER COLUMN "time" SET NOT NULL`
		);

		await queryRunner.query(`DROP TABLE "service_history"`);
		await queryRunner.query(
			`ALTER TABLE "reservations" ADD CONSTRAINT "FK_f9a66ac5e3a797ee7d588334c18" FOREIGN KEY ("service_id") REFERENCES "services"("service_id") ON DELETE CASCADE ON UPDATE CASCADE`
		);
	}
}
