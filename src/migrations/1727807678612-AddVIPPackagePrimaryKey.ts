import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVIPPackagePrimaryKey1727807678612
	implements MigrationInterface
{
	name = 'AddVIPPackagePrimaryKey1727807678612';

	public async up(queryRunner: QueryRunner): Promise<void> {
		// Add vip_package_id as an auto-increment column to the vip_packages_sold table
		await queryRunner.query(
			`ALTER TABLE "vip_packages_sold" ADD "vip_package_id" SERIAL NOT NULL`
		);

		// Add vip_package_id to join table and add appropriate data
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" ADD "vip_package_id" INT`
		);
		await queryRunner.query(
			`UPDATE schedules_vip_packages_vip_packages_sold
            SET vip_package_id = vip_packages_sold.vip_package_id
            FROM vip_packages_sold
            WHERE schedules_vip_packages_vip_packages_sold.serial = vip_packages_sold.serial`
		);
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" ALTER COLUMN "vip_package_id" SET NOT NULL`
		);

		// Remove foreign key constraint for join table
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" DROP CONSTRAINT "FK_a280bd5bfb79c663644b3cde55e"`
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_a280bd5bfb79c663644b3cde55"`
		);

		// Remove primary key constraint for join table
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" DROP CONSTRAINT "PK_5e081c90eb996c1c6710c6d1be4"`
		);

		// Add primary key constraint for join table
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" ADD CONSTRAINT "PK_ee5bd5c8c321ca4afee7a013944" PRIMARY KEY ("date", "employee_id", "vip_package_id")`
		);

		// Remove primary key constraint for vip packages
		await queryRunner.query(
			`ALTER TABLE "vip_packages_sold" DROP CONSTRAINT "PK_8508b40e09fb8ab183e14e0ae29"`
		);

		// Add primary key constraint for vip packages
		await queryRunner.query(
			`ALTER TABLE "vip_packages_sold" ADD CONSTRAINT "PK_26c43a2d0eaff6cbf934d0c379c" PRIMARY KEY ("vip_package_id")`
		);

		// Add foreign key constraint for join table
		await queryRunner.query(
			`CREATE INDEX "IDX_8f4a12308dd6f0ce749e47b9e5" ON "schedules_vip_packages_vip_packages_sold" ("vip_package_id") `
		);
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" ADD CONSTRAINT "FK_8f4a12308dd6f0ce749e47b9e50" FOREIGN KEY ("vip_package_id") REFERENCES "vip_packages_sold"("vip_package_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);

		// Remove serial column for join table
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" DROP COLUMN "serial"`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// Add serial column for join table
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" ADD "serial" character varying(6)`
		);
		await queryRunner.query(
			`UPDATE schedules_vip_packages_vip_packages_sold
            SET serial = vip_packages_sold.serial
            FROM vip_packages_sold
            WHERE schedules_vip_packages_vip_packages_sold.vip_package_id = vip_packages_sold.vip_package_id`
		);

		// Remove foreign key constraint for join table
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" DROP CONSTRAINT "FK_8f4a12308dd6f0ce749e47b9e50"`
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_8f4a12308dd6f0ce749e47b9e5"`
		);

		// Remove primary key constraint for vip packages
		await queryRunner.query(
			`ALTER TABLE "vip_packages_sold" DROP CONSTRAINT "PK_26c43a2d0eaff6cbf934d0c379c"`
		);

		// Add primary key constraint for vip packages
		await queryRunner.query(
			`ALTER TABLE "vip_packages_sold" ADD CONSTRAINT "PK_8508b40e09fb8ab183e14e0ae29" PRIMARY KEY ("serial")`
		);

		// Remove primary key constraint for join table
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" DROP CONSTRAINT "PK_ee5bd5c8c321ca4afee7a013944"`
		);

		// Add primary key constraint for join table
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" ADD CONSTRAINT "PK_5e081c90eb996c1c6710c6d1be4" PRIMARY KEY ("date", "employee_id", "serial")`
		);

		// Add foreign key constraint for join table
		await queryRunner.query(
			`CREATE INDEX "IDX_a280bd5bfb79c663644b3cde55" ON "schedules_vip_packages_vip_packages_sold" ("serial") `
		);
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" ADD CONSTRAINT "FK_a280bd5bfb79c663644b3cde55e" FOREIGN KEY ("serial") REFERENCES "vip_packages_sold"("serial") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);

		// Remove columns
		await queryRunner.query(
			`ALTER TABLE "vip_packages_sold" DROP COLUMN "vip_package_id"`
		);
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" DROP COLUMN "vip_package_id"`
		);
	}
}
