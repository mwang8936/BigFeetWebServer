import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1723944254314 implements MigrationInterface {
    name = 'CreateTables1723944254314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customers" ("customer_id" SERIAL NOT NULL, "phone_number" character varying(10), "vip_serial" character varying(6), "customer_name" character varying(60), "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_6c444ce6637f2c1d71c3cf136c1" PRIMARY KEY ("customer_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."services_color_enum" AS ENUM('RED', 'BLUE', 'YELLOW', 'GREEN', 'ORANGE', 'PURPLE', 'GRAY', 'BLACK')`);
        await queryRunner.query(`CREATE TABLE "services" ("service_id" SERIAL NOT NULL, "service_name" character varying(30) NOT NULL, "shorthand" character varying(20) NOT NULL, "time" integer NOT NULL, "money" numeric(5,2) NOT NULL, "body" numeric(2,1) NOT NULL DEFAULT '0', "feet" numeric(2,1) NOT NULL DEFAULT '0', "acupuncture" numeric(2,1) NOT NULL DEFAULT '0', "beds_required" integer NOT NULL DEFAULT '0', "color" "public"."services_color_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_ef0531b9789b488593690ab8d5d" PRIMARY KEY ("service_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."reservations_requested_gender_enum" AS ENUM('MALE', 'FEMALE')`);
        await queryRunner.query(`CREATE TYPE "public"."reservations_tip_method_enum" AS ENUM('CASH', 'MACHINE', 'HALF')`);
        await queryRunner.query(`CREATE TABLE "reservations" ("reservation_id" SERIAL NOT NULL, "reserved_date" TIMESTAMP NOT NULL, "date" date NOT NULL, "employee_id" integer NOT NULL, "requested_gender" "public"."reservations_requested_gender_enum", "requested_employee" boolean NOT NULL DEFAULT false, "cash" numeric(5,2), "machine" numeric(5,2), "vip" numeric(5,2), "gift_card" numeric(5,2), "insurance" numeric(5,2), "tips" numeric(6,2), "tip_method" "public"."reservations_tip_method_enum", "message" text, "created_by" character varying(200) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying(200) NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "service_id" integer, "customer_id" integer, CONSTRAINT "PK_414a88401d7ab4ce981a69784bb" PRIMARY KEY ("reservation_id"))`);
        await queryRunner.query(`CREATE TABLE "vip_packages_sold" ("serial" character varying(6) NOT NULL, "sold_amount" numeric(8,2) NOT NULL, "commission_amount" numeric(8,2) NOT NULL, "employee_ids" integer array NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8508b40e09fb8ab183e14e0ae29" PRIMARY KEY ("serial"))`);
        await queryRunner.query(`CREATE TABLE "schedules" ("date" date NOT NULL, "employee_id" integer NOT NULL, "working" boolean NOT NULL DEFAULT false, "on_call" boolean NOT NULL DEFAULT false, "start" TIME, "end" TIME, "priority" integer, "signed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_e6eba7dd883112382b106450b2f" PRIMARY KEY ("date", "employee_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."employees_gender_enum" AS ENUM('MALE', 'FEMALE')`);
        await queryRunner.query(`CREATE TYPE "public"."employees_role_enum" AS ENUM('SOFTWARE DEVELOPER', 'MANAGER', 'RECEPTIONIST', 'STORE EMPLOYEE', 'OTHER')`);
        await queryRunner.query(`CREATE TYPE "public"."employees_permissions_enum" AS ENUM('GET CUSTOMER PERMISSION', 'UPDATE CUSTOMER PERMISSION', 'ADD CUSTOMER PERMISSION', 'DELETE CUSTOMER PERMISSION', 'GET EMPLOYEE PERMISSION', 'UPDATE EMPLOYEE PERMISSION', 'ADD EMPLOYEE PERMISSION', 'DELETE EMPLOYEE PERMISSION', 'GET GIFT CARD PERMISSION', 'UPDATE GIFT CARD PERMISSION', 'ADD GIFT CARD PERMISSION', 'DELETE GIFT CARD PERMISSION', 'GET SCHEDULE PERMISSION', 'UPDATE SCHEDULE PERMISSION', 'ADD SCHEDULE PERMISSION', 'DELETE SCHEDULE PERMISSION', 'GET SERVICE PERMISSION', 'UPDATE SERVICE PERMISSION', 'ADD SERVICE PERMISSION', 'DELETE SERVICE PERMISSION', 'GET RESERVATION PERMISSION', 'UPDATE RESERVATION PERMISSION', 'ADD RESERVATION PERMISSION', 'DELETE RESERVATION PERMISSION', 'GET VIP PACKAGE PERMISSION', 'UPDATE VIP PACKAGE PERMISSION', 'ADD VIP PACKAGE PERMISSION', 'DELETE VIP PACKAGE PERMISSION')`);
        await queryRunner.query(`CREATE TYPE "public"."employees_language_enum" AS ENUM('ENGLISH', 'SIMPLIFIED CHINESE', 'TRADITIONAL CHINESE')`);
        await queryRunner.query(`CREATE TABLE "employees" ("employee_id" SERIAL NOT NULL, "username" character varying(30) NOT NULL, "password" character varying(60) NOT NULL, "first_name" character varying(30) NOT NULL, "last_name" character varying(30) NOT NULL, "gender" "public"."employees_gender_enum" NOT NULL, "role" "public"."employees_role_enum" NOT NULL, "permissions" "public"."employees_permissions_enum" array NOT NULL DEFAULT '{}', "body_rate" numeric(4,2), "feet_rate" numeric(4,2), "acupuncture_rate" numeric(4,2), "per_hour" numeric(4,2), "language" "public"."employees_language_enum" NOT NULL DEFAULT 'ENGLISH', "dark_mode" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_c9a09b8e6588fb4d3c9051c8937" PRIMARY KEY ("employee_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."gift_cards_sold_payment_method_enum" AS ENUM('CASH', 'MACHINE')`);
        await queryRunner.query(`CREATE TABLE "gift_cards_sold" ("gift_card_id" character varying(8) NOT NULL, "date" date NOT NULL, "payment_method" "public"."gift_cards_sold_payment_method_enum" NOT NULL, "payment_amount" numeric(6,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_45d4683dfda6781f339c82426a9" PRIMARY KEY ("gift_card_id"))`);
        await queryRunner.query(`CREATE TABLE "schedules_vip_packages_vip_packages_sold" ("date" date NOT NULL, "employee_id" integer NOT NULL, "serial" character varying(6) NOT NULL, CONSTRAINT "PK_5e081c90eb996c1c6710c6d1be4" PRIMARY KEY ("date", "employee_id", "serial"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6af030a28b4787178a6a317229" ON "schedules_vip_packages_vip_packages_sold" ("date", "employee_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a280bd5bfb79c663644b3cde55" ON "schedules_vip_packages_vip_packages_sold" ("serial") `);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_0ace9dfa2bc3a4d8a25dfe3b954" FOREIGN KEY ("date", "employee_id") REFERENCES "schedules"("date","employee_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_f9a66ac5e3a797ee7d588334c18" FOREIGN KEY ("service_id") REFERENCES "services"("service_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_f63cb79a34cdf2d47ab23f31a8b" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "schedules" ADD CONSTRAINT "FK_1144b8bcbcd2aa7e6a441f06792" FOREIGN KEY ("employee_id") REFERENCES "employees"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "schedules_vip_packages_vip_packages_sold" ADD CONSTRAINT "FK_6af030a28b4787178a6a317229e" FOREIGN KEY ("date", "employee_id") REFERENCES "schedules"("date","employee_id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "schedules_vip_packages_vip_packages_sold" ADD CONSTRAINT "FK_a280bd5bfb79c663644b3cde55e" FOREIGN KEY ("serial") REFERENCES "vip_packages_sold"("serial") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedules_vip_packages_vip_packages_sold" DROP CONSTRAINT "FK_a280bd5bfb79c663644b3cde55e"`);
        await queryRunner.query(`ALTER TABLE "schedules_vip_packages_vip_packages_sold" DROP CONSTRAINT "FK_6af030a28b4787178a6a317229e"`);
        await queryRunner.query(`ALTER TABLE "schedules" DROP CONSTRAINT "FK_1144b8bcbcd2aa7e6a441f06792"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_f63cb79a34cdf2d47ab23f31a8b"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_f9a66ac5e3a797ee7d588334c18"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_0ace9dfa2bc3a4d8a25dfe3b954"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a280bd5bfb79c663644b3cde55"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6af030a28b4787178a6a317229"`);
        await queryRunner.query(`DROP TABLE "schedules_vip_packages_vip_packages_sold"`);
        await queryRunner.query(`DROP TABLE "gift_cards_sold"`);
        await queryRunner.query(`DROP TYPE "public"."gift_cards_sold_payment_method_enum"`);
        await queryRunner.query(`DROP TABLE "employees"`);
        await queryRunner.query(`DROP TYPE "public"."employees_language_enum"`);
        await queryRunner.query(`DROP TYPE "public"."employees_permissions_enum"`);
        await queryRunner.query(`DROP TYPE "public"."employees_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."employees_gender_enum"`);
        await queryRunner.query(`DROP TABLE "schedules"`);
        await queryRunner.query(`DROP TABLE "vip_packages_sold"`);
        await queryRunner.query(`DROP TABLE "reservations"`);
        await queryRunner.query(`DROP TYPE "public"."reservations_tip_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."reservations_requested_gender_enum"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TYPE "public"."services_color_enum"`);
        await queryRunner.query(`DROP TABLE "customers"`);
    }

}
