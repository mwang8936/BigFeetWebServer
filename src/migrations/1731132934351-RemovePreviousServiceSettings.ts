import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovePreviousServiceSettings1731132934351
	implements MigrationInterface
{
	name = 'RemovePreviousServiceSettings1731132934351';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            UPDATE reservations
            SET time = NULL
            WHERE time IS NOT NULL
            AND service_id IS NOT NULL
            AND time = (
                SELECT service_history.time
                FROM service_history
                WHERE service_history.service_id = reservations.service_id
                    AND service_history.valid_from = reservations.service_valid_from
            );
        `);

		await queryRunner.query(`
            UPDATE reservations
            SET beds_required = NULL
            WHERE beds_required IS NOT NULL
            AND service_id IS NOT NULL
            AND beds_required = (
                SELECT service_history.beds_required
                FROM service_history
                WHERE service_history.service_id = reservations.service_id
                    AND service_history.valid_from = reservations.service_valid_from
            );
        `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// Restore time for reservations that match their service record's default
		// (values that were nulled by up() are no longer distinguishable from
		// intentional NULLs, so this is a best-effort restore).
		await queryRunner.query(`
            UPDATE reservations
            SET time = service_history.time
            FROM service_history
            WHERE reservations.time IS NULL
                AND reservations.service_id IS NOT NULL
                AND service_history.service_id = reservations.service_id
                AND service_history.valid_from = reservations.service_valid_from;
        `);

		await queryRunner.query(`
            UPDATE reservations
            SET beds_required = service_history.beds_required
            FROM service_history
            WHERE reservations.beds_required IS NULL
                AND reservations.service_id IS NOT NULL
                AND service_history.service_id = reservations.service_id
                AND service_history.valid_from = reservations.service_valid_from;
        `);
	}
}
