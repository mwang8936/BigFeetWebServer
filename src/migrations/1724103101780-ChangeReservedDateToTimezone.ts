import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeReservedDateToTimezone1724103101780
	implements MigrationInterface
{
	name = 'ChangeReservedDateToTimezone1724103101780';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            ALTER TABLE reservations 
            ALTER COLUMN reserved_date 
            TYPE timestamptz 
            USING reserved_date AT TIME ZONE '-07:00';
        `);

		// Adjust all existing data to UTC-7
		await queryRunner.query(`
            UPDATE reservations 
            SET reserved_date = reserved_date AT TIME ZONE '-07:00';
        `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            ALTER TABLE reservations 
            ALTER COLUMN reserved_date 
            TYPE timestamp 
            USING reserved_date AT TIME ZONE 'UTC';
        `);
	}
}
