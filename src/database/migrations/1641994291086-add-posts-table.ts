import { Table, TableForeignKey } from 'typeorm';
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPostsTable1641994291086 implements MigrationInterface {
  name = 'addPostsTable1641994291086';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Posts',
        columns: [
          {
            name: 'title',
            type: 'varchar',
            length: '225',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '225',
          },
          {
            name: 'image',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'user_id',
            type: 'char',
            length: '36',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'Posts',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'Users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "Posts"');
  }
}
