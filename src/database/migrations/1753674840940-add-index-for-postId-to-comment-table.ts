import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexForPostIdToCommentTable1753674840940
  implements MigrationInterface
{
  name = 'AddIndexForPostIdToCommentTable1753674840940';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX IDX_COMMENTS_POST ON comments (post_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX IDX_COMMENTS_POST_ID_COVERING ON comments (post_id, id);`,
    );
    await queryRunner.query(
      `CREATE INDEX IDX_COMMENTS_POST_USER ON comments (post_id, user_id, id);`,
    );
    await queryRunner.query(
      `CREATE INDEX IDX_USERS_ID_OPTIMIZED ON users (id);`,
    );
    await queryRunner.query(
      `CREATE INDEX IDX_COMMENTS_MULTI_COLUMN ON comments (post_id, user_id, created_at, id);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IDX_COMMENTS_POST`);
    await queryRunner.query(`DROP INDEX IDX_COMMENTS_POST_ID_COVERING`);
    await queryRunner.query(`DROP INDEX IDX_COMMENTS_POST_USER`);
    await queryRunner.query(`DROP INDEX IDX_USERS_ID_OPTIMIZED`);
    await queryRunner.query(`DROP INDEX IDX_COMMENTS_MULTI_COLUMN`);
  }
}
