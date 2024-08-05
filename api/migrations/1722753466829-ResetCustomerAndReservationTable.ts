import { MigrationInterface, QueryRunner } from 'typeorm';

export class ResetCustomerAndReservationTable1722753466829
	implements MigrationInterface
{
	name = 'ResetCustomerAndReservationTable1722753466829';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE \`Customers\` (\`customer_id\` int NOT NULL AUTO_INCREMENT, \`phone_number\` varchar(10) NULL, \`vip_serial\` varchar(6) NULL, \`customer_name\` varchar(60) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_bin" NULL, \`notes\` text CHARACTER SET "utf8mb4" COLLATE "utf8mb4_bin" NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`customer_id\`)) ENGINE=InnoDB`
		);
		await queryRunner.query(
			`CREATE TABLE \`Reservations\` (\`reservation_id\` int NOT NULL AUTO_INCREMENT, \`reserved_date\` datetime NOT NULL, \`date\` date NOT NULL, \`employee_id\` int NOT NULL, \`requested_gender\` enum ('MALE', 'FEMALE') NULL, \`requested_employee\` tinyint NOT NULL DEFAULT 0, \`cash\` decimal(5,2) UNSIGNED NULL, \`machine\` decimal(5,2) UNSIGNED NULL, \`vip\` decimal(5,2) UNSIGNED NULL, \`gift_card\` decimal(5,2) UNSIGNED NULL, \`insurance\` decimal(5,2) UNSIGNED NULL, \`tips\` decimal(6,2) UNSIGNED NULL, \`tip_method\` enum ('CASH', 'MACHINE', 'HALF') NULL, \`message\` text CHARACTER SET "utf8mb4" COLLATE "utf8mb4_bin" NULL, \`created_by\` varchar(200) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_by\` varchar(200) NOT NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`service_id\` int NULL, \`customer_id\` int NULL, PRIMARY KEY (\`reservation_id\`)) ENGINE=InnoDB`
		);
		await queryRunner.query(
			`ALTER TABLE \`Reservations\` ADD CONSTRAINT \`FK_c329cbd7359edd8b43def969504\` FOREIGN KEY (\`date\`, \`employee_id\`) REFERENCES \`Schedules\`(\`date\`,\`employee_id\`) ON DELETE CASCADE ON UPDATE CASCADE`
		);
		await queryRunner.query(
			`ALTER TABLE \`Reservations\` ADD CONSTRAINT \`FK_d177729f8e3d6b11fd997390713\` FOREIGN KEY (\`service_id\`) REFERENCES \`Services\`(\`service_id\`) ON DELETE CASCADE ON UPDATE CASCADE`
		);
		await queryRunner.query(
			`ALTER TABLE \`Reservations\` ADD CONSTRAINT \`FK_6e6ddd54b4641e309135ef3111b\` FOREIGN KEY (\`customer_id\`) REFERENCES \`Customers\`(\`customer_id\`) ON DELETE SET NULL ON UPDATE CASCADE`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`Reservations\` DROP FOREIGN KEY \`FK_6e6ddd54b4641e309135ef3111b\``
		);
		await queryRunner.query(
			`ALTER TABLE \`Reservations\` DROP FOREIGN KEY \`FK_d177729f8e3d6b11fd997390713\``
		);
		await queryRunner.query(
			`ALTER TABLE \`Reservations\` DROP FOREIGN KEY \`FK_c329cbd7359edd8b43def969504\``
		);
		await queryRunner.query(`DROP TABLE \`Reservations\``);
		await queryRunner.query(`DROP TABLE \`Customers\``);
	}
}
