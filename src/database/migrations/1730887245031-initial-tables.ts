import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialTables1730887245031 implements MigrationInterface {
  name = 'InitialTables1730887245031';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."user_role_enum" AS ENUM('User', 'Admin')
        `);
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "role" "public"."user_role_enum" NOT NULL DEFAULT 'User',
                "username" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying,
                "bio" character varying,
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_070157ac5f9096d1a00bab15aa" ON "user" ("username")
            WHERE "deletedAt" IS NULL
        `);
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_d0012b9482ca5b4f270e6fdb5e" ON "user" ("email")
            WHERE "deletedAt" IS NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_d0012b9482ca5b4f270e6fdb5e"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_070157ac5f9096d1a00bab15aa"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."user_role_enum"
        `);
  }
}
