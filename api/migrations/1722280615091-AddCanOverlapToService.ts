import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCanOverlapToService1722280615091 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			'Services',
			new TableColumn({
				name: 'can_overlap',
				type: 'boolean',
				default: false,
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn('Services', 'can_overlap');
	}
}
