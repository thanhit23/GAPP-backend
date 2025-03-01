import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity.ts';
import { UseDto } from '../../decorators/use-dto.decorator.ts';
import { PostEntity } from '../post/post.entity.ts';
import { UserDto } from './dtos/user.dto.ts';

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity {
  @Column({ unique: true, nullable: true, type: 'varchar' })
  email!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  name!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  username!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  avatar!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  password!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  address!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  bio!: string | null;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts?: PostEntity[];
}
