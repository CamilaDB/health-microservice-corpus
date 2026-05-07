import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrders1777928401888 implements MigrationInterface {
  name = 'CreateOrders1777928401888';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."orders_examtype_enum" AS ENUM('HEMOGRAM', 'GLUCOSE', 'CREATININE', 'TSH', 'URINE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_enum" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`,
    );
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "encounterId" uuid NOT NULL,
        "examType" "public"."orders_examtype_enum" NOT NULL,
        "status" "public"."orders_status_enum" NOT NULL DEFAULT 'PENDING',
        "requestedAt" date NOT NULL,
        "requestedBy" character varying(255) NOT NULL,
        "notes" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "orders"
      ADD CONSTRAINT "FK_orders_encounterId"
      FOREIGN KEY ("encounterId")
      REFERENCES "encounters"("id")
      ON DELETE RESTRICT
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_orders_encounterId"`,
    );
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."orders_examtype_enum"`);
  }
}
