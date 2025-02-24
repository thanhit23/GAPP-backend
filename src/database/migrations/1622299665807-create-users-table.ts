import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1622299665807 implements MigrationInterface {
  name = 'createUsersTable1622299665807';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE Users (
        id CHAR(36) PRIMARY KEY DEFAULT (uuid()),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        username VARCHAR(255) UNIQUE NOT NULL,
        avatar VARCHAR(255),
        password VARCHAR(255) NOT NULL,
        address VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        bio VARCHAR(255)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "users"');
  }
}

// CREATE TABLE Posts (
//   id CHAR(36) PRIMARY KEY,
//   content VARCHAR(225),
//   image VARCHAR(255),
//   user_id CHAR(36) NOT NULL,
//   FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
// );

// CREATE TABLE Comments (
//   id CHAR(36) PRIMARY KEY,
//   content VARCHAR(225),
//   parent_id CHAR(36),
//   user_id CHAR(36) NOT NULL,
//   post_id CHAR(36) NOT NULL,
//   FOREIGN KEY (parent_id) REFERENCES Comments(id) ON DELETE CASCADE,
//   FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
//   FOREIGN KEY (post_id) REFERENCES Posts(id) ON DELETE CASCADE
// );

// CREATE TABLE Likes (
//   id CHAR(36) PRIMARY KEY,
//   post_id CHAR(36),
//   comment_id CHAR(36),
//   user_id CHAR(36) NOT NULL,
//   FOREIGN KEY (post_id) REFERENCES Posts(id) ON DELETE CASCADE,
//   FOREIGN KEY (comment_id) REFERENCES Comments(id) ON DELETE CASCADE,
//   FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
// );

// CREATE TABLE Follows (
//   id CHAR(36) PRIMARY KEY,
//   source_user_id CHAR(36) NOT NULL,
//   target_user_id CHAR(36) NOT NULL,
//   FOREIGN KEY (source_user_id) REFERENCES Users(id) ON DELETE CASCADE,
//   FOREIGN KEY (target_user_id) REFERENCES Users(id) ON DELETE CASCADE
// );

// CREATE TABLE Hash_tag (
//   id CHAR(36) PRIMARY KEY,
//   name VARCHAR(255) UNIQUE NOT NULL
// );

// CREATE TABLE Post_Hash (
//   id CHAR(36) PRIMARY KEY,
//   post_id CHAR(36) NOT NULL,
//   hash_tag_id CHAR(36) NOT NULL,
//   FOREIGN KEY (post_id) REFERENCES Posts(id) ON DELETE CASCADE,
//   FOREIGN KEY (hash_tag_id) REFERENCES Hash_tag(id) ON DELETE CASCADE
// );

// CREATE TABLE News_feed (
//   id CHAR(36) PRIMARY KEY,
//   user_id CHAR(36) NOT NULL,
//   post_id CHAR(36) NOT NULL,
//   FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
//   FOREIGN KEY (post_id) REFERENCES Posts(id) ON DELETE CASCADE
// );

