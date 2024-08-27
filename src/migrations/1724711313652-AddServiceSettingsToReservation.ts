import { MigrationInterface, QueryRunner } from "typeorm";

export class AddServiceSettingsToReservation1724711313652 implements MigrationInterface {
    name = 'AddServiceSettingsToReservation1724711313652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" ADD "time" integer`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "beds_required" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "beds_required"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "time"`);
    }

}
