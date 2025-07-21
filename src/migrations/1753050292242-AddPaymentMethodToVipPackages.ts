import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPaymentMethodToVipPackages1753050292242
	implements MigrationInterface
{
	name = 'AddPaymentMethodToVipPackages1753050292242';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."vip_packages_sold_payment_method_enum" AS ENUM('CASH', 'MACHINE')`
		);

		// 1. Add column as nullable with a default (so it doesn't fail)
		await queryRunner.query(
			`ALTER TABLE "vip_packages_sold" ADD "payment_method" "public"."vip_packages_sold_payment_method_enum"`
		);

		// 2. Update existing rows to 'MACHINE'
		await queryRunner.query(
			`UPDATE "vip_packages_sold" SET "payment_method" = 'MACHINE' WHERE "payment_method" IS NULL`
		);

		// 3. Alter column to NOT NULL
		await queryRunner.query(
			`ALTER TABLE "vip_packages_sold" ALTER COLUMN "payment_method" SET NOT NULL`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "vip_packages_sold" DROP COLUMN "payment_method"`
		);
		await queryRunner.query(
			`DROP TYPE "public"."vip_packages_sold_payment_method_enum"`
		);
	}
}
