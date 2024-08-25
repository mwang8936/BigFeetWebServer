import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAwardToSchedules1724557663145 implements MigrationInterface {
    name = 'AddAwardToSchedules1724557663145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedules" ADD "add_award" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedules" DROP COLUMN "add_award"`);
    }

}
