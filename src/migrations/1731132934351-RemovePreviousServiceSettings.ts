import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovePreviousServiceSettings1731132934351
	implements MigrationInterface
{
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

	public async down(queryRunner: QueryRunner): Promise<void> {}
}
