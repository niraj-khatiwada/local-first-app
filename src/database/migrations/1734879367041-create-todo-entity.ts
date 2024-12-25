import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTodoEntity1734879367041 implements MigrationInterface {
  name = 'CreateTodoEntity1734879367041';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "todo" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "createdByUserId" uuid NOT NULL,
                "updatedByUserId" uuid NOT NULL,
                "deletedByUserId" uuid,
                "title" character varying NOT NULL,
                "description" character varying,
                "isCompleted" boolean NOT NULL DEFAULT false,
                "completedAt" TIMESTAMP,
                CONSTRAINT "PK_d429b7114371f6a35c5cb4776a7" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_55a40a527ac251eaec9380116e" ON "todo" ("createdByUserId")
            WHERE "deletedAt" IS NULL
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_f4bb90320110ef94267b32d3ed" ON "todo" ("updatedByUserId")
            WHERE "deletedAt" IS NULL
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_24333b00aa5da2eba9c8348e48" ON "todo" ("deletedByUserId")
            WHERE "deletedAt" IS NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "todo"
            ADD CONSTRAINT "FK_c79681af2867d6f762d94b885a9" FOREIGN KEY ("createdByUserId") REFERENCES "user"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "todo"
            ADD CONSTRAINT "FK_f79f1343697db2b88006636b1f4" FOREIGN KEY ("updatedByUserId") REFERENCES "user"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "todo"
            ADD CONSTRAINT "FK_87036916af3e9e9c2829547b569" FOREIGN KEY ("deletedByUserId") REFERENCES "user"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "todo" DROP CONSTRAINT "FK_87036916af3e9e9c2829547b569"
        `);
    await queryRunner.query(`
            ALTER TABLE "todo" DROP CONSTRAINT "FK_f79f1343697db2b88006636b1f4"
        `);
    await queryRunner.query(`
            ALTER TABLE "todo" DROP CONSTRAINT "FK_c79681af2867d6f762d94b885a9"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_24333b00aa5da2eba9c8348e48"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_f4bb90320110ef94267b32d3ed"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_55a40a527ac251eaec9380116e"
        `);
    await queryRunner.query(`
            DROP TABLE "todo"
        `);
  }
}
