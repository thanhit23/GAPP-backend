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

    const table = await queryRunner.getTable('posts');
    if (table) {
      const titleForeignKeys = table.foreignKeys.filter((fk) =>
        fk.columnNames.includes('title'),
      );

      const descriptionForeignKeys = table.foreignKeys.filter((fk) =>
        fk.columnNames.includes('description'),
      );

      for (const fk of titleForeignKeys) {
        await queryRunner.dropForeignKey('posts', fk);
      }

      for (const fk of descriptionForeignKeys) {
        await queryRunner.dropForeignKey('posts', fk);
      }

      const hasTitleColumn = table.columns.some((col) => col.name === 'title');

      const hasDescColumn = table.columns.some(
        (col) => col.name === 'description',
      );

      if (hasTitleColumn) {
        await queryRunner.dropColumn('posts', 'title');
      }

      if (hasDescColumn) {
        await queryRunner.dropColumn('posts', 'description');
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'posts',
      new TableColumn({
        name: 'title',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'posts',
      new TableColumn({
        name: 'description',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.dropColumn('posts', 'content');
  }
}
