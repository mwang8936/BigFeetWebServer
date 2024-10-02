import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeSchedulePrimaryKey1727910532162
	implements MigrationInterface
{
	name = 'ChangeSchedulePrimaryKey1727910532162';

	public async up(queryRunner: QueryRunner): Promise<void> {
		// Add year/month/day columns for join table
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" ADD "year" integer`
		);
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" ADD "month" integer`
		);
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" ADD "day" integer`
		);

		// Add year/month/day columns for schedules
		await queryRunner.query(`ALTER TABLE "schedules" ADD "year" integer`);
		await queryRunner.query(`ALTER TABLE "schedules" ADD "month" integer`);
		await queryRunner.query(`ALTER TABLE "schedules" ADD "day" integer`);

		// Add constraints for schedules
		await queryRunner.query(
			`ALTER TABLE "schedules" ADD CONSTRAINT "CHK_218303164242f5eca12d159b30" CHECK ("day" >= 1 AND day <= 31)`
		);
		await queryRunner.query(
			`ALTER TABLE "schedules" ADD CONSTRAINT "CHK_a8ca35af60b93d472b51dec714" CHECK ("month" >= 1 AND month <= 12)`
		);
		await queryRunner.query(
			`ALTER TABLE "schedules" ADD CONSTRAINT "CHK_8a7fa1dd1b38279ac52e656004" CHECK ("year" >= 2020)`
		);

		// Add year/month/day columns for reservations
		await queryRunner.query(`ALTER TABLE "reservations" ADD "year" integer`);
		await queryRunner.query(`ALTER TABLE "reservations" ADD "month" integer`);
		await queryRunner.query(`ALTER TABLE "reservations" ADD "day" integer`);

		// Add join table data
		await queryRunner.query(`
            UPDATE schedules_vip_packages_vip_packages_sold
            SET 
                year = EXTRACT(YEAR FROM date),
                month = EXTRACT(MONTH FROM date),
                day = EXTRACT(DAY FROM date);
        `);

		// Add schedules data
		await queryRunner.query(`
            UPDATE schedules
            SET 
                year = EXTRACT(YEAR FROM date),
                month = EXTRACT(MONTH FROM date),
                day = EXTRACT(DAY FROM date);
        `);

		// Add reservations data
		await queryRunner.query(`
            UPDATE reservations
            SET 
                year = EXTRACT(YEAR FROM date),
                month = EXTRACT(MONTH FROM date),
                day = EXTRACT(DAY FROM date);
        `);

		// Set year/month/day columns to not null
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" ALTER COLUMN "year" SET NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" ALTER COLUMN "month" SET NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" ALTER COLUMN "day" SET NOT NULL`
		);

		// Set year/month/day columns to not null for schedules
		await queryRunner.query(
			`ALTER TABLE "schedules" ALTER COLUMN "year" SET NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "schedules" ALTER COLUMN "month" SET NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "schedules" ALTER COLUMN "day" SET NOT NULL`
		);

		// Set year/month/day columns to not null for reservations
		await queryRunner.query(
			`ALTER TABLE "reservations" ALTER COLUMN "year" SET NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "reservations" ALTER COLUMN "month" SET NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "reservations" ALTER COLUMN "day" SET NOT NULL`
		);

		// Remove foreign key constraint for reservations
		await queryRunner.query(
			`ALTER TABLE "reservations" DROP CONSTRAINT "FK_0ace9dfa2bc3a4d8a25dfe3b954"`
		);

		// Remove foreign key constraint for join table
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" DROP CONSTRAINT "FK_6af030a28b4787178a6a317229e"`
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_6af030a28b4787178a6a317229"`
		);

		// Remove primary key constraint for join table
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" DROP CONSTRAINT "PK_ee5bd5c8c321ca4afee7a013944"`
		);

		// Add primary key constraint for join table
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" ADD CONSTRAINT "PK_2e461c952c4390b3f900c9640c3" PRIMARY KEY ("employee_id", "vip_package_id", "year", "month", "day")`
		);

		// Remove primary key constraint for schedules
		await queryRunner.query(
			`ALTER TABLE "schedules" DROP CONSTRAINT "PK_e6eba7dd883112382b106450b2f"`
		);

		// Add primary key constraint for schedules
		await queryRunner.query(
			`ALTER TABLE "schedules" ADD CONSTRAINT "PK_f22d12c6cffd5f29ad2e9f182cd" PRIMARY KEY ("employee_id", "year", "month", "day")`
		);

		// Add foreign key constraint for reservations
		await queryRunner.query(
			`ALTER TABLE "reservations" ADD CONSTRAINT "FK_acf3f2f3cc1c83dec2d4695802d" FOREIGN KEY ("year", "month", "day", "employee_id") REFERENCES "schedules"("year","month","day","employee_id") ON DELETE CASCADE ON UPDATE CASCADE`
		);

		// Add foreign key constraints for join table
		await queryRunner.query(
			`CREATE INDEX "IDX_f2beeaebe27f5a7007463f5601" ON "schedules_vip_packages_vip_packages_sold" ("year", "month", "day", "employee_id") `
		);
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" ADD CONSTRAINT "FK_f2beeaebe27f5a7007463f56012" FOREIGN KEY ("year", "month", "day", "employee_id") REFERENCES "schedules"("year","month","day","employee_id") ON DELETE CASCADE ON UPDATE CASCADE`
		);

		// Remove date column for join table, schedules, and reservations
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" DROP COLUMN "date"`
		);
		await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "date"`);
		await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "date"`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// Add date column for join table, schedules, and reservations
		await queryRunner.query(`ALTER TABLE "reservations" ADD "date" date`);
		await queryRunner.query(`ALTER TABLE "schedules" ADD "date" date`);
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" ADD "date" date`
		);

		// Add reservations data
		await queryRunner.query(`
            UPDATE reservations
            SET 
                date = make_date(year, month, day);
        `);

		// Add schedules data
		await queryRunner.query(`
            UPDATE schedules
            SET 
                date = make_date(year, month, day);
        `);

		// Add join table data
		await queryRunner.query(`
            UPDATE schedules_vip_packages_vip_packages_sold
            SET 
                date = make_date(year, month, day);
        `);

		// Set date columns to not null
		await queryRunner.query(
			`ALTER TABLE "reservations" ALTER COLUMN "date" SET NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "schedules" ALTER COLUMN "date" SET NOT NULL`
		);
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" ALTER COLUMN "date" SET NOT NULL`
		);

		// Remove foreign key constraints for join table
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" DROP CONSTRAINT "FK_f2beeaebe27f5a7007463f56012"`
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_f2beeaebe27f5a7007463f5601"`
		);

		// Remove foreign key constraints for reservations
		await queryRunner.query(
			`ALTER TABLE "reservations" DROP CONSTRAINT "FK_acf3f2f3cc1c83dec2d4695802d"`
		);

		// Remove primary key constraints for schedules
		await queryRunner.query(
			`ALTER TABLE "schedules" DROP CONSTRAINT "PK_f22d12c6cffd5f29ad2e9f182cd"`
		);

		// Add primary key constraints for schedules
		await queryRunner.query(
			`ALTER TABLE "schedules" ADD CONSTRAINT "PK_e6eba7dd883112382b106450b2f" PRIMARY KEY ("date", "employee_id")`
		);

		// Remove primary key constraints for join table
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" DROP CONSTRAINT "PK_2e461c952c4390b3f900c9640c3"`
		);

		// Add primary key constraints for join table
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" ADD CONSTRAINT "PK_ee5bd5c8c321ca4afee7a013944" PRIMARY KEY ("date", "employee_id", "vip_package_id")`
		);

		// Add foreign key constraints for join table
		await queryRunner.query(
			`CREATE INDEX "IDX_6af030a28b4787178a6a317229" ON "schedules_vip_packages_vip_packages_sold" ("date", "employee_id") `
		);
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" ADD CONSTRAINT "FK_6af030a28b4787178a6a317229e" FOREIGN KEY ("date", "employee_id") REFERENCES "schedules"("date","employee_id") ON DELETE CASCADE ON UPDATE CASCADE`
		);

		// Add foreign key constraints for reservations
		await queryRunner.query(
			`ALTER TABLE "reservations" ADD CONSTRAINT "FK_0ace9dfa2bc3a4d8a25dfe3b954" FOREIGN KEY ("date", "employee_id") REFERENCES "schedules"("date","employee_id") ON DELETE CASCADE ON UPDATE CASCADE`
		);

		// Remove schedules constraints
		await queryRunner.query(
			`ALTER TABLE "schedules" DROP CONSTRAINT "CHK_8a7fa1dd1b38279ac52e656004"`
		);
		await queryRunner.query(
			`ALTER TABLE "schedules" DROP CONSTRAINT "CHK_a8ca35af60b93d472b51dec714"`
		);
		await queryRunner.query(
			`ALTER TABLE "schedules" DROP CONSTRAINT "CHK_218303164242f5eca12d159b30"`
		);

		// Remove year, month, day columns
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" DROP COLUMN "day"`
		);
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" DROP COLUMN "month"`
		);
		await queryRunner.query(
			`ALTER TABLE "schedules_vip_packages_vip_packages_sold" DROP COLUMN "year"`
		);
		await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "day"`);
		await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "month"`);
		await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "year"`);
		await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "day"`);
		await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "month"`);
		await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "year"`);
	}
}
