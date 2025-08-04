import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexForPostIdParentIdToCommentTable1746452600874
  implements MigrationInterface
{
  name = 'AddIndexForPostIdParentIdToCommentTable1746452600874';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX IDX_COMMENT_POST_ID ON comments (post_id, created_at DESC);`,
    );
    await queryRunner.query(
      `CREATE INDEX IDX_COMMENT_PARENT_ID ON comments (parent_id, created_at DESC);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IDX_COMMENT_POST_ID`);
    await queryRunner.query(`DROP INDEX IDX_COMMENT_PARENT_ID`);
    await queryRunner.query(`DROP INDEX IDX_COMMENT_CREATED_AT`);
  }
}
