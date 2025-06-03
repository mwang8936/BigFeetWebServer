import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNonAcupuncturistInsuranceToAcupunctureReport1748915937130
	implements MigrationInterface
{
	name = 'AddNonAcupuncturistInsuranceToAcupunctureReport1748915937130';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "acupuncture_report" ADD "non_acupuncturist_insurance_percentage" numeric(5,4) NOT NULL DEFAULT '0.7'`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "acupuncture_report" DROP COLUMN "non_acupuncturist_insurance_percentage"`
		);
	}
}
