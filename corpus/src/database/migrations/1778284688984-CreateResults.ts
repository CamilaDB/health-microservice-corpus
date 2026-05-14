import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateResults1778284688984 implements MigrationInterface {
  name = 'CreateResults1778284688984';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."results_status_enum" AS ENUM('PRELIMINARY', 'FINAL', 'CORRECTED')`,
    );
    await queryRunner.query(`
      CREATE TABLE "results" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "orderId" uuid NOT NULL,
        "value" numeric(10,2) NOT NULL,
        "unit" character varying(50) NOT NULL,
        "status" "public"."results_status_enum" NOT NULL DEFAULT 'PRELIMINARY',
        "referenceMin" numeric(10,2),
        "referenceMax" numeric(10,2),
        "resultDate" date NOT NULL,
        "sourceSystem" character varying(100),
        "notes" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_e8f2a9191c61c15b627c117a678" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "results"
      ADD CONSTRAINT "FK_results_orderId"
      FOREIGN KEY ("orderId")
      REFERENCES "orders"("id")
      ON DELETE RESTRICT
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "results" DROP CONSTRAINT "FK_results_orderId"`,
    );
    await queryRunner.query(`DROP TABLE "results"`);
    await queryRunner.query(`DROP TYPE "public"."results_status_enum"`);
  }
}
