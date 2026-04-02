import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEncounters1775090712368 implements MigrationInterface {
  name = 'CreateEncounters1775090712368';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."encounters_adttype_enum" AS ENUM('A01', 'A02', 'A03', 'A08')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."encounters_status_enum" AS ENUM('ADMITTED', 'TRANSFERRED', 'DISCHARGED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."encounters_ward_enum" AS ENUM('ICU', 'INPATIENT', 'SURGERY', 'EMERGENCY')`,
    );
    await queryRunner.query(`CREATE TABLE "encounters" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
            "patientId" uuid NOT NULL, 
            "adtType" "public"."encounters_adttype_enum" NOT NULL, 
            "status" "public"."encounters_status_enum" NOT NULL DEFAULT 'ADMITTED', 
            "ward" "public"."encounters_ward_enum", 
            "admitDate" date NOT NULL, 
            "transferDate" date, 
            "dischargeDate" date, 
            "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
            CONSTRAINT "PK_b2e596be58aabc4ccc8f8458b53" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "encounters"`);
    await queryRunner.query(`DROP TYPE "public"."encounters_ward_enum"`);
    await queryRunner.query(`DROP TYPE "public"."encounters_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."encounters_adttype_enum"`);
  }
}
