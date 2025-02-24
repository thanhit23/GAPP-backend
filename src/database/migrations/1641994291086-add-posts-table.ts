import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPostsTable1641994291086 implements MigrationInterface {
  name = 'addPostsTable1641994291086';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE posts (
      id CHAR(36) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      username VARCHAR(255) UNIQUE NOT NULL,
      avatar VARCHAR(255),
      password VARCHAR(255) NOT NULL,
      address VARCHAR(255),
      bio VARCHAR(255)
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "posts"');
  }
}
