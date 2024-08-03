import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePermissionsEnum1722646370930 implements MigrationInterface {
	name = 'UpdatePermissionsEnum1722646370930';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE Employees MODIFY permissions SET(
                'GET CUSTOMER PERMISSION',
                'UPDATE CUSTOMER PERMISSION',
                'ADD CUSTOMER PERMISSION',
                'DELETE CUSTOMER PERMISSION',
                'GET EMPLOYEE PERMISSION',
                'UPDATE EMPLOYEE PERMISSION',
                'ADD EMPLOYEE PERMISSION',
                'DELETE EMPLOYEE PERMISSION',
                'GET GIFT CARD PERMISSION',
                'UPDATE GIFT CARD PERMISSION',
                'ADD GIFT CARD PERMISSION',
                'DELETE GIFT CARD PERMISSION',
                'GET SCHEDULE PERMISSION',
                'UPDATE SCHEDULE PERMISSION',
                'ADD SCHEDULE PERMISSION',
                'DELETE SCHEDULE PERMISSION',
                'GET SERVICE PERMISSION',
                'UPDATE SERVICE PERMISSION',
                'ADD SERVICE PERMISSION',
                'DELETE SERVICE PERMISSION',
                'GET RESERVATION PERMISSION',
                'UPDATE RESERVATION PERMISSION',
                'ADD RESERVATION PERMISSION',
                'DELETE RESERVATION PERMISSION',
                'GET VIP PACKAGE PERMISSION',
                'UPDATE VIP PACKAGE PERMISSION',
                'ADD VIP PACKAGE PERMISSION',
                'DELETE VIP PACKAGE PERMISSION'
            )`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE Employees MODIFY permissions SET(
                'GET CUSTOMER PERMISSION',
                'UPDATE CUSTOMER PERMISSION',
                'ADD CUSTOMER PERMISSION',
                'DELETE CUSTOMER PERMISSION',
                'GET EMPLOYEE PERMISSION',
                'UPDATE EMPLOYEE PERMISSION',
                'ADD EMPLOYEE PERMISSION',
                'DELETE EMPLOYEE PERMISSION',
                'GET GIFT CARD PERMISSION',
                'UPDATE GIFT CARD PERMISSION',
                'ADD GIFT CARD PERMISSION',
                'DELETE GIFT CARD PERMISSION',
                'GET SCHEDULE PERMISSION',
                'UPDATE SCHEDULE PERMISSION',
                'ADD SCHEDULE PERMISSION',
                'DELETE SCHEDULE PERMISSION',
                'GET SERVICE PERMISSION',
                'UPDATE SERVICE PERMISSION',
                'ADD SERVICE PERMISSION',
                'DELETE SERVICE PERMISSION',
                'GET RESERVATION PERMISSION',
                'UPDATE RESERVATION PERMISSION',
                'ADD RESERVATION PERMISSION',
                'DELETE RESERVATION PERMISSION',
                'GET VIP PACKAGE PERMISSION',
                'UPDATE VIP PACKAGE PERMISSION',
                'ADD VIP PACKAGE PERMISSION',
                'DELETE VIP PACKAGE PERMISSION'
            )`
		);
	}
}
