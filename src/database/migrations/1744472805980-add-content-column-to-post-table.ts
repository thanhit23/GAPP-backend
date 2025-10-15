import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddContentColumnToPostTable1744472805980
  implements MigrationInterface
{
  name = 'AddContentColumnToPostTable1744472805980';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'posts',
      new TableColumn({
        name: 'content',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.dropColumns('posts', [
      new TableColumn({
        name: 'title',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'description',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('posts', [
      new TableColumn({
        name: 'title',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'description',
        type: 'varchar',
        isNullable: true,
      }),
    ]);

    await queryRunner.dropColumn('posts', 'content');
  }
}
