import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePatients1775000151717 implements MigrationInterface {
  name = 'CreatePatients1775000151717';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `CREATE TYPE "public"."patients_sex_enum" AS ENUM('M', 'F', 'U')`,
    );
    await queryRunner.query(
      `CREATE TABLE "patients" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
        "name" character varying(255) NOT NULL, 
        "birthDate" date NOT NULL, 
        "cpf" character varying(11) NOT NULL, 
        "sex" "public"."patients_sex_enum" NOT NULL, 
        "email" character varying(255), 
        "phone" character varying(20), 
        "active" boolean NOT NULL DEFAULT true, 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
        CONSTRAINT "UQ_5947301223f5a908fd5e372b0fb" UNIQUE ("cpf"), 
        CONSTRAINT "UQ_64e2031265399f5690b0beba6a5" UNIQUE ("email"), 
        CONSTRAINT "PK_a7f0b9fcbb3469d5ec0b0aceaa7" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "patients"`);
    await queryRunner.query(`DROP TYPE "public"."patients_sex_enum"`);
  }
}
