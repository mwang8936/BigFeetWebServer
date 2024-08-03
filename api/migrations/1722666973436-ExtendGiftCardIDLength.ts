import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExtendGiftCardIDLength1722666973436 implements MigrationInterface {
	name = 'ExtendGiftCardIDLength1722666973436';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            DROP TABLE IF EXISTS \`GiftCardsSold\`;
        `);

		await queryRunner.query(`
            CREATE TABLE \`GiftCardsSold\` (
                \`gift_card_id\` varchar(8) NOT NULL,
                \`date\` date NOT NULL,
                \`payment_method\` enum('CASH', 'MACHINE') NOT NULL,
                \`payment_amount\` decimal(6,2) UNSIGNED NOT NULL,
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
                PRIMARY KEY (\`gift_card_id\`)
            );
        `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            DROP TABLE IF EXISTS \`GiftCardsSold\`;
        `);

		await queryRunner.query(`
            CREATE TABLE \`GiftCardsSold\` (
                \`gift_card_id\` int NOT NULL AUTO_INCREMENT,
                \`date\` date NOT NULL,
                \`payment_method\` enum('CASH', 'MACHINE') NOT NULL,
                \`payment_amount\` decimal(6,2) UNSIGNED NOT NULL,
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
                PRIMARY KEY (\`gift_card_id\`)
            );
        `);
	}
}
