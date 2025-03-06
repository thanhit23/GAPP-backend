import { Table } from 'typeorm';
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLikesTable1740891570161 implements MigrationInterface {
  name = 'CreateLikesTable1740891570161';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');

    await queryRunner.createTable(
      new Table({
        name: 'likes',
        columns: [
          {
            name: 'id',
            type: 'char',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'post_id',
            type: 'char',
            length: '36',
            isNullable: true,
          },
          {
            name: 'comment_id',
            type: 'char',
            length: '36',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'char',
            length: '36',
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
        foreignKeys: [
          {
            columnNames: ['post_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'posts',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['comment_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'comments',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "likes"');
  }
}
