import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTodoPublication1735140166192 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER PUBLICATION zero_publication ADD TABLE todo;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER PUBLICATION zero_publication DROP TABLE todo;`,
    );
  }
}
