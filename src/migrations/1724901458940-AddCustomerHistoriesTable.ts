import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomerHistoriesTable1724901458940
	implements MigrationInterface
{
	name = 'AddCustomerHistoriesTable1724901458940';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "customer_history" ("customer_id" integer NOT NULL, "valid_from" TIMESTAMP WITH TIME ZONE NOT NULL, "valid_to" TIMESTAMP WITH TIME ZONE, "phone_number" character varying(10), "vip_serial" character varying(6), "customer_name" character varying(60), "notes" text, CONSTRAINT "PK_e781f832c08b8a3118ca3c8de60" PRIMARY KEY ("customer_id", "valid_from"))`
		);
		await queryRunner.query(`
            ALTER TABLE customers
            ALTER COLUMN created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC',
            ALTER COLUMN updated_at TYPE timestamptz USING updated_at AT TIME ZONE 'UTC',
            ALTER COLUMN deleted_at TYPE timestamptz USING deleted_at AT TIME ZONE 'UTC';
        `);
		await queryRunner.query(
			`ALTER TABLE "customer_history" ADD CONSTRAINT "FK_0dc642352ee7e6e0354a1e25410" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE CASCADE ON UPDATE CASCADE`
		);

		await queryRunner.query(`
            INSERT INTO customer_history (
                customer_id,
                valid_from,
                valid_to,
                phone_number,
                vip_serial,
                customer_name,
                notes
            )
            SELECT
                customer_id,
                '2024-01-01',
                deleted_at,
                phone_number,
                vip_serial,
                customer_name,
                notes
            FROM
                customers
        `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "customer_history" DROP CONSTRAINT "FK_0dc642352ee7e6e0354a1e25410"`
		);
		await queryRunner.query(`
            ALTER TABLE customers
            ALTER COLUMN created_at TYPE timestamp WITHOUT TIME ZONE USING created_at AT TIME ZONE 'UTC',
            ALTER COLUMN updated_at TYPE timestamp WITHOUT TIME ZONE USING updated_at AT TIME ZONE 'UTC',
            ALTER COLUMN deleted_at TYPE timestamp WITHOUT TIME ZONE USING deleted_at AT TIME ZONE 'UTC';
        `);

		await queryRunner.query(`DROP TABLE "customer_history"`);
	}
}
