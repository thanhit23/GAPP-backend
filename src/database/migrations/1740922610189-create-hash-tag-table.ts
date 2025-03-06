import { Table } from 'typeorm';
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHashTagTable1740922610189 implements MigrationInterface {
  name = 'CreateHashTagTable1740922610189';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');

    await queryRunner.createTable(
      new Table({
        name: 'post_hash',
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
          },
          {
            name: 'hash_tag_id',
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
            columnNames: ['hash_tag_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'hash_tag',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "hash_tag"');
  }
}
