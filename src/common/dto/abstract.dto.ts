import type { AbstractEntity } from '../abstract.entity.ts';
import { DateField, StringField } from '../../decorators/field.decorators.ts';

export class AbstractDto {
  @StringField()
  id!: string;

  @DateField()
  created_at!: Date;

  @DateField()
  updated_at!: Date;

  constructor(entity: AbstractEntity, options?: { excludeFields?: boolean }) {
    if (!options?.excludeFields && entity) {
      this.id = entity.id;
      this.created_at = entity.created_at;
      this.updated_at = entity.updated_at;
    }
  }
}
