import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddFollowCountColumnToUserTable1744944317974
  implements MigrationInterface
{
  name = 'AddFollowCountColumnToUserTable1744944317974';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'total_follower',
        type: 'int',
        default: 0,
      }),
      new TableColumn({
        name: 'total_following',
        type: 'int',
        default: 0,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'total_follower');
    await queryRunner.dropColumn('users', 'total_following');
  }
}
