import type { AbstractEntity } from '../abstract.entity.ts';
import { DateField, StringField } from '../../decorators/field.decorators.ts';

export class AbstractDto {
  @StringField()
  id!: string;

  @DateField()
  createdAt!: Date;

  @DateField()
  updatedAt!: Date;

  constructor(entity: AbstractEntity, options?: { excludeFields?: boolean }) {
    if (!options?.excludeFields && entity) {
      this.id = entity.id;
      this.createdAt = entity.createdAt;
      this.updatedAt = entity.updatedAt;
    }
  }
}
