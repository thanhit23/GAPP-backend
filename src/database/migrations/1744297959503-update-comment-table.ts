import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateCommentTable1744297959503 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('comments', [
      new TableColumn({
        name: 'total_likes',
        type: 'int',
        default: 0,
      }),
      new TableColumn({
        name: 'total_replies',
        type: 'int',
        default: 0,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('comments', 'total_likes');
    await queryRunner.dropColumn('comments', 'total_replies');
  }
}
