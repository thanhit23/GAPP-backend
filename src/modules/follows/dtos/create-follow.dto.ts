import {
  StringField,
  StringFieldOptional,
} from '../../../decorators/field.decorators.ts';

export class FollowUserDto {
  @StringFieldOptional()
  sourceUserId?: string;

  @StringField()
  targetUserId!: string;
}
