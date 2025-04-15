import { StringField } from '../../../decorators/field.decorators.ts';

export class FollowUserDto {
  @StringField()
  sourceUserId!: string;

  @StringField()
  targetUserId!: string;
}
