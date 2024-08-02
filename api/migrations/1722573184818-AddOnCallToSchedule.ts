import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOnCallToSchedule1722573184818 implements MigrationInterface {
	name = 'AddOnCallToSchedule1722573184818';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			'Schedules',
			new TableColumn({
				name: 'on_call',
				type: 'boolean',
				default: false,
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn('Schedules', 'on_call');
	}
}
