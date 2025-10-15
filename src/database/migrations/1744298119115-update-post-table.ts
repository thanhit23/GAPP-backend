import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdatePostTable1744298119115 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('posts', [
      new TableColumn({
        name: 'total_likes',
        type: 'int',
        default: 0,
      }),
      new TableColumn({
        name: 'total_comments',
        type: 'int',
        default: 0,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('posts', 'total_likes');
    await queryRunner.dropColumn('posts', 'total_comments');
  }
}
