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
                "title" character varying NOT NULL,
                "description" character varying,
                "isCompleted" boolean NOT NULL DEFAULT false,
                "completedAt" TIMESTAMP,
                CONSTRAINT "PK_d429b7114371f6a35c5cb4776a7" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "todo"
        `);
  }
}
