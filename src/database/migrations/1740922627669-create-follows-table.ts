import { Table } from 'typeorm';
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFollowsTable1740922627669 implements MigrationInterface {
  name = 'CreateFollowsTable1740922627669';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'follows',
        columns: [
          {
            name: 'id',
            type: 'char',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'source_user_id',
            type: 'char',
            length: '36',
          },
          {
            name: 'target_user_id',
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
            columnNames: ['source_user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['target_user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "follows"');
  }
}
